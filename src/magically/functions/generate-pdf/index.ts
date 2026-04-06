/**
 * StackPDF - PDF Generation Edge Function
 * 
 * Cloudflare Worker that generates PDFs from uploaded images using CloudConvert API
 * 
 * Input:
 * - imageUrls: string[] - Array of cloud storage URLs for images
 * - pdfName: string - Name for the PDF file
 * 
 * Output:
 * - pdfUrl: string - URL to the generated PDF
 * - fileSize: number - Size of the PDF in bytes
 */

import { MagicallySDK } from 'magically-sdk';

interface Env {
  MAGICALLY_PROJECT_ID: string;
  MAGICALLY_API_BASE_URL: string;
  MAGICALLY_API_KEY: string;
  CLOUDCONVERT_API_KEY?: string;
}

interface GeneratePDFRequest {
  imageUrls: string[];
  pdfName: string;
}

interface GeneratePDFResponse {
  pdfUrl: string;
  fileSize: number;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Initialize SDK with environment variables
    const magically = new MagicallySDK({
      projectId: env.MAGICALLY_PROJECT_ID,
      apiUrl: env.MAGICALLY_API_BASE_URL,
      apiKey: env.MAGICALLY_API_KEY,
    });

    // Only allow POST requests
    if (request.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { 'Content-Type': 'application/json' } }
      );
    }

    try {
      // Parse request body
      const body = await request.json() as GeneratePDFRequest;
      const { imageUrls, pdfName } = body;

      // Validate input
      if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
        return new Response(
          JSON.stringify({ error: 'imageUrls is required and must be a non-empty array' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      if (!pdfName || typeof pdfName !== 'string') {
        return new Response(
          JSON.stringify({ error: 'pdfName is required and must be a string' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Maximum 200 images
      if (imageUrls.length > 200) {
        return new Response(
          JSON.stringify({ error: 'Maximum 200 images allowed' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Check if CloudConvert API key is configured
      if (!env.CLOUDCONVERT_API_KEY) {
        return new Response(
          JSON.stringify({ 
            error: 'CloudConvert API key not configured',
            details: 'Please add CLOUDCONVERT_API_KEY to your edge function secrets'
          }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Step 1: Create CloudConvert job
      const jobResponse = await fetch('https://api.cloudconvert.com/v2/jobs', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.CLOUDCONVERT_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tasks: {
            // Import all images
            ...imageUrls.reduce((acc, url, index) => {
              acc[`import-image-${index}`] = {
                operation: 'import/url',
                url: url,
                filename: `image-${index}.jpg`,
              };
              return acc;
            }, {} as any),
            // Merge images to PDF
            'merge-to-pdf': {
              operation: 'merge',
              input: imageUrls.map((_, index) => `import-image-${index}`),
              output_format: 'pdf',
              engine: 'pdftk',
              page_orientation: 'portrait',
            },
            // Export PDF
            'export-pdf': {
              operation: 'export/url',
              input: 'merge-to-pdf',
            },
          },
        }),
      });

      if (!jobResponse.ok) {
        const errorData = await jobResponse.json();
        throw new Error(`CloudConvert API error: ${JSON.stringify(errorData)}`);
      }

      const job = await jobResponse.json();
      const jobId = job.data.id;

      // Step 2: Wait for job to complete (poll every 2 seconds, max 2 minutes)
      let attempts = 0;
      const maxAttempts = 60;
      let jobStatus = null;

      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 2000));

        const statusResponse = await fetch(`https://api.cloudconvert.com/v2/jobs/${jobId}`, {
          headers: {
            'Authorization': `Bearer ${env.CLOUDCONVERT_API_KEY}`,
          },
        });

        const statusData = await statusResponse.json();
        jobStatus = statusData.data.status;

        if (jobStatus === 'finished') {
          // Get export task to retrieve PDF URL
          const exportTask = statusData.data.tasks.find((t: any) => t.name === 'export-pdf');
          if (!exportTask || !exportTask.result || !exportTask.result.files || !exportTask.result.files.length) {
            throw new Error('PDF export failed - no file generated');
          }

          const cloudConvertPdfUrl = exportTask.result.files[0].url;

          // Step 3: Download PDF and upload to Magically storage
          const pdfResponse = await fetch(cloudConvertPdfUrl);
          if (!pdfResponse.ok) {
            throw new Error('Failed to download generated PDF');
          }

          const pdfBlob = await pdfResponse.blob();
          const pdfFile = new File([pdfBlob], `${pdfName}.pdf`, { type: 'application/pdf' });

          // Upload to Magically storage
          const uploadResult = await magically.files.upload(pdfFile);

          const response: GeneratePDFResponse = {
            pdfUrl: uploadResult.url,
            fileSize: pdfBlob.size,
          };

          return new Response(
            JSON.stringify(response),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            }
          );
        }

        if (jobStatus === 'error') {
          throw new Error('CloudConvert job failed');
        }

        attempts++;
      }

      throw new Error('PDF generation timeout - job did not complete in time');

    } catch (error: any) {
      console.error('PDF generation error:', error);

      return new Response(
        JSON.stringify({
          error: 'Failed to generate PDF',
          details: error.message,
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  },
};
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import magically from 'magically-sdk';
import { MagicallyAlert } from '../components/ui';
import { ImageItem } from '../stores/pdfStore';
import { PDFDocument, rgb } from 'pdf-lib';

// Import pdf-lib only on web
let PDFDocumentLib: any = null;
const isWeb = Platform.OS === 'web';

if (isWeb) {
  // Dynamic import for web
  import('pdf-lib').then(module => {
    PDFDocumentLib = module;
  }).catch(err => {
    console.error('Failed to load pdf-lib:', err);
  });
}

export interface PDFGenerationOptions {
  images: ImageItem[];
  pdfName: string;
  onProgress?: (progress: number, status: string) => void;
}



class PDFService {
  /**
   * Generate PDF from images using local generation on web or cloud on mobile
   * Works on all platforms (web, iOS, Android)
   */
  async generatePDF(
    images: ImageItem[],
    pdfName: string,
    onProgress: (progress: number, status: string) => void
  ): Promise<string> {
    try {
      onProgress(5, 'Preparing images...');

      // On web, generate PDF locally without authentication
      if (isWeb) {
        return await this.generatePDFLocally(images, pdfName, onProgress);
      }

      // On mobile, use cloud generation (requires auth - but we'll handle gracefully)
      onProgress(10, 'Uploading images...');

      // Step 1: Upload all images to cloud storage
      const imageUrls: string[] = [];
      const totalImages = images.length;

      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        onProgress(
          10 + (i / totalImages) * 60,
          `Uploading image ${i + 1}/${totalImages}...`
        );

        try {
          // Convert URI to File - preserve original filename
          const fileName = image.name || `image-${i}.jpg`;
          const file = await magically.files.convertUriToFile(
            image.uri,
            fileName,
            'image/jpeg'
          );

          // Upload to cloud storage
          const uploadResult = await magically.files.upload(file);
          
          if (!uploadResult.url) {
            throw new Error(`Failed to upload image: ${image.name}`);
          }

          imageUrls.push(uploadResult.url);
        } catch (error: any) {
          console.error('Image upload error:', error);
          // Fallback to local generation on auth error
          if (error.message.includes('not authenticated')) {
            return await this.generatePDFLocally(images, pdfName, onProgress);
          }
          throw new Error(`Failed to upload image ${i + 1}: ${error.message}`);
        }
      }

      onProgress(70, 'Generating PDF...');

      // Step 2: Call edge function to generate PDF from uploaded images
      const pdfResult = await magically.functions.invoke('generate-pdf', {
        body: {
          imageUrls,
          pdfName,
        },
      });

      if (!pdfResult.data || !pdfResult.data.pdfUrl) {
        throw new Error('PDF generation failed - no URL returned');
      }

      onProgress(100, 'PDF created successfully!');

      return pdfResult.data.pdfUrl;
    } catch (error: any) {
      console.error('PDF generation error:', error);
      // Fallback to local generation on any error
      if (isWeb || error.message.includes('not authenticated')) {
        return await this.generatePDFLocally(images, pdfName, onProgress);
      }
      throw error;
    }
  }

  /**
   * Generate PDF locally on web using pdf-lib
   */
  private async generatePDFLocally(
    images: ImageItem[],
    pdfName: string,
    onProgress: (progress: number, status: string) => void
  ): Promise<string> {
    onProgress(20, 'Loading PDF library...');
    
    onProgress(25, 'Loading images...');
    
    // Load all images
    const loadedImages: { bytes: Uint8Array, width: number, height: number }[] = [];
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      onProgress(
        25 + (i / images.length) * 25,
        `Loading image ${i + 1}/${images.length}...`
      );

      try {
        // Fetch image as array buffer
        const response = await fetch(image.uri);
        const arrayBuffer = await response.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        
        // Get image dimensions
        const img = new Image();
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => reject(new Error('Image load timeout')), 10000);
          
          img.onload = () => {
            clearTimeout(timeout);
            resolve(null);
          };
          img.onerror = () => {
            clearTimeout(timeout);
            reject(new Error(`Failed to load image: ${image.name}`));
          };
          img.src = image.uri;
        });
        
        loadedImages.push({
          bytes,
          width: img.width || 800,
          height: img.height || 600
        });
      } catch (error: any) {
        throw new Error(`Failed to process image ${image.name}: ${error.message}`);
      }
    }

    onProgress(60, 'Creating PDF...');

    // Calculate total height for stacked images
    const pageWidth = 595.28; // Standard A4 width in points
    const maxHeight = 500000; // Increased maximum PDF height to support very tall PDFs
    let totalHeight = 0;
    const imageScales: number[] = [];

    // Calculate scale for each image to fit page width
    for (const imageData of loadedImages) {
      const scale = pageWidth / imageData.width;
      imageScales.push(scale);
      totalHeight += imageData.height * scale;
    }

    // Limit height to maximum
    const finalHeight = Math.min(totalHeight, maxHeight);

    // Create PDF document with custom dimensions
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([pageWidth, finalHeight]);

    // Stack all images vertically on the same page
    let currentY = finalHeight; // Start from top

    for (let i = 0; i < loadedImages.length; i++) {
      onProgress(
        60 + (i / loadedImages.length) * 30,
        `Adding image ${i + 1}/${loadedImages.length} to PDF...`
      );

      const imageData = loadedImages[i];
      const scale = imageScales[i];
      
      const scaledWidth = pageWidth;
      const scaledHeight = imageData.height * scale;
      
      // Move up for current image
      currentY -= scaledHeight;
      
      try {
        // Embed image
        const imageEmbed = await pdfDoc.embedJpg(imageData.bytes);
        
        // Draw image at current position
        page.drawImage(imageEmbed, {
          x: 0,
          y: currentY,
          width: scaledWidth,
          height: scaledHeight,
        });
      } catch (error) {
        // If JPEG fails, try PNG
        try {
          const imageEmbed = await pdfDoc.embedPng(imageData.bytes);
          
          page.drawImage(imageEmbed, {
            x: 0,
            y: currentY,
            width: scaledWidth,
            height: scaledHeight,
          });
        } catch (pngError) {
          console.error('Failed to embed image:', pngError);
          throw new Error(`Failed to add image ${i + 1} to PDF`);
        }
      }
    }

    onProgress(95, 'Finalizing PDF...');

    // Serialize PDF to bytes
    const pdfBytes = await pdfDoc.save();
    
    // Create blob and URL - cast to ArrayBuffer to resolve type issues
    const arrayBuffer = pdfBytes.buffer as ArrayBuffer;
    const pdfBlob = new Blob([arrayBuffer], { type: 'application/pdf' });
    const pdfUrl = URL.createObjectURL(pdfBlob);

    onProgress(100, 'PDF created successfully!');

    return pdfUrl;
  }

  /**
   * Download and share PDF file
   */
  async downloadAndSharePDF(pdfUrl: string, pdfName: string): Promise<void> {
    try {
      // On web, fetch PDF as blob and trigger download (bypasses ad blockers)
      if (Platform.OS === 'web') {
        const response = await fetch(pdfUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `${pdfName}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        MagicallyAlert.alert('Success', 'PDF downloaded successfully');
        return;
      }

      // On native, download and share
      // Sanitize filename: remove slashes and special characters
      const sanitizedName = pdfName.replace(/[\/\\:*?"<>|]/g, '-');
      const fileName = `${sanitizedName}.pdf`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      // Download the PDF
      const downloadResult = await FileSystem.downloadAsync(pdfUrl, fileUri);

      if (downloadResult.status === 200) {
        // Share the file
        const canShare = await Sharing.isAvailableAsync();
        if (canShare) {
          await Sharing.shareAsync(downloadResult.uri);
        } else {
          MagicallyAlert.alert('Success', `PDF saved to ${downloadResult.uri}`);
        }
      } else {
        throw new Error('Download failed');
      }
    } catch (error: any) {
      console.error('Download error:', error);
      MagicallyAlert.alert('Error', 'Failed to download PDF');
    }
  }



}

export const pdfService = new PDFService();
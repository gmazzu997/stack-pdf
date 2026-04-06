# PROJECT CONTEXT

<!-- METADATA_START -->
Last-Summarized-Message: a5774eab-92e3-4840-8cca-5dfe76a1883d
Last-Updated: 2026-03-31T11:16:41.722Z
Summarization-Version: 1.0
<!-- METADATA_END -->

## DECISION TREE
<!-- DECISION_TREE_START -->
StackPDF
├── [2026-03-31T11:04:42.181Z] Product is an app that converts up to 200 photos into a margin-free PDF with vertically stacked images
├── [2026-03-31T11:06:20.707Z] Target audience: Students, professionals, and anyone needing to combine multiple photos into a single PDF for sharing or archiving
├── [2026-03-31T11:06:20.707Z] Core value proposition: Simplifies creating clean, professional PDFs from multiple photos without complex software or unwanted margins
├── [2026-03-31T11:06:20.707Z] Major features: photo selection (up to 200), drag-and-drop reorder, live PDF preview, margin-free PDF generation, save to device, conversion history tracking
├── [2026-03-31T11:06:20.707Z] Business model: Free forever, no ads, no subscriptions
├── [2026-03-31T11:06:20.707Z] Design style: Dark premium with blue accents
└── [2026-03-31T11:06:20.707Z] Navigation stacks: Auth, Main, PDFPreview, Settings with conditional routing and state management using Zustand stores
<!-- DECISION_TREE_END -->

## PROJECT SPECIFICATIONS
<!-- PROJECT_SPECS_START -->
1. CORE FEATURES
- Select up to 200 photos from device gallery
- Drag-and-drop to reorder photos
- Live preview of PDF layout before generation
- Generate margin-free PDFs with vertically stacked images
- Save PDFs directly to device storage
- Track conversion history with thumbnails, PDF name, creation date, and file reference
- User authentication for history tracking

2. USER FLOWS
- Home screen with "New PDF" button and history of created PDFs
- Photo selection screen allowing multi-select up to 200 images
- Reorder screen with draggable thumbnails
- PDF preview screen before generation
- Generate PDF and save to device
- Success confirmation with options to share or view saved PDF

3. BUSINESS RULES
- Maximum 200 photos per PDF
- PDFs must have zero margins and images stacked vertically at full width
- History entries include PDF metadata and are user-scoped in cloud database
- App is free with no monetization

4. UI/UX REQUIREMENTS
- Dark premium design with clean, professional interface
- Dark theme with blue accents for action elements
- Focus on simplicity, efficiency, and speed (photos to PDF in under 60 seconds)
- Proper loading states during PDF generation
- Success confirmation and sharing options
- Mobile-first responsive design optimized for iOS and Android
- Comprehensive error handling and user feedback
<!-- PROJECT_SPECS_END -->

import { create } from 'zustand';

export interface ImageItem {
  uri: string;
  name: string;
  width?: number;
  height?: number;
  fileSize?: number;
}

interface PDFStoreState {
  selectedImages: ImageItem[];
  currentProjectId: string | null;
  isGenerating: boolean;
  generationProgress: number;
  generationStatus: string;

  // Actions
  setSelectedImages: (images: ImageItem[]) => void;
  addImages: (images: ImageItem[]) => void;
  removeImage: (index: number) => void;
  reorderImages: (fromIndex: number, toIndex: number) => void;
  clearImages: () => void;
  setCurrentProjectId: (id: string | null) => void;
  setGenerating: (isGenerating: boolean) => void;
  setGenerationProgress: (progress: number) => void;
  setGenerationStatus: (status: string) => void;
  resetGeneration: () => void;
}

export const usePDFStore = create<PDFStoreState>((set) => ({
  selectedImages: [],
  currentProjectId: null,
  isGenerating: false,
  generationProgress: 0,
  generationStatus: '',

  setSelectedImages: (images) => set({ selectedImages: images }),
  
  addImages: (images) => set((state) => ({ 
    selectedImages: [...state.selectedImages, ...images] 
  })),
  
  removeImage: (index) => set((state) => ({
    selectedImages: state.selectedImages.filter((_, i) => i !== index)
  })),
  
  reorderImages: (fromIndex, toIndex) => set((state) => {
    const newImages = [...state.selectedImages];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    return { selectedImages: newImages };
  }),
  
  clearImages: () => set({ selectedImages: [], currentProjectId: null }),
  
  setCurrentProjectId: (id) => set({ currentProjectId: id }),
  
  setGenerating: (isGenerating) => set({ isGenerating }),
  
  setGenerationProgress: (progress) => set({ generationProgress: progress }),
  
  setGenerationStatus: (status) => set({ generationStatus: status }),
  
  resetGeneration: () => set({ 
    isGenerating: false, 
    generationProgress: 0, 
    generationStatus: '' 
  }),
}));

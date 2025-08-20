import { create } from 'zustand';
import { FlowState, Message, RecognizedObject, Comparison, RateItem } from '../types';

interface FlowStore extends FlowState {
  setCurrentStep: (step: FlowState['currentStep']) => void;
  setSelectedProduct: (product: RecognizedObject) => void;
  setComparison: (comparison: Comparison) => void;
  setSelectedEMI: (emi: RateItem) => void;
  addMessage: (message: Omit<Message, 'id' | 'createdAt'>) => void;
  setBottomSheetOpen: (open: boolean) => void;
  resetFlow: () => void;
}

const initialState: FlowState = {
  currentStep: 'chat',
  messages: [
    {
      id: '1',
      role: 'assistant',
      text: 'Hi, how can I help you today?',
      createdAt: 1704067200000 // Static timestamp to prevent hydration mismatch
    }
  ],
  isBottomSheetOpen: false,
};

export const useFlowStore = create<FlowStore>((set, get) => ({
  ...initialState,
  
  setCurrentStep: (step) => set({ currentStep: step }),
  
  setSelectedProduct: (product) => set({ selectedProduct: product }),
  
  setComparison: (comparison) => set({ comparison }),
  
  setSelectedEMI: (emi) => set({ selectedEMI: emi }),
  
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      createdAt: Date.now()
    }]
  })),
  
  setBottomSheetOpen: (open) => set({ isBottomSheetOpen: open }),
  
  resetFlow: () => set(initialState),
})); 
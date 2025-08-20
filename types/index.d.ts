export type ChatRole = 'user' | 'assistant';
export type Message = { 
  id: string; 
  role: ChatRole; 
  text: string; 
  createdAt: number;
};

export type RecognizedObject = {
  name: string;
  confidence: number; // 0..1
  description: string;
  imageUrl?: string;
};

export type RateItem = { 
  provider: string; 
  apr: number;
};

export type Comparison = { 
  productName: string; 
  items: RateItem[];
};

export type FlowStep = 'chat' | 'scan' | 'compare' | 'ranking' | 'ekyc';

export type FlowState = {
  currentStep: FlowStep;
  selectedProduct?: RecognizedObject;
  comparison?: Comparison;
  selectedEMI?: RateItem;
  messages: Message[];
  isBottomSheetOpen: boolean;
}; 
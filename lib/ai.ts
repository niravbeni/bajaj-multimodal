import { Message } from '../types';

// Simple EMI assistant responses
export async function chatMock(history: Message[], latest: string): Promise<string> {
  const message = latest.toLowerCase();
  
  // Product-related queries - trigger camera
  if (/product/.test(message)) {
    return 'Please upload or identify the product.';
  }
  
  // Default response for all other messages
  return 'I can help you find best financing options for any product. Just scan to get started.';
} 
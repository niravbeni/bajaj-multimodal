export function getIntent(text: string) {
  const t = text.toLowerCase();
  
  // Check for "product" and common misspellings to trigger camera
  if (/(product|prodcut|prodict|produkt|prudct|producct|prduct)/.test(t)) return 'open_scan';
  
  // Keep existing scan triggers
  if (/(scan|photo|picture|image|camera)/.test(t)) return 'open_scan';
  
  return 'none';
} 
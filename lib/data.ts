import { Comparison, RateItem } from '../types';

export const MOCK_RATES: RateItem[] = [
  { provider: 'Competitor A', apr: 16.8 },
  { provider: 'Bajaj Finserv', apr: 14.2 },   // keep this "best" or best value
  { provider: 'Competitor B', apr: 17.5 },
  { provider: 'Competitor C', apr: 18.9 },
];

export const MOCK_COMPARISON: Comparison = {
      productName: 'Samsung Refrigerator EMI',
  items: MOCK_RATES
}; 
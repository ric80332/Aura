import { Strategy } from './types';

export const INITIAL_SYMBOLS = ['BTC', 'ETH', 'SOL'];

export const DEFAULT_STRATEGIES: Strategy[] = [
  {
    id: '1',
    name: 'Conservative Growth',
    isActive: true,
    rules: [
      { id: 'r1', metric: 'PRICE', condition: 'BELOW', value: 64000, action: 'BUY' },
      { id: 'r2', metric: 'PRICE', condition: 'ABOVE', value: 66000, action: 'SELL' },
    ]
  },
  {
    id: '2',
    name: 'RSI Mean Reversion',
    isActive: false,
    rules: [
      { id: 'r3', metric: 'RSI', condition: 'BELOW', value: 30, action: 'BUY' },
      { id: 'r4', metric: 'RSI', condition: 'ABOVE', value: 70, action: 'SELL' },
    ]
  }
];

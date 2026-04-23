export interface MarketData {
  timestamp: number;
  price: number;
  symbol: string;
}

export type StrategyCondition = 'ABOVE' | 'BELOW' | 'CROSS_UP' | 'CROSS_DOWN';
export type StrategyMetric = 'PRICE' | 'RSI' | 'SMA' | 'EMA';

export interface StrategyRule {
  id: string;
  metric: StrategyMetric;
  condition: StrategyCondition;
  value: number;
  action: 'BUY' | 'SELL';
}

export interface Strategy {
  id: string;
  name: string;
  rules: StrategyRule[];
  isActive: boolean;
}

export interface Trade {
  id: string;
  timestamp: number;
  symbol: string;
  type: 'BUY' | 'SELL';
  price: number;
  amount: number;
  total: number;
  status: 'COMPLETED' | 'PENDING' | 'CANCELLED';
}

export interface Portfolio {
  balance: number; // USD
  holdings: {
    [symbol: string]: number; // Amount of crypto
  };
}

export interface MarketState {
  symbol: string;
  currentPrice: number;
  change24h: number;
  history: MarketData[];
}

import { MarketData } from '../types';

export class MarketService {
  private static prices: Record<string, number> = {
    'BTC': 65000,
    'ETH': 3500,
    'SOL': 145,
  };

  private static volatility: Record<string, number> = {
    'BTC': 0.0005,
    'ETH': 0.0008,
    'SOL': 0.0015,
  };

  static getNextPrice(symbol: string): MarketData {
    const currentPrice = this.prices[symbol] || 100;
    const vol = this.volatility[symbol] || 0.001;
    
    // Simulate Brownian motion
    const change = currentPrice * vol * (Math.random() - 0.5);
    const newPrice = currentPrice + change;
    
    this.prices[symbol] = newPrice;
    
    return {
      symbol,
      price: newPrice,
      timestamp: Date.now(),
    };
  }

  static generateHistory(symbol: string, points: number = 100): MarketData[] {
    let price = this.prices[symbol] || 100;
    const vol = this.volatility[symbol] || 0.001;
    const history: MarketData[] = [];
    const now = Date.now();
    const interval = 60000; // 1 minute points

    for (let i = points; i > 0; i--) {
      price = price * (1 + vol * (Math.random() - 0.5));
      history.push({
        symbol,
        price,
        timestamp: now - (i * interval),
      });
    }
    
    return history;
  }
}

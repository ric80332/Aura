import { useState, useEffect, useCallback, useRef } from 'react';
import { MarketState, Portfolio, Trade, Strategy, MarketData } from '../types';
import { MarketService } from '../services/marketService';
import { INITIAL_SYMBOLS, DEFAULT_STRATEGIES } from '../constants';

export function useTradingBot() {
  const [marketStates, setMarketStates] = useState<Record<string, MarketState>>(() => {
    const states: Record<string, MarketState> = {};
    INITIAL_SYMBOLS.forEach(symbol => {
      const history = MarketService.generateHistory(symbol, 50);
      states[symbol] = {
        symbol,
        currentPrice: history[history.length - 1].price,
        change24h: 2.5, // Mock change
        history
      };
    });
    return states;
  });

  const [portfolio, setPortfolio] = useState<Portfolio>({
    balance: 10000,
    holdings: { 'BTC': 0, 'ETH': 0, 'SOL': 0 }
  });

  const [trades, setTrades] = useState<Trade[]>([]);
  const [activeSymbol, setActiveSymbol] = useState(INITIAL_SYMBOLS[0]);
  const [isBotRunning, setIsBotRunning] = useState(false);
  const [activeStrategy, setActiveStrategy] = useState<Strategy>(DEFAULT_STRATEGIES[0]);

  // Ref to track latest state for bot logic
  const stateRef = useRef({ marketStates, portfolio, activeStrategy, isBotRunning });
  stateRef.current = { marketStates, portfolio, activeStrategy, isBotRunning };

  const executeTrade = useCallback((symbol: string, type: 'BUY' | 'SELL', price: number) => {
    setPortfolio(prev => {
      const newHoldings = { ...prev.holdings };
      let newBalance = prev.balance;
      
      const amount = type === 'BUY' ? (prev.balance * 0.1) / price : newHoldings[symbol]; // Buy with 10% balance or sell all
      
      if (amount <= 0 && type === 'SELL') return prev;
      if (prev.balance < (amount * price) && type === 'BUY') return prev;

      if (type === 'BUY') {
        newBalance -= amount * price;
        newHoldings[symbol] = (newHoldings[symbol] || 0) + amount;
      } else {
        newBalance += amount * price;
        newHoldings[symbol] = 0;
      }

      const trade: Trade = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        symbol,
        type,
        price,
        amount,
        total: amount * price,
        status: 'COMPLETED'
      };

      setTrades(prevTrades => [trade, ...prevTrades].slice(0, 50));

      return { balance: newBalance, holdings: newHoldings };
    });
  }, []);

  // Update loop
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketStates(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(symbol => {
          const newData = MarketService.getNextPrice(symbol);
          const history = [...next[symbol].history, newData].slice(-100);
          next[symbol] = {
            ...next[symbol],
            currentPrice: newData.price,
            history
          };

          // Bot Logic
          const { isBotRunning, activeStrategy } = stateRef.current;
          if (isBotRunning && activeStrategy) {
            activeStrategy.rules.forEach(rule => {
              if (rule.metric === 'PRICE') {
                if (rule.condition === 'BELOW' && newData.price < rule.value && rule.action === 'BUY') {
                  // Basic throttle: don't trade same symbol too often
                  executeTrade(symbol, 'BUY', newData.price);
                }
                if (rule.condition === 'ABOVE' && newData.price > rule.value && rule.action === 'SELL') {
                  executeTrade(symbol, 'SELL', newData.price);
                }
              }
            });
          }
        });
        return next;
      });
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [executeTrade]);

  return {
    marketStates,
    portfolio,
    trades,
    activeSymbol,
    setActiveSymbol,
    isBotRunning,
    setIsBotRunning,
    activeStrategy,
    setActiveStrategy,
    executeTrade
  };
}

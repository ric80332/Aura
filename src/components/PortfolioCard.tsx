import { Portfolio, MarketState } from '../types';
import { Wallet, PieChart, ArrowUpRight } from 'lucide-react';

interface PortfolioCardProps {
  portfolio: Portfolio;
  marketStates: Record<string, MarketState>;
}

export function PortfolioCard({ portfolio, marketStates }: PortfolioCardProps) {
  const totalValue = portfolio.balance + Object.entries(portfolio.holdings).reduce((sum, [symbol, amount]) => {
    return sum + (amount * (marketStates[symbol]?.currentPrice || 0));
  }, 0);

  const initialValue = 10000;
  const pnl = totalValue - initialValue;
  const pnlPercent = (pnl / initialValue) * 100;

  return (
    <div className="glass rounded-2xl p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-8">
          <div className="bg-neon-cyan/10 p-2 rounded-xl">
            <Wallet className="text-neon-cyan" size={20} />
          </div>
          <div className={`flex items-center gap-1 font-mono text-[10px] p-1 px-2 rounded-md bg-white/5 border border-white/5 ${pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            <ArrowUpRight size={12} className={pnl < 0 ? 'rotate-90' : ''} />
            {pnl >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-white/30 text-[10px] uppercase font-bold tracking-[0.2em]">Aggregate Equity</h3>
          <div className="text-3xl font-bold text-white font-mono tracking-tighter">
            ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      <div className="pt-8 space-y-4">
        <div className="flex justify-between items-center text-[11px] font-mono border-b border-white/5 pb-2">
          <span className="text-white/30 uppercase">Fiat Reserve</span>
          <span className="text-white font-bold">${portfolio.balance.toLocaleString()}</span>
        </div>
        
        <div className="space-y-3">
          <h4 className="text-[9px] text-white/20 uppercase font-bold tracking-widest px-1">Digital Assets</h4>
          {Object.entries(portfolio.holdings).map(([symbol, amount]) => {
            if (amount === 0) return null;
            const value = amount * (marketStates[symbol]?.currentPrice || 0);
            return (
              <div key={symbol} className="flex justify-between items-center text-[11px] font-mono p-1 px-2 rounded-lg bg-white/5 border border-white/5 group hover:border-neon-cyan/30 transition-all">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan/50 shadow-[0_0_8px_rgba(0,240,255,0.5)]"></span>
                  <span className="text-white/80 font-bold">{symbol}</span>
                </div>
                <div className="text-right">
                  <div className="text-white">{amount.toFixed(4)}</div>
                  <div className="text-[9px] text-white/30 uppercase">${value.toFixed(2)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

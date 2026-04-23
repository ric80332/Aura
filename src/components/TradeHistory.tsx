import { Trade } from '../types';
import { format } from 'date-fns';
import { ArrowUpRight, ArrowDownRight, History } from 'lucide-react';

interface TradeHistoryProps {
  trades: Trade[];
}

export function TradeHistory({ trades }: TradeHistoryProps) {
  return (
    <div className="glass rounded-2xl overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History size={14} className="text-white/20" />
          <h3 className="text-white/40 text-[10px] uppercase font-bold tracking-[0.2em]">Operational Ledger</h3>
        </div>
        <span className="text-[10px] bg-white/5 border border-white/10 text-neon-cyan px-2 py-0.5 rounded font-mono">
          {trades.length} OPS
        </span>
      </div>

      <div className="flex-1 overflow-y-auto font-mono text-[10px]">
        {trades.length === 0 ? (
          <div className="h-full flex items-center justify-center text-white/20 italic p-8 text-center text-[10px] uppercase tracking-tighter">
            Waiting for node initiation...<br/>Terminal idle.
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="text-[9px] uppercase text-white/20 border-b border-white/5 sticky top-0 glass backdrop-blur-md">
              <tr>
                <th className="p-3 font-medium">Time (UTC)</th>
                <th className="p-3 font-medium">Vector</th>
                <th className="p-3 font-medium">Command</th>
                <th className="p-3 font-medium">Valuation</th>
                <th className="p-3 font-medium">Delta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {trades.map((trade) => (
                <tr key={trade.id} className="hover:bg-white/5 transition-colors group">
                  <td className="p-3 text-white/40">{format(trade.timestamp, 'HH:mm:ss')}</td>
                  <td className="p-3 text-white font-bold tracking-tight">{trade.symbol}</td>
                  <td className="p-3">
                    <span className={`inline-flex items-center gap-1 font-bold ${trade.type === 'BUY' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {trade.type === 'BUY' ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                      [{trade.type}]
                    </span>
                  </td>
                  <td className="p-3 text-white/60">${trade.price.toFixed(2)}</td>
                  <td className="p-3 text-white/40">${trade.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

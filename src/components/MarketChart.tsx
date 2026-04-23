import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { MarketData } from '../types';
import { format } from 'date-fns';

interface MarketChartProps {
  data: MarketData[];
  symbol: string;
}

export function MarketChart({ data, symbol }: MarketChartProps) {
  const minPrice = Math.min(...data.map(d => d.price)) * 0.999;
  const maxPrice = Math.max(...data.map(d => d.price)) * 1.001;

  return (
    <div className="h-full w-full glass rounded-2xl p-6 relative overflow-hidden">
      <div className="flex justify-between items-start mb-10 relative z-10">
        <div>
          <h3 className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold mb-1">Live Market Matrix</h3>
          <h2 className="text-white text-3xl font-bold tracking-tight">{symbol}<span className="opacity-30">/USDT</span></h2>
        </div>
        <div className="text-right">
          <div className="text-neon-cyan text-2xl font-bold font-mono tracking-tighter">
            ${data[data.length - 1]?.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center justify-end gap-1.5 mt-1">
            <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse"></div>
            <span className="text-[10px] text-neon-cyan/60 uppercase font-mono tracking-widest">Quantum Stream</span>
          </div>
        </div>
      </div>
      
      <div className="h-[calc(100%-80px)] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00f0ff" stopOpacity={0.2}/>
                <stop offset="100%" stopColor="#00f0ff" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={(ts) => format(ts, 'HH:mm')}
              stroke="rgba(255,255,255,0.2)"
              fontSize={9}
              minTickGap={60}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              domain={[minPrice, maxPrice]} 
              hide 
            />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(18,18,23,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px' }}
              labelFormatter={(ts) => format(ts, 'MMM dd, HH:mm:ss')}
              formatter={(val: number) => [`$${val.toFixed(2)}`, 'Price']}
            />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke="#00f0ff" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorPrice)" 
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { MarketState } from '../types';
import { AIService } from '../services/aiService';
import { Brain, Sparkles, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AIInsightsProps {
  marketState: MarketState;
}

export function AIInsights({ marketState }: AIInsightsProps) {
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchAnalysis = async () => {
      setIsLoading(true);
      const res = await AIService.analyzeMarket(marketState);
      if (isMounted) {
        setAnalysis(res);
        setIsLoading(false);
      }
    };

    fetchAnalysis();
    const interval = setInterval(fetchAnalysis, 30000); // Re-analyze every 30s

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [marketState.symbol]);

  return (
    <div className="glass rounded-2xl p-5 relative overflow-hidden flex-1 border-white/5">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <Brain size={140} />
      </div>
      
      <div className="flex items-center gap-2 mb-4 relative z-10">
        <Sparkles className="text-neon-cyan" size={16} />
        <h3 className="text-white/40 font-bold uppercase tracking-[0.2em] text-[10px]">Aura Core Analyst</h3>
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 text-white/20"
          >
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-neon-cyan"></div>
            <p className="text-[10px] font-mono uppercase tracking-widest">Scanning market nodes...</p>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 relative z-10"
          >
            <p className="text-[#e2e2e2]/80 leading-relaxed italic text-xs font-light">
              "{analysis.split('.').slice(0, -1).join('.') || analysis}"
            </p>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/5">
                <span className="text-[9px] text-white/30 uppercase font-bold tracking-tighter">Vector</span>
                <span className={analysis.toLowerCase().includes('buy') ? 'text-neon-cyan font-bold text-[10px]' : 'text-neon-purple font-bold text-[10px]'}>
                  {analysis.includes('Buy') ? 'AGGRESSIVE ACCUMULATION' : 'NEUTRAL EQUILIBRIUM'}
                </span>
                {analysis.includes('Buy') ? <TrendingUp size={12} className="text-neon-cyan" /> : <AlertCircle size={12} className="text-neon-purple" />}
              </div>
              
              <div className="text-[9px] text-white/20 font-mono tracking-tighter">
                SYNC: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

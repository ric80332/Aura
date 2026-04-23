import { Strategy, MarketState } from '../types';
import { Play, Square, Settings, ChevronRight, Zap } from 'lucide-react';
import { DEFAULT_STRATEGIES } from '../constants';

interface BotControlsProps {
  isRunning: boolean;
  onToggle: () => void;
  activeStrategy: Strategy;
  onStrategySelect: (s: Strategy) => void;
}

export function BotControls({ isRunning, onToggle, activeStrategy, onStrategySelect }: BotControlsProps) {
  return (
    <div className="glass rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-emerald-500 animate-pulse' : 'bg-white/20'}`}></div>
          <h3 className="text-white/40 text-[10px] uppercase font-bold tracking-[0.2em]">Execution Module</h3>
        </div>
      </div>

      <div className="flex gap-2">
        <button 
          onClick={onToggle}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${
            isRunning 
              ? 'bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)] text-white' 
              : 'bg-neon-cyan shadow-[0_0_20px_rgba(0,240,255,0.3)] text-black'
          }`}
        >
          {isRunning ? (
            <><Square size={14} fill="currentColor" /> Terminate Node</>
          ) : (
            <><Play size={14} fill="currentColor" /> Initiate Logic</>
          )}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-1">
        <div className="bg-white/5 border border-white/5 rounded-xl p-3 group hover:border-white/10 transition-all">
          <span className="text-[9px] text-white/30 font-bold uppercase tracking-tighter block mb-1">Logic Pattern</span>
          <div className="flex items-center justify-between">
            <span className="text-xs text-white font-bold">{activeStrategy.name}</span>
            <Settings size={12} className="text-white/20" />
          </div>
        </div>
        <div className="bg-white/5 border border-white/5 rounded-xl p-3">
          <span className="text-[9px] text-white/30 font-bold uppercase tracking-tighter block mb-1">Neural Risk</span>
          <div className="flex items-center gap-1.5">
            <Zap size={10} className="text-yellow-400" />
            <span className="text-xs text-yellow-400 font-bold font-mono">STABLE</span>
          </div>
        </div>
      </div>

      <div className="text-white/20 text-[9px] font-mono leading-tight uppercase tracking-tighter text-center">
        System operating in sandbox environment.<br/>No real collateral and 0.00% risk.
      </div>
    </div>
  );
}

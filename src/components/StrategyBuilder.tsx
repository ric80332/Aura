import { useState } from 'react';
import { Strategy, StrategyMetric, StrategyCondition } from '../types';
import { Plus, Trash2, Save, Cpu } from 'lucide-react';
import { AIService } from '../services/aiService';

interface StrategyBuilderProps {
  onSave: (s: Strategy) => void;
}

export function StrategyBuilder({ onSave }: StrategyBuilderProps) {
  const [goal, setGoal] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [strategy, setStrategy] = useState<Strategy>({
    id: '',
    name: 'New Custom Strategy',
    isActive: true,
    rules: [
      { id: '1', metric: 'PRICE', condition: 'BELOW', value: 60000, action: 'BUY' }
    ]
  });

  const handleAISuggest = async () => {
    if (!goal) return;
    setIsGenerating(true);
    const suggestion = await AIService.suggestStrategy(goal);
    if (suggestion.name) {
      setStrategy({
        id: Math.random().toString(),
        name: suggestion.name,
        isActive: true,
        rules: (suggestion as any).suggestedRules?.map((r: any) => ({ ...r, id: Math.random().toString() })) || []
      });
    }
    setIsGenerating(false);
  };

  const addRule = () => {
    setStrategy(prev => ({
      ...prev,
      rules: [...prev.rules, { id: Math.random().toString(), metric: 'RSI', condition: 'BELOW', value: 30, action: 'BUY' }]
    }));
  };

  const removeRule = (id: string) => {
    setStrategy(prev => ({
      ...prev,
      rules: prev.rules.filter(r => r.id !== id)
    }));
  };

  const updateRule = (id: string, updates: any) => {
    setStrategy(prev => ({
      ...prev,
      rules: prev.rules.map(r => r.id === id ? { ...r, ...updates } : r)
    }));
  };

  return (
    <div className="glass rounded-2xl p-6 flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <Cpu className="text-neon-purple" size={16} />
        <h3 className="text-white/40 text-[10px] uppercase font-bold tracking-[0.2em]">Strategy Forge</h3>
      </div>

      <div className="space-y-6 flex-1">
        <div className="space-y-2">
          <label className="text-[9px] text-white/30 uppercase font-bold tracking-tighter">Neural Directive</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="e.g. Scalp ETH/USDT momentum..."
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="flex-1 bg-black/20 border border-white/5 rounded-xl px-4 py-2.5 text-[10px] text-white focus:outline-none focus:border-neon-cyan/50 transition-colors placeholder:text-white/10"
            />
            <button 
              onClick={handleAISuggest}
              disabled={isGenerating || !goal}
              className="bg-neon-purple/20 hover:bg-neon-purple/40 border border-neon-purple/30 disabled:opacity-30 text-neon-purple px-4 py-2 rounded-xl text-[10px] font-bold transition-all flex items-center gap-2 uppercase tracking-widest"
            >
              {isGenerating ? <div className="animate-spin h-3 w-3 border-b-2 border-neon-purple rounded-full"></div> : <Save size={12} />}
              Synthesize
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-[9px] text-white/30 uppercase font-bold tracking-tighter">Component Logic</label>
            <button onClick={addRule} className="text-neon-cyan hover:text-white flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest transition-colors">
              <Plus size={10} /> Add Node
            </button>
          </div>

          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
            {strategy.rules.map((rule) => (
              <div key={rule.id} className="bg-white/5 border border-white/5 rounded-xl p-3 space-y-3 transition-hover hover:border-white/10">
                <div className="grid grid-cols-2 gap-2">
                  <select 
                    value={rule.metric}
                    onChange={(e) => updateRule(rule.id, { metric: e.target.value as StrategyMetric })}
                    className="bg-black/40 border border-white/5 rounded-lg p-1.5 text-[9px] text-white uppercase tracking-tighter"
                  >
                    <option value="PRICE">PRICE (USD)</option>
                    <option value="RSI">RSI (INDEX)</option>
                    <option value="SMA">SMA (TREND)</option>
                    <option value="EMA">EMA (MOMENTUM)</option>
                  </select>
                  <select 
                    value={rule.condition}
                    onChange={(e) => updateRule(rule.id, { condition: e.target.value as StrategyCondition })}
                    className="bg-black/40 border border-white/5 rounded-lg p-1.5 text-[9px] text-white uppercase tracking-tighter"
                  >
                    <option value="ABOVE">ABOVE {'>'}</option>
                    <option value="BELOW">BELOW {'<'}</option>
                    <option value="CROSS_UP">X-UP ↑</option>
                    <option value="CROSS_DOWN">X-DOWN ↓</option>
                  </select>
                </div>
                <div className="flex gap-2 items-center">
                  <input 
                    type="number" 
                    value={rule.value}
                    onChange={(e) => updateRule(rule.id, { value: parseFloat(e.target.value) })}
                    className="flex-1 bg-black/40 border border-white/5 rounded-lg p-1.5 text-[10px] text-white font-mono"
                  />
                  <select 
                    value={rule.action}
                    onChange={(e) => updateRule(rule.id, { action: e.target.value as 'BUY' | 'SELL' })}
                    className={`rounded-lg px-3 py-1.5 text-[10px] font-bold transition-colors ${rule.action === 'BUY' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'}`}
                  >
                    <option value="BUY">BUY</option>
                    <option value="SELL">SELL</option>
                  </select>
                  <button onClick={() => removeRule(rule.id)} className="text-white/20 hover:text-rose-500 transition-colors">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <button 
        onClick={() => onSave(strategy)}
        className="mt-6 w-full glass hover:bg-neon-cyan hover:text-black border-neon-cyan/30 text-neon-cyan font-bold py-3 rounded-xl text-[10px] uppercase tracking-[0.2em] transition-all active:scale-[0.98] shadow-lg shadow-neon-cyan/5"
      >
        Deploy Circuitry
      </button>
    </div>
  );
}

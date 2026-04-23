/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useTradingBot } from './hooks/useTradingBot';
import { MarketChart } from './components/MarketChart';
import { PortfolioCard } from './components/PortfolioCard';
import { TradeHistory } from './components/TradeHistory';
import { BotControls } from './components/BotControls';
import { AIInsights } from './components/AIInsights';
import { StrategyBuilder } from './components/StrategyBuilder';
import { Activity, BarChart3, ShieldAlert, Cpu, Globe, ArrowRight } from 'lucide-react';
import { INITIAL_SYMBOLS } from './constants';

export default function App() {
  const {
    marketStates,
    portfolio,
    trades,
    activeSymbol,
    setActiveSymbol,
    isBotRunning,
    setIsBotRunning,
    activeStrategy,
    setActiveStrategy
  } = useTradingBot();

  const currentMarket = marketStates[activeSymbol];

  return (
    <div className="min-h-screen bg-dark-bg text-[#e2e2e2] font-sans selection:bg-neon-cyan selection:text-black p-4 flex flex-col gap-4">
      {/* Top Navigation - Styled as the header in the design */}
      <header className="h-16 glass rounded-2xl flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.2)]">
            <Cpu className="text-black" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">AURA<span className="font-light opacity-50">.AI</span></h1>
            <p className="text-[10px] uppercase tracking-widest text-neon-cyan font-semibold">Quantum Trading Bot</p>
          </div>
        </div>

        <nav className="hidden md:flex gap-8 text-sm font-medium opacity-70">
          {INITIAL_SYMBOLS.map(symbol => (
            <button 
              key={symbol}
              onClick={() => setActiveSymbol(symbol)}
              className={`transition-all ${activeSymbol === symbol ? 'text-neon-cyan opacity-100' : 'hover:opacity-100'}`}
            >
              {symbol}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          <div className="hidden sm:block text-right">
            <p className="text-[10px] uppercase opacity-40">System Status</p>
            <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-semibold uppercase tracking-tighter">AI ACTIVE</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl glass flex items-center justify-center">
            <Activity size={18} className="text-neon-cyan" />
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col gap-4 min-h-0 max-w-[1600px] mx-auto w-full">
        {/* Real-time Status Banner - Using glass/neon style */}
        <div className="flex items-center justify-between glass border-neon-cyan/20 rounded-xl py-2 px-4 shadow-lg shadow-neon-cyan/5">
          <div className="flex items-center gap-2 text-xs text-neon-cyan">
            <ShieldAlert size={14} />
            <span className="font-medium">VOLATILITY ALERT:</span>
            <span className="font-mono text-[10px] opacity-70 tracking-widest uppercase">High Liquidity Signal</span>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-mono opacity-40 text-white uppercase tracking-widest">
            <span>Lat: 14ms</span>
            <span>Uptime: 99.9%</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pb-4 flex-1">
          {/* Left Column - Main View (8/12) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {/* Chart Area */}
            <div className="flex-1 min-h-0">
              <MarketChart data={currentMarket.history} symbol={activeSymbol} />
            </div>

            {/* Bottom Row - Trade History & AI */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-64 md:h-72">
              <TradeHistory trades={trades} />
              <div className="flex flex-col gap-4 overflow-hidden">
                <AIInsights marketState={currentMarket} />
                <div className="glass rounded-xl p-4 flex flex-col justify-center flex-1 border-white/5">
                  <div className="flex items-center gap-2 mb-1 opacity-40">
                    <BarChart3 size={14} />
                    <h4 className="text-[10px] uppercase font-bold tracking-widest">Neural Pulse</h4>
                  </div>
                  <p className="text-[11px] opacity-60 leading-relaxed font-sans">
                    Analyzing order book clusters and social sentiment vectors across 24 global nodes.
                  </p>
                  <button className="mt-3 flex items-center gap-1 text-neon-cyan text-[10px] font-bold hover:gap-2 transition-all uppercase tracking-widest">
                    Open Intelligence <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar (4/12) */}
          <aside className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto">
            <PortfolioCard portfolio={portfolio} marketStates={marketStates} />
            
            <BotControls 
              isRunning={isBotRunning}
              onToggle={() => setIsBotRunning(!isBotRunning)}
              activeStrategy={activeStrategy}
              onStrategySelect={setActiveStrategy}
            />

            <StrategyBuilder 
              onSave={(s) => {
                setActiveStrategy(s);
                setIsBotRunning(true);
              }} 
            />
          </aside>
        </div>
      </main>
    </div>
  );
}


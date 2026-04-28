import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

// Import sub-components
import DecisionHeader from '../components/DecisionHeader';
import FinancialRealityCheck from '../components/FinancialRealityCheck';
import ActionSuggestions from '../components/ActionSuggestions';
import FullCostBreakdown from '../components/FullCostBreakdown';
import LongTermImpact from '../components/LongTermImpact';
import FinalVerdict from '../components/FinalVerdict';
import InsightsView from '../components/InsightsView';
import LifestyleBuffer from '../components/LifestyleBuffer';

const ANALYZE_IMG = 'https://media.base44.com/images/public/69d145fab4e9dff45f4e4d66/a0f7c02aa_generated_image.png';

export default function Dashboard({ data: propData, onReset }) {
  const [activeTab, setActiveTab] = useState('overview');
  
  const [data, setData] = useState(() => {
    if (propData) return propData;
    const saved = sessionStorage.getItem("arthya_results");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (propData) setData(propData);
  }, [propData]);

  if (!data || !data.recommended) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium font-sans">Aligning AI Analysis Results...</p>
      </div>
    );
  }

  // --- THE LOGIC HUB ---
  const winner = data.recommended || data;
  const allResults = data.results || [];
  
  let salaryValue = Number(data.salary || data.input?.expectedSalary || 0);

  if (salaryValue === 0 && winner?.aiExplanation) {
    const regex = /salary of ₹?([\d,]+)/i;
    const match = winner.aiExplanation.match(regex);
    if (match) {
      salaryValue = Number(match[1].replace(/,/g, ''));
    }
  }

  const emiValue = Number(winner?.loan?.emi || 0);
  const principalValue = Number(winner?.loan?.netDisbursed || winner?.loanStartPrincipal || 0);
  
  const emiRatio = salaryValue > 0 ? emiValue / salaryValue : 0;
  let currentStatus = 'safe'; 
  if (emiRatio >= 1) {
    currentStatus = 'danger'; 
  } else if (emiRatio > 0.4) {
    currentStatus = 'neutral'; 
  }

  console.log("DEBUG DASHBOARD:", { 
    rawSalary: data.salary, 
    finalSalary: salaryValue,
    emi: emiValue,
    status: currentStatus
  });

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 bg-[#FDFDFF] font-sans">
      
      {/* Page Header with Image Integration */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-5">
          {/* 🚀 THE IMAGE: Styled with Brand Glow */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative shrink-0"
          >
            <div className="absolute inset-0 bg-[#6D28D9]/10 blur-2xl rounded-full" />
            <img 
              src={ANALYZE_IMG} 
              alt="Analysis Visual" 
              className="w-16 h-16 md:w-20 md:h-20 object-contain relative z-10 drop-shadow-2xl"
            />
          </motion.div>

          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Your Loan Analysis
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[11px] font-black text-[#6D28D9] uppercase tracking-widest bg-violet-50 px-2 py-1 rounded-md border border-violet-100">
                Based on ₹{(principalValue / 100000).toFixed(1)}L loan
              </span>
              <span className="text-slate-300">•</span>
              <span className={`text-[11px] font-black uppercase tracking-widest ${salaryValue > 0 ? "text-slate-500" : "text-rose-500 font-bold animate-pulse"}`}>
                {salaryValue > 0 ? `₹${(salaryValue / 1000).toFixed(0)}K salary` : "Salary Missing!"}
              </span>
            </div>
          </div>
        </div>

        <button 
          onClick={onReset} 
          className="bg-[#6D28D9] text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2 shadow-xl shadow-purple-100 hover:bg-[#5B21B6] hover:-translate-y-1 transition-all active:scale-95"
        >
          <Plus size={18} strokeWidth={3} /> New Analysis
        </button>
      </div>

      {/* Tabs System */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-100">
        {['Overview', 'Insights', 'Compare', 'Invest', 'Simulate', 'Disbursement'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === tab.toLowerCase() ? 'bg-[#6D28D9] text-white' : 'text-slate-400 hover:bg-slate-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Dynamic Content */}
     {/* Dynamic Content */}
<AnimatePresence mode="wait">
  {/* OVERVIEW TAB */}
  {activeTab === 'overview' && (
    <motion.div 
      key="overview"
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <DecisionHeader recommended={winner} allResults={allResults} salary={salaryValue} />
      <FinancialRealityCheck recommended={winner} salary={salaryValue} status={currentStatus} />
      <ActionSuggestions recommended={winner} status={currentStatus} salary={salaryValue} />
      <FullCostBreakdown recommended={winner} />
      <LongTermImpact recommended={winner} salary={salaryValue} />
      <FinalVerdict recommended={winner} salary={salaryValue} />
      <LifestyleBuffer salary={salaryValue} emi={emiValue} />
    </motion.div>
  )}

  {/* 🚀 INSIGHTS TAB (Add this block!) */}
  {activeTab === 'insights' && (
    <motion.div 
      key="insights"
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }}
    >
      <InsightsView recommended={winner} />
    </motion.div>
  )}
</AnimatePresence>
    </div>
  );
}
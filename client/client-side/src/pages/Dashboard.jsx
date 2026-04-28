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
  
  // 1. Search for salary in the object
  let salaryValue = Number(data.salary || data.input?.expectedSalary || 0);

  // 2. 🚀 EMERGENCY EXTRACTION (Backup)
  if (salaryValue === 0 && winner?.aiExplanation) {
    const regex = /salary of ₹?([\d,]+)/i;
    const match = winner.aiExplanation.match(regex);
    if (match) {
      salaryValue = Number(match[1].replace(/,/g, ''));
    }
  }

  const emiValue = Number(winner?.loan?.emi || 0);
  const principalValue = Number(winner?.loan?.netDisbursed || winner?.loanStartPrincipal || 0);
  
  // 3. 🚀 STATUS DETERMINATION
  const emiRatio = salaryValue > 0 ? emiValue / salaryValue : 0;
  let currentStatus = 'safe'; 
  if (emiRatio >= 1) {
    currentStatus = 'danger'; // EMI consumes 100%+ of salary
  } else if (emiRatio > 0.4) {
    currentStatus = 'neutral'; // EMI consumes 40%+ of salary
  }

  console.log("DEBUG DASHBOARD:", { 
    rawSalary: data.salary, 
    finalSalary: salaryValue,
    emi: emiValue,
    status: currentStatus
  });

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 bg-[#FDFDFF] font-sans">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Your Loan Analysis</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-slate-500 font-medium">
              Based on ₹{(principalValue / 100000).toFixed(1)}L loan
            </span>
            <span className="text-slate-300">•</span>
            <span className={salaryValue > 0 ? "text-slate-500 font-medium" : "text-rose-500 font-bold animate-pulse"}>
              {salaryValue > 0 ? `₹${(salaryValue / 1000).toFixed(0)}K salary` : "Salary Missing!"}
            </span>
          </div>
        </div>
        <button 
          onClick={onReset} 
          className="bg-[#6D28D9] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-purple-100 hover:scale-105 transition-all"
        >
          <Plus size={18} /> New Analysis
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
      <AnimatePresence mode="wait">
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
            
          
<ActionSuggestions 
  recommended={winner} 
  status={currentStatus} 
  salary={salaryValue} 
/>
            
            <FullCostBreakdown recommended={winner} />
            
            <LongTermImpact recommended={winner} salary={salaryValue} />
            
            <FinalVerdict recommended={winner} salary={salaryValue} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
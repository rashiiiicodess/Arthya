import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Brain, BarChart3, PiggyBank, FlaskConical, Layers, Plus } from 'lucide-react';

// Import the detailed sub-components
import DecisionHeader from '../components/DecisionHeader';
import FinancialRealityCheck from '../components/FinancialRealityCheck';
import ActionSuggestions from '../components/ActionSuggestions';
import FullCostBreakdown from '../components/FullCostBreakdown';
import LongTermImpact from '../components/LongTermImpact';
import FinalVerdict from '../components/FinalVerdict';

export default function Dashboard({ data, onReset }) {
  const [activeTab, setActiveTab] = useState('overview');

  // Guard clause for data
  if (!data || !data.recommended) return <LoadingState />;

  const { recommended, results, salary } = data;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 bg-[#FDFDFF]">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Your Loan Analysis</h1>
          <p className="text-slate-500 font-medium">
            Based on ₹{(recommended.loan.principal / 100000).toFixed(1)}L loan • ₹{(salary / 1000).toFixed(0)}K salary
          </p>
        </div>
        <button onClick={onReset} className="bg-[#6D28D9] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-purple-100 hover:scale-105 transition-transform">
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

      {activeTab === 'overview' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          
          {/* Section 1: Top Warning & Summary */}
          <DecisionHeader recommended={recommended} allResults={results} />

          {/* Section 2: Financial Reality Check (The Horizontal Bar) */}
          <FinancialRealityCheck recommended={recommended} salary={salary} />

          {/* Section 3: Next Steps / Action Suggestions */}
          <ActionSuggestions recommended={recommended} />

          {/* Section 4: Full Cost Breakdown (Step-by-step numbers) */}
          <FullCostBreakdown recommended={recommended} />

          {/* Section 5: Long Term Impact Grid */}
          <LongTermImpact recommended={recommended} salary={salary} />

          {/* Section 6: Final Decision Summary (Bottom Highlight) */}
          <FinalVerdict recommended={recommended} />

        </motion.div>
      )}
    </div>
  );
}
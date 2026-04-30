import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

import DecisionHeader from '../components/DecisionHeader';
import FinancialRealityCheck from '../components/FinancialRealityCheck';
import ActionSuggestions from '../components/ActionSuggestions';
import FullCostBreakdown from '../components/FullCostBreakdown';
import LongTermImpact from '../components/LongTermImpact';
import FinalVerdict from '../components/FinalVerdict';
import InsightsView from '../components/InsightsView';

export default function Dashboard({ data, onReset }) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!data || !data.recommended) {
    return <LoadingState />;
  }

  const { recommended, results, salary = 99999 } = data;

  // === Realistic Lifestyle Buffer Calculation ===
  const monthlyIncome = salary;
  const emi = Math.round(recommended.overview?.emi || 12891);
  
  // Realistic monthly expenses for Bangalore / Tier-1 city (single person)
  const estimatedRent = 18000;           // 1RK / shared 2BHK in decent area
  const foodTransportUtilities = 22000;  // Food, commute, internet, electricity, etc.
  const miscLifestyle = 8000;            // Miscellaneous + small buffer
  
  const totalEstimatedExpenses = estimatedRent + foodTransportUtilities + miscLifestyle;
  
  const postEmiIncome = monthlyIncome - emi;
  const realisticMonthlySurplus = Math.max(postEmiIncome - totalEstimatedExpenses, 0);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-10 bg-[#FDFDFF]">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Your Education Loan Analysis</h1>
          <p className="text-slate-500 mt-1">
            ₹{(recommended.loan?.netDisbursed || 1000000) / 100000}L loan • ₹{(salary / 1000).toFixed(0)}K monthly income
          </p>
        </div>
        <button 
          onClick={onReset} 
          className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-colors"
        >
          <Plus size={18} /> New Analysis
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-3 border-b border-slate-100">
        {['Overview', 'Insights', 'Compare', 'Invest', 'Simulate', 'Disbursement'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={`px-7 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === tab.toLowerCase() 
                ? 'bg-violet-600 text-white shadow-sm' 
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="space-y-10"
        >
          <DecisionHeader recommended={recommended} allResults={results} />
          
          <FinancialRealityCheck 
            recommended={recommended} 
            salary={salary}
            realisticMonthlySurplus={realisticMonthlySurplus}
            totalEstimatedExpenses={totalEstimatedExpenses}
            estimatedRent={estimatedRent}
          />

          <ActionSuggestions recommended={recommended} />

          <FullCostBreakdown recommended={recommended} />

          <LongTermImpact recommended={recommended} salary={salary} />

          <FinalVerdict recommended={recommended} />
        </motion.div>
      )}

      {activeTab === 'insights' && (
        <InsightsView recommended={recommended} />
      )}

      {/* Other tabs */}
      {activeTab !== 'overview' && activeTab !== 'insights' && (
        <div className="p-20 text-center text-slate-400 bg-white rounded-3xl border">
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} section coming soon...
        </div>
      )}
      
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-500">Loading your analysis...</p>
      </div>
    </div>
  );
}
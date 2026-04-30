import React from 'react';
import { motion } from 'framer-motion';
import { Home, UtensilsCrossed, Bus, ShieldCheck, ArrowRight } from 'lucide-react';

const LifestyleBuffer = ({ salary = 99999, emi = 12891 }) => {
  const monthlyIncome = Number(salary);
  const monthlyEMI = Number(emi);

  const postEMI = monthlyIncome - monthlyEMI;

  // Realistic Bangalore / Tier-1 City Expenses (Single Person)
  const rent = 18000;                    // Decent 1RK or shared 2BHK
  const foodAndGroceries = 9000;
  const transportAndCommute = 4500;
  const utilitiesAndInternet = 3500;
  const miscLifestyle = 6000;            // Entertainment, phone, clothes, etc.

  const totalEstimatedExpenses = rent + foodAndGroceries + transportAndCommute + utilitiesAndInternet + miscLifestyle;

  const realisticMonthlySurplus = Math.max(postEMI - totalEstimatedExpenses, 0);

  // Percentages for progress bar
  const survivalPercentage = Math.min((totalEstimatedExpenses / monthlyIncome) * 100, 100);
  const surplusPercentage = Math.max((realisticMonthlySurplus / monthlyIncome) * 100, 0);

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-10 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">Lifestyle Reality Check</p>
          <h3 className="text-2xl font-bold text-slate-900">Monthly Cashflow After EMI</h3>
        </div>

        <div className="text-right">
          <p className="text-sm text-slate-500">Realistic Monthly Surplus</p>
          <p className="text-3xl font-bold text-emerald-600">
            ₹{realisticMonthlySurplus.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-10">
        <div className="flex justify-between text-xs text-slate-500 mb-2 px-1">
          <span>Expenses &amp; Survival</span>
          <span>Surplus / Buffer</span>
        </div>
        <div className="h-5 bg-slate-100 rounded-full overflow-hidden flex">
          {/* Expense Zone */}
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${survivalPercentage}%` }}
            transition={{ duration: 1.2 }}
            className="h-full bg-amber-500 flex items-center justify-center text-[10px] font-bold text-white"
          >
            ₹{totalEstimatedExpenses.toLocaleString()}
          </motion.div>

          {/* Surplus Zone */}
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${surplusPercentage}%` }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="h-full bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-white"
          >
            ₹{realisticMonthlySurplus.toLocaleString()}
          </motion.div>
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 mt-1 px-1">
          <span>₹{totalEstimatedExpenses.toLocaleString()} (est. expenses)</span>
          <span>₹{realisticMonthlySurplus.toLocaleString()} surplus</span>
        </div>
      </div>

      {/* Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <Home className="text-slate-500" size={20} />
            <p className="font-medium text-slate-700">Rent (1RK / Shared)</p>
          </div>
          <p className="text-2xl font-semibold text-slate-900">₹{rent.toLocaleString()}</p>
        </div>

        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <UtensilsCrossed className="text-slate-500" size={20} />
            <p className="font-medium text-slate-700">Food + Groceries</p>
          </div>
          <p className="text-2xl font-semibold text-slate-900">₹{foodAndGroceries.toLocaleString()}</p>
        </div>

        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <Bus className="text-slate-500" size={20} />
            <p className="font-medium text-slate-700">Transport + Utilities</p>
          </div>
          <p className="text-2xl font-semibold text-slate-900">₹{(transportAndCommute + utilitiesAndInternet).toLocaleString()}</p>
        </div>

        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="text-emerald-600" size={20} />
            <p className="font-medium text-slate-700">Recommended Safety Net</p>
          </div>
          <p className="text-2xl font-semibold text-emerald-600">₹8,000 – ₹12,000 / mo</p>
          <p className="text-xs text-slate-500 mt-1">To build 3–6 months emergency fund</p>
        </div>
      </div>

      {/* Final Insight */}
      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
        <p className="text-emerald-800 text-[15px] leading-relaxed">
          After covering realistic living expenses in a Tier-1 city, you’ll likely have around 
          <span className="font-semibold"> ₹{realisticMonthlySurplus.toLocaleString()} </span> 
          per month as true disposable income. 
          This is a comfortable but disciplined buffer — ideal for building savings and investments.
        </p>
      </div>
    </div>
  );
};

export default LifestyleBuffer;
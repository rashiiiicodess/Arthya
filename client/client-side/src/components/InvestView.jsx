import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, ShieldCheck, PieChart, Target, 
  ArrowUpRight, AlertTriangle, CheckCircle2 
} from 'lucide-react';

export default function InvestView({ data }) {
  const winner = data?.recommended;
  const overview = winner?.overview;
  
  const salary = data?.salary || 100000;
  const emi = overview?.emi || 0;

  const livingExpenses = Math.round(salary * 0.60);
  const realSurplus = Math.max(0, salary - emi - livingExpenses);
  
  const emiRatio = salary > 0 ? Math.round((emi / salary) * 100) : 0;
  const isRisky = emiRatio >= 25;
  const isTight = emiRatio >= 20;

  const emergencyMin = Math.round(livingExpenses * 3);
  const emergencyIdeal = Math.round(livingExpenses * 6);

  const suggestedPrepay = Math.round(realSurplus * 0.40);
  const suggestedSIP = Math.round(realSurplus * 0.35);

  const score = Math.max(35, Math.min(98, 
    Math.round(100 - (emiRatio * 2.1) - (realSurplus < 18000 ? 28 : 0))
  ));

  const getScoreColor = () => {
    if (isRisky) return 'text-rose-600';
    if (isTight) return 'text-amber-600';
    return 'text-emerald-600';
  };

  return (
    <div className="space-y-12 pb-24 font-sans max-w-7xl mx-auto px-4">
      
      {/* Hero Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-violet-600 via-indigo-600 to-slate-900 text-white rounded-3xl p-10 md:p-14 shadow-xl"
      >
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl">
                <TrendingUp size={36} />
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter">Arthya Wealth Engine</h1>
            </div>
            <p className="text-violet-200 text-lg md:text-xl font-light">
              Smart financial guidance for fresh graduates
            </p>
          </div>

          {/* Affordability Score - Premium Card */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center min-w-[200px]">
            <p className="text-xs uppercase tracking-[3px] text-violet-200 font-medium mb-1">Affordability Score</p>
            <div className={`text-7xl font-black tabular-nums ${getScoreColor()}`}>
              {score}
            </div>
            <p className="text-sm text-white/70 -mt-2">/ 100</p>
            
            <div className={`mt-4 inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold
              ${isRisky ? 'bg-rose-500/20 text-rose-300' : 
                isTight ? 'bg-amber-500/20 text-amber-300' : 
                'bg-emerald-500/20 text-emerald-300'}`}>
              {isRisky ? 'High Risk' : isTight ? 'Moderate' : 'Healthy'}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Cash Flow Breakdown */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-100 shadow-sm p-10">
          <div className="flex items-center gap-3 mb-10">
            <PieChart className="text-violet-600" size={28} />
            <h3 className="text-2xl font-semibold text-slate-900">Monthly Cashflow Reality</h3>
          </div>

          <div className="space-y-8">
            {[
              { label: "Gross Monthly Income", value: salary, color: "text-slate-900" },
              { label: "Home Loan EMI", value: -emi, color: "text-rose-600", isNegative: true },
              { label: "Living Expenses (60%)", value: -livingExpenses, color: "text-slate-700", isNegative: true },
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex justify-between items-center py-4 border-b border-slate-100 last:border-none"
              >
                <span className="text-lg text-slate-600">{item.label}</span>
                <span className={`text-2xl font-semibold tabular-nums ${item.color}`}>
                  {item.isNegative ? '-' : ''}₹{Math.abs(item.value).toLocaleString('en-IN')}
                </span>
              </motion.div>
            ))}

            <div className="pt-6 flex justify-between items-end">
              <span className="text-xl font-semibold text-slate-900">Real Investable Surplus</span>
              <div className="text-right">
                <span className={`text-4xl font-black tabular-nums ${realSurplus < 20000 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  ₹{realSurplus.toLocaleString('en-IN')}
                </span>
                <p className="text-sm text-slate-500">per month</p>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Fund */}
        <div className="lg:col-span-4 bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 rounded-3xl p-10 flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <ShieldCheck className="text-emerald-600" size={32} />
            <h3 className="text-2xl font-semibold">Emergency Fund</h3>
          </div>
          
          <div className="flex-1 space-y-8">
            <div>
              <p className="text-slate-500 text-sm">Minimum Target (3 months)</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">₹{emergencyMin.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <p className="text-slate-500 text-sm">Ideal Target (6 months)</p>
              <p className="text-3xl font-bold text-emerald-600 mt-1">₹{emergencyIdeal.toLocaleString('en-IN')}</p>
            </div>
          </div>

          <div className="mt-auto pt-8 border-t border-emerald-100">
            <div className="flex items-center gap-2 text-emerald-700 text-sm">
              <CheckCircle2 size={18} />
              <span>Build this first before SIP or prepayment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Allocation + Decision Framework */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recommended Allocation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-100 rounded-3xl p-10 shadow-sm"
        >
          <h3 className="text-2xl font-semibold mb-8 flex items-center gap-3">
            <Target className="text-violet-600" size={28} />
            Recommended Allocation
          </h3>

          <div className="space-y-6">
            {[
              { step: "01", title: "Emergency Fund First", desc: `Target ₹${emergencyMin.toLocaleString('en-IN')} – ₹${emergencyIdeal.toLocaleString('en-IN')}` },
              { step: "02", title: "Loan Prepayment", desc: `₹${suggestedPrepay.toLocaleString('en-IN')}/month (Priority at 9.5% interest)` },
              { step: "03", title: "Systematic Investment Plan", desc: `₹${suggestedSIP.toLocaleString('en-IN')}/month (After emergency buffer)` },
            ].map((item, index) => (
              <div key={index} className="flex gap-5 group">
                <div className="w-10 h-10 rounded-2xl bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-lg shrink-0 group-hover:bg-violet-600 group-hover:text-white transition-all">
                  {item.step}
                </div>
                <div>
                  <p className="font-semibold text-lg text-slate-900">{item.title}</p>
                  <p className="text-slate-600 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Decision Framework */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-slate-100 rounded-3xl p-10 shadow-sm"
        >
          <h3 className="text-2xl font-semibold mb-8">Decision Framework</h3>
          
          <div className="space-y-8 text-[15px]">
            <div className="p-6 bg-slate-50 rounded-2xl">
              <p className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <ArrowUpRight className="text-violet-600" /> Financial Rule
              </p>
              <p className="text-slate-600">
                At <span className="font-medium text-slate-900">9.5% loan rate</span>, it is currently <span className="font-semibold text-violet-600">better to prepay</span> 
                rather than invest aggressively in equity.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl">
              <p className="font-semibold text-slate-900 mb-2">Behavioral Rule</p>
              <p className="text-slate-600">
                Always treat <strong>EMI as non-negotiable</strong>, <strong>SIP as flexible</strong>, 
                and <strong>Prepayment as opportunistic</strong> when you have surplus.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
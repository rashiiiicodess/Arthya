import React from 'react';
import { motion } from 'framer-motion';
import { Brain, ShieldCheck, Zap, Target } from 'lucide-react';

const FinalVerdict = ({ recommended, salary }) => {
  const emi = Number(recommended?.loan?.emi || 0);
  const safeSalary = Number(salary || 99999);
  const ratio = safeSalary > 0 ? Math.round((emi / safeSalary) * 100) : 0;

  const bankName = recommended?.bankName || "the recommended bank";
  const aiText = recommended?.aiExplanation || "";

  // Split AI explanation into clean blocks
  const blocks = aiText.split('###')
    .filter(s => s.trim().length > 0)
    .map(block => {
      const lines = block.trim().split('\n');
      return {
        title: lines[0].replace(/[*#]/g, '').trim(),
        content: lines.slice(1).join(' ').replace(/[*#]/g, '').trim()
      };
    });

  return (
    <div className="py-12 space-y-12">
      
      {/* Header */}
      <div className="flex items-center gap-4 px-2">
        <div className="p-3 bg-emerald-100 border border-emerald-200 rounded-2xl">
          <Brain className="text-emerald-600" size={24} />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">FINAL VERDICT</p>
          <h2 className="text-2xl font-bold text-slate-900">Executive Summary</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Analysis Blocks */}
        <div className="lg:col-span-8 space-y-6">
          {blocks.map((block, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white border border-slate-100 rounded-3xl p-8"
            >
              <h4 className="text-emerald-600 font-bold uppercase tracking-widest text-sm mb-3">
                {block.title}
              </h4>
              <p className="text-slate-600 leading-relaxed">
                {block.content}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Right Sidebar - Clean & Actionable */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white border border-slate-100 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-xs font-bold text-slate-400">EMI TO INCOME RATIO</p>
                <p className="text-4xl font-bold text-slate-900 mt-1">{ratio}%</p>
              </div>
              <div className={`px-5 py-2 rounded-full text-sm font-semibold ${
                ratio <= 15 ? 'bg-emerald-100 text-emerald-700' : 
                ratio <= 25 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
              }`}>
                {ratio <= 15 ? 'Very Comfortable' : ratio <= 25 ? 'Manageable' : 'Tight'}
              </div>
            </div>

            <div className="space-y-8 text-sm">
              {/* Competitor Advice - Dynamic & Balanced */}
              <div>
                <p className="font-medium text-slate-700 mb-2">Bank Recommendation</p>
                <p className="text-slate-600 text-[13px] leading-relaxed">
                  <span className="font-semibold text-slate-800">{bankName}</span> is currently your strongest option. 
                  Consider other lenders like HDFC Credila or Axis Bank only if you face significant processing delays 
                  or need faster approval.
                </p>
              </div>

              {/* Money Allocation - Practical */}
              <div>
                <p className="font-medium text-slate-700 mb-3">Suggested Monthly Allocation (with ~₹{Math.round((safeSalary - emi - 58000) / 1000)}K surplus)</p>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Emergency Fund Build-up</span>
                    <span className="font-medium">₹8,000 – 10,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Loan Prepayment</span>
                    <span className="font-medium">₹10,000 – 15,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">SIP / Investments</span>
                    <span className="font-medium">₹8,000 – 12,000</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t text-emerald-600 font-medium">
                    <span>Buffer / Lifestyle</span>
                    <span>Remaining</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Status */}
          <div className="p-6 bg-white border border-slate-100 rounded-3xl flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-full text-emerald-600">
              <Target size={20} />
            </div>
            <p className="text-sm text-slate-600">
              This loan is <span className="font-semibold">well-structured</span> for your income level, 
              provided you maintain disciplined spending and consistent prepayments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalVerdict;
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TriangleAlert, Info, Lightbulb, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

export default function InsightsView({ recommended }) {
  const [activeIdx, setActiveIdx] = useState(null);

  // 🚀 Logic: Flatten all backend insights into one prioritized list
  const raw = recommended?.insights || {};
  const allInsights = [
    ...(raw.critical || []).map(i => ({ ...i, type: 'critical', icon: TriangleAlert, label: 'Critical Warnings' })),
    ...(raw.warnings || []).map(i => ({ ...i, type: 'warning', icon: Info, label: 'Things to Consider' })),
    ...(raw.suggestions || []).map(i => ({ ...i, type: 'suggestion', icon: Lightbulb, label: 'Smart Suggestions' })),
    ...(raw.benefits || []).map(i => ({ ...i, type: 'benefit', icon: CheckCircle2, label: 'Smart Suggestions' }))
  ];

  // Grouping by label for the section headers (e.g., "Critical Warnings")
  const grouped = allInsights.reduce((acc, curr) => {
    if (!acc[curr.label]) acc[curr.label] = [];
    acc[curr.label].push(curr);
    return acc;
  }, {});

  return (
    <div className="space-y-12 pb-20">
      {/* 🚀 DEEP LOAN INSIGHTS HEADER CARD */}
      <div className="bg-[#F5F3FF] border border-[#DDD6FE] rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6">
        <div className="p-4 bg-white rounded-2xl shadow-sm">
           <img src="https://media.base44.com/images/public/69d145fab4e9dff45f4e4d66/a0f7c02aa_generated_image.png" className="w-16 h-16 object-contain" alt="AI" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Deep Loan Insights</h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Each insight below explains <span className="font-bold">why something matters</span>, <span className="font-bold">what consequences</span> it has for your future, and <span className="font-bold">what you should do</span> about it. Tap any card to expand.
          </p>
        </div>
      </div>

      {/* 🚀 MAPPING THE GROUPED SECTIONS */}
      {Object.entries(grouped).map(([label, items]) => (
        <div key={label} className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <span className={label.includes('Critical') ? 'text-rose-500' : label.includes('Things') ? 'text-amber-500' : 'text-emerald-500'}>
                {items[0].type === 'critical' ? '▲' : items[0].type === 'warning' ? '▲' : '💡'}
              </span>
              {label}
            </h3>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">{items.length} item{items.length > 1 ? 's' : ''}</span>
          </div>

          {items.map((insight, idx) => {
            const globalIdx = `${label}-${idx}`;
            return (
              <DetailedInsightCard 
                key={globalIdx}
                insight={insight}
                isOpen={activeIdx === globalIdx}
                toggle={() => setActiveIdx(activeIdx === globalIdx ? null : globalIdx)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

function DetailedInsightCard({ insight, isOpen, toggle }) {
  const themes = {
    critical: { bg: 'bg-[#FFF1F2]', border: 'border-rose-100', text: 'text-rose-900', actionBg: 'bg-rose-100/50', actionText: 'text-rose-700', icon: <TriangleAlert className="text-rose-500" size={18} /> },
    warning: { bg: 'bg-[#FFFBEB]', border: 'border-amber-100', text: 'text-amber-900', actionBg: 'bg-amber-100/50', actionText: 'text-amber-700', icon: <Info className="text-amber-500" size={18} /> },
    benefit: { bg: 'bg-[#F0FDF4]', border: 'border-emerald-100', text: 'text-emerald-900', actionBg: 'bg-emerald-100/50', actionText: 'text-emerald-700', icon: <CheckCircle2 className="text-emerald-500" size={18} /> }
  };

  const theme = themes[insight.type] || themes.warning;

  return (
    <div className={`${theme.bg} border ${theme.border} rounded-2xl overflow-hidden transition-all duration-300`}>
      <button onClick={toggle} className="w-full p-6 text-left flex justify-between items-center">
        <div className="flex items-center gap-4">
          {theme.icon}
          <div>
            <h4 className="text-sm font-bold text-slate-900">{insight.title || insight.description}</h4>
            <p className="text-[10px] font-medium text-slate-500 mt-0.5">Tap to understand why this matters →</p>
          </div>
        </div>
        {isOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: "auto", opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            className="px-6 pb-6"
          >
            <div className="space-y-6 pt-4 border-t border-black/5">
              {/* WHY IS THIS HAPPENING */}
              <div className="space-y-1.5">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Why is this happening?</p>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {insight.reason || "This is based on the specific terms and conditions provided by the lender for this loan amount."}
                </p>
              </div>

              {/* WHAT DOES THIS MEAN FOR YOU */}
              <div className="space-y-1.5">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">What does this mean for you?</p>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {insight.impact || "This may affect your monthly cash flow and long-term financial stability if not managed correctly."}
                </p>
              </div>

              {/* WHAT SHOULD YOU DO */}
              {insight.action && (
                <div className={`${theme.actionBg} p-4 rounded-xl border border-white/50`}>
                   <div className="flex items-center gap-2 mb-1.5">
                      <span className={`${theme.actionText}`}>→</span>
                      <p className={`text-[9px] font-black uppercase tracking-widest ${theme.actionText}`}>What should you do?</p>
                   </div>
                   <p className={`text-xs font-bold leading-relaxed ${theme.actionText}`}>
                      {insight.action}
                   </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
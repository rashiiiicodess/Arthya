import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TriangleAlert, Info, Lightbulb, CheckCircle2, 
  ChevronDown, ChevronUp, AlertCircle 
} from 'lucide-react';

const INSIGHTS_IMG = 'https://media.base44.com/images/public/69d145fab4e9dff45f4e4d66/2f8d2703a_generated_image.png';

export default function InsightsView({ recommended }) {
  if (!recommended) {
    return (
      <div className="p-12 text-center">
        <p className="text-amber-600">No recommendation data available.</p>
      </div>
    );
  }

  const { 
    insights = {}, 
    investmentGuidance, 
    bankRawInfo, 
    overview = {}, 
    bankName = "SBI"
  } = recommended;

  const [activeIdx, setActiveIdx] = useState(null);

  // Realistic surplus calculation
  const monthlyIncome = 99999;
  const emi = Math.round(overview?.emi || 12891);
  const postEmi = monthlyIncome - emi;
  const estimatedExpenses = 55000;
  const realisticSurplus = Math.max(postEmi - estimatedExpenses, 0);

  const allInsights = [
    ...(insights.ai || []).map(item => ({
      ...item,
      type: 'critical',
      icon: AlertCircle,
      label: 'Strategic Considerations'
    })),

    ...(insights.critical || []).map(i => ({
      ...i, type: 'critical', icon: TriangleAlert, label: 'Critical Warnings'
    })),

    ...(insights.warnings || []).map(i => ({
      ...i, type: 'warning', icon: Info, label: 'Risk Factors'
    })),

    ...(insights.suggestions || []).map(i => ({
      ...i, type: 'suggestion', icon: Lightbulb, label: 'Smart Moves'
    })),

    ...(bankRawInfo?.pros || []).map(pro => ({
      title: pro,
      type: 'benefit',
      icon: CheckCircle2,
      label: 'Bank Strengths',
      impact: `${bankName} offers this advantage.`,
      action: "Leverage this during your application."
    })),

    ...(bankRawInfo?.cons || []).map(con => ({
      title: con,
      type: 'warning',
      icon: Info,
      label: 'Bank Limitations',
      impact: `Be prepared for this when working with ${bankName}.`,
      action: "Discuss clearly with the branch officer."
    })),
  ];

  const grouped = allInsights.reduce((acc, curr) => {
    const key = curr.label || 'Other Insights';
    if (!acc[key]) acc[key] = [];
    acc[key].push(curr);
    return acc;
  }, {});

  return (
    <div className="max-w-5xl mx-auto space-y-16 pb-20 px-4">
      
      {/* Investment Guidance - Hero Card */}
      {investmentGuidance?.status === "RECOMMENDED" && (
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-3xl p-8 md:p-10 shadow-sm">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <img 
              src={INSIGHTS_IMG} 
              alt="Investment Insight" 
              className="w-16 h-16 object-contain flex-shrink-0" 
            />
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-emerald-900 mb-2">
                {investmentGuidance.title}
              </h3>
              <p className="text-lg text-emerald-700 font-medium">{investmentGuidance.headline}</p>
              <p className="mt-4 text-slate-700 leading-relaxed text-[15.5px]">
                {investmentGuidance.detailedAdvice}
              </p>
              <div className="mt-6 inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-2xl border border-emerald-100">
                <span className="text-emerald-600 font-semibold">Realistic Monthly Surplus:</span>
                <span className="font-bold text-emerald-700 text-lg">
                  ₹{realisticSurplus.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Insights Section */}
      <div>
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Deep Loan Insights</h2>
            <p className="text-slate-500 mt-2">What really matters for your future</p>
          </div>
          <div className="text-sm bg-slate-100 text-slate-500 px-4 py-2 rounded-full font-medium">
            {allInsights.length} insights
          </div>
        </div>

        {Object.entries(grouped).map(([label, items]) => (
          <div key={label} className="mb-16">
            <h3 className="uppercase tracking-[2px] text-xs font-bold text-slate-500 mb-6 px-1">
              {label}
            </h3>

            <div className="space-y-5">
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
          </div>
        ))}
      </div>
    </div>
  );
}

/* ==================== Enhanced Insight Card ==================== */
function DetailedInsightCard({ insight, isOpen, toggle }) {
  const themes = {
    critical: { 
      bg: 'bg-rose-50', 
      border: 'border-rose-300', 
      iconColor: 'text-rose-600',
      actionBg: 'bg-rose-100' 
    },
    warning: { 
      bg: 'bg-amber-50', 
      border: 'border-amber-300', 
      iconColor: 'text-amber-600',
      actionBg: 'bg-amber-100' 
    },
    suggestion: { 
      bg: 'bg-sky-50', 
      border: 'border-sky-300', 
      iconColor: 'text-sky-600',
      actionBg: 'bg-sky-100' 
    },
    benefit: { 
      bg: 'bg-emerald-50', 
      border: 'border-emerald-300', 
      iconColor: 'text-emerald-600',
      actionBg: 'bg-emerald-100' 
    },
  };

  const theme = themes[insight.type] || themes.warning;
  const Icon = insight.icon || Info;

  return (
    <div className={`${theme.bg} border ${theme.border} rounded-3xl overflow-hidden hover:shadow-lg transition-all duration-300`}>
      <button
        onClick={toggle}
        className="w-full p-7 text-left flex justify-between items-start group"
      >
        <div className="flex gap-5 flex-1">
          <div className="mt-1">
            <Icon className={`${theme.iconColor}`} size={26} />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-lg text-slate-900 leading-tight pr-10">
              {insight.title}
            </h4>
            {insight.explanation && (
              <p className="text-slate-600 mt-3 text-[15px] leading-relaxed line-clamp-3">
                {insight.explanation}
              </p>
            )}
          </div>
        </div>
        
        <div className="text-slate-400 group-hover:text-slate-600 transition-colors mt-1">
          {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-7 pb-8">
              <div className="pt-6 border-t border-slate-200 space-y-7">
                {(insight.why || insight.explanation) && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">WHY THIS MATTERS</p>
                    <p className="text-slate-700 text-[15px] leading-relaxed">
                      {insight.why || insight.explanation}
                    </p>
                  </div>
                )}

                {insight.impact && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">REAL IMPACT</p>
                    <p className="text-slate-700 font-medium text-[15px] leading-relaxed">
                      {insight.impact}
                    </p>
                  </div>
                )}

                {insight.action && (
                  <div className={`${theme.actionBg} p-6 rounded-2xl border border-white/60`}>
                    <p className="text-xs font-bold uppercase tracking-widest mb-3 text-emerald-700">✅ RECOMMENDED ACTION</p>
                    <p className="text-slate-800 font-medium leading-relaxed">
                      {insight.action}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
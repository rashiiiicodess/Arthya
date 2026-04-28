import React from 'react';
import { ArrowRight, Lightbulb } from 'lucide-react';

const ActionSuggestions = ({ recommended, status }) => {
  // Extract real insights from the database
  const suggestions = recommended?.insights?.suggestions || [];
  const aiExplanation = recommended?.aiExplanation;

  return (
    <div className={`border-2 rounded-[40px] p-8 ${status === 'danger' ? 'bg-rose-50/30 border-rose-100' : 'bg-slate-50 border-slate-100'}`}>
      <div className="flex items-center gap-3 mb-8">
        <div className={`p-2 rounded-xl ${status === 'danger' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
          <Lightbulb size={20} />
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">What you can do next</p>
          <h3 className={`font-bold ${status === 'danger' ? 'text-rose-800' : 'text-slate-800'}`}>
             {status === 'danger' ? "This plan is not financially feasible." : "Optimizing your financial path"}
          </h3>
        </div>
      </div>

      <div className="space-y-4">
        {suggestions.map((item, idx) => (
          <div key={idx} className="bg-white border border-slate-100 p-6 rounded-3xl flex justify-between items-center group cursor-pointer hover:border-violet-200 transition-all">
            <div className="space-y-1 pr-8">
              <div className="flex items-center gap-3">
                <p className="font-bold text-slate-900 text-sm">{item.title}</p>
                <span className="text-[10px] font-bold bg-violet-100 text-violet-600 px-2 py-0.5 rounded-full uppercase">
                  {item.impact || "High Impact"}
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
            </div>
            <ArrowRight size={18} className="text-slate-300 group-hover:text-violet-600 group-hover:translate-x-1 transition-all" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActionSuggestions;
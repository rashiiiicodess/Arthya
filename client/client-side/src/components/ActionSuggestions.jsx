import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Lightbulb, Target, TrendingDown, Calendar } from 'lucide-react';

const ActionSuggestions = ({ recommended, status, salary }) => {
  const emi = Number(recommended?.loan?.emi || 0);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemAnim = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  const dangerActions = [
    { title: "Reduce Principal", icon: <TrendingDown />, desc: "Borrowing less directly lowers your monthly burden." },
    { title: "Extend Tenure", icon: <Calendar />, desc: "Spread the cost over 12-15 years to lower the EMI." },
    { title: "Income Buffer", icon: <Target />, desc: "Ensure your starting salary is 2.5x the EMI before signing." }
  ];

  return (
    <div className="py-8">
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="p-2 bg-turquoise-50 text-turquoise-600 rounded-xl">
          <Lightbulb size={20} />
        </div>
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">AI Strategy Recommendations</h3>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {dangerActions.map((action, i) => (
          <motion.div 
            key={i}
            variants={itemAnim}
            whileHover={{ scale: 1.02 }}
            className="p-6 bg-white border border-slate-100 rounded-[2rem] flex items-center justify-between group cursor-pointer hover:border-turquoise-200 hover:shadow-xl hover:shadow-cyan-50/50 transition-all"
          >
            <div className="flex items-center gap-5">
              <div className="p-4 bg-slate-50 rounded-2xl text-slate-400 group-hover:bg-turquoise-50 group-hover:text-turquoise-500 transition-colors">
                {action.icon}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 group-hover:text-turquoise-600 transition-colors">{action.title}</h4>
                <p className="text-[11px] text-slate-500 font-medium leading-tight mt-1">{action.desc}</p>
              </div>
            </div>
            <ArrowRight size={18} className="text-slate-300 group-hover:text-turquoise-500 group-hover:translate-x-1 transition-all" />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ActionSuggestions;
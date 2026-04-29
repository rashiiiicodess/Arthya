import React from 'react';
import { motion } from 'framer-motion';
import { 
  ExternalLink, ShieldAlert, Award, Ban, Wallet, 
  Clock, Landmark, Percent, Home, Users, CheckCircle2 
} from 'lucide-react';

export default function CompareView({ results, onBankClick, salary }) {
  // 1. Safe sorting logic
  const sortedResults = [...results].sort((a, b) => 
    (a.overview?.totalRepayment || 0) - (b.overview?.totalRepayment || 0)
  );
  
  const bestBank = sortedResults[0];
  const worstBank = sortedResults[sortedResults.length - 1];

  return (
    <div className="space-y-10 pb-20 font-sans">
      
      {/* --- 1. INTELLIGENCE TABLE --- */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase italic">Lender Comparison Matrix</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Cross-referencing {results.length} bank policies</p>
          </div>
          <div className="flex gap-2">
            <span className="bg-emerald-100 text-emerald-700 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
              CSIS Eligibility Scan: ACTIVE
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/30">
                <th className="px-8 py-5">Lender & Speed</th>
                <th className="px-8 py-5">Rate Details</th>
                <th className="px-8 py-5">The Payables</th>
                <th className="px-8 py-5">Upfront Cost</th>
                <th className="px-8 py-5">Collateral & Risk</th>
                <th className="px-8 py-5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {sortedResults.map((bank, idx) => {
                const emi = bank.overview?.emi || 0;
                const totalInterest = bank.overview?.totalInterest || 0;
                const processingDays = bank.bankRawInfo?.processing?.time_days || "N/A";
                const marginMoney = bank.bankRawInfo?.loan?.margin_money_percent || 0;
                const collateralTypes = bank.bankRawInfo?.collateral?.type || [];
                const isWomenDiscount = (bank.bankRawInfo?.benefits?.women_discount_percent || 0) > 0;

                return (
                  <tr key={idx} className="group hover:bg-slate-50/40 transition-all duration-200">
                    <td className="px-8 py-6">
                      <button 
                        onClick={() => onBankClick(bank)}
                        className="font-black text-slate-900 hover:text-violet-600 transition-colors uppercase tracking-tight block text-sm"
                      >
                        {bank.bankName}
                      </button>
                      <div className="flex items-center gap-2 mt-1.5">
                         <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase flex items-center gap-1">
                           <Clock size={8} /> {processingDays} Days
                         </span>
                         {isWomenDiscount && (
                           <span className="text-[9px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded uppercase flex items-center gap-1">
                             <Users size={8} /> Women Disc.
                           </span>
                         )}
                      </div>
                    </td>

                    <td className="px-8 py-6">
                       <span className="font-black text-slate-700 text-sm">
                         {bank.bankRawInfo?.interest?.min}% - {bank.bankRawInfo?.interest?.max}%
                       </span>
                       <p className="text-[9px] text-slate-400 uppercase font-black tracking-tighter mt-1">
                         {bank.bankRawInfo?.interest?.calculation_method?.replace('_', ' ') || 'Reducing Balance'}
                       </p>
                    </td>

                    <td className="px-8 py-6">
                      <div className="font-black text-slate-900 text-sm tracking-tight">₹{Math.round(emi).toLocaleString()} /mo</div>
                      <div className="text-[10px] font-bold text-rose-500 mt-0.5">₹{Math.round(totalInterest).toLocaleString()} interest</div>
                    </td>

                    <td className="px-8 py-6">
                       <div className="font-bold text-slate-600 text-sm">{marginMoney}% Margin</div>
                       <p className="text-[9px] text-slate-400 uppercase font-black tracking-tighter mt-1 uppercase">
                         ₹{Math.round(bank.loan?.processingFee || 0).toLocaleString()} Proc. Fee
                       </p>
                    </td>

                    <td className="px-8 py-6">
                      <div className="flex flex-wrap gap-1 max-w-[150px]">
                        {collateralTypes.length > 0 ? collateralTypes.map(t => (
                          <span key={t} className="text-[8px] font-black bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded uppercase tracking-tighter border border-slate-200">{t}</span>
                        )) : (
                          <span className="text-[8px] font-black bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded uppercase tracking-tighter border border-emerald-100 italic">Collateral-Free</span>
                        )}
                      </div>
                      <div className="mt-2 flex items-center gap-1">
                         <div className={`w-1.5 h-1.5 rounded-full ${idx === 0 ? 'bg-emerald-500' : idx > 2 ? 'bg-rose-500' : 'bg-amber-400'}`} />
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                            {idx === 0 ? 'Primary' : idx > 2 ? 'Hazardous' : 'Viable'}
                         </span>
                      </div>
                    </td>

                    <td className="px-8 py-6 text-right">
                      <button onClick={() => onBankClick(bank)} className="p-2 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-violet-600 group-hover:text-white transition-all shadow-sm">
                        <ExternalLink size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- 2. THE "HIDDEN POLICY" SCANNER --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Margin Money Warning */}
        <div className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm space-y-4">
           <div className="w-10 h-10 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 border border-amber-100">
              <Percent size={20} />
           </div>
           <h6 className="font-black text-slate-900 uppercase text-xs tracking-tight">The "Upfront" Reality</h6>
           <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
             <span className="text-slate-900 font-bold">{bestBank?.bankName}</span> requires a <span className="text-amber-600 font-bold">{bestBank?.bankRawInfo?.loan?.margin_money_percent || 0}% margin</span>. 
             {bestBank?.input?.totalLoan ? (
               <> You need to pay ₹{Math.round(bestBank.input.totalLoan * ((bestBank.bankRawInfo?.loan?.margin_money_percent || 0)/100)).toLocaleString()} from your own pocket.</>
             ) : (
               <> Check bank terms for exact upfront payment amounts.</>
             )}
           </p>
        </div>

        {/* Subsidy Logic */}
        <div className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm space-y-4">
           <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 border border-emerald-100">
              <Landmark size={20} />
           </div>
           <h6 className="font-black text-slate-900 uppercase text-xs tracking-tight">Govt. Support Check</h6>
           <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
             {bestBank?.bankRawInfo?.subsidy?.csis_applicable 
               ? `Eligibility for CSIS detected. This could waive moratorium interest if your annual family income is below ₹4.5L.`
               : "No active interest subsidies detected for this lender."}
           </p>
           {bestBank?.bankRawInfo?.benefits?.tax_80E && (
             <div className="flex items-center gap-2 text-[9px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded w-fit">
               <CheckCircle2 size={10} /> Section 80E Tax Shield Active
             </div>
           )}
        </div>

        {/* Collateral Risk */}
        <div className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm space-y-4">
           <div className="w-10 h-10 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 border border-rose-100">
              <Home size={20} />
           </div>
           <h6 className="font-black text-slate-900 uppercase text-xs tracking-tight">Collateral Burden</h6>
           <div className="text-[11px] text-slate-500 font-medium leading-relaxed italic">
             {(bestBank?.bankRawInfo?.collateral?.required_above || 0) < (bestBank?.input?.totalLoan || 0)
               ? `Warning: This loan requires ${bestBank?.bankRawInfo?.collateral?.type?.join(' or ') || 'Security'} as security.`
               : "Safe: This loan amount falls under the collateral-free threshold for this bank."}
           </div>
        </div>
      </div>

      {/* --- 3. SAVINGS INTELLIGENCE (DELTA ANALYSIS) --- */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 rounded-[2rem] p-10 text-white overflow-hidden relative shadow-xl"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Award className="text-violet-400" size={20} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-300">Optimization Verdict</span>
            </div>
            <h4 className="text-2xl font-black tracking-tight leading-tight">
              Choosing <span className="text-violet-400">{bestBank?.bankName}</span> saves you ₹{Math.round((worstBank?.overview?.totalRepayment || 0) - (bestBank?.overview?.totalRepayment || 0)).toLocaleString()}
            </h4>
            <p className="text-slate-400 text-sm mt-3 max-w-xl font-medium leading-relaxed">
              That's nearly <span className="text-white font-bold">{Math.round(((worstBank?.overview?.totalRepayment || 0) - (bestBank?.overview?.totalRepayment || 0)) / (bestBank?.overview?.emi || 1))} months</span> of life without EMIs. 
              The efficiency gain is driven by the <span className="text-white font-bold uppercase text-[10px] tracking-widest px-1">{bestBank?.bankRawInfo?.interest?.calculation_method?.replace('_', ' ') || 'Direct'}</span> balance model.
            </p>
          </div>

          <div className="shrink-0 text-center md:text-right border-l border-slate-800 pl-8 hidden md:block">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Market Edge</div>
            <div className="text-5xl font-black text-violet-400 tracking-tighter">
              {worstBank?.overview?.totalRepayment ? Math.round((1 - (bestBank?.overview?.totalRepayment / worstBank?.overview?.totalRepayment)) * 100) : 0}%
            </div>
            <div className="text-[10px] font-bold text-slate-500 uppercase mt-2 italic">Cost Reduction</div>
          </div>
        </div>
      </motion.div>

    </div>
  );
}
import React from 'react';
import { AlertTriangle, Info } from "lucide-react";

const FullCostBreakdown = ({ recommended }) => {
  const loan = recommended?.loan || {};
  
  // Data Extraction
  const principal = Number(loan?.netDisbursed || 0);
  const totalRepayment = Number(loan?.totalRepayment || 0);
  const interestDuringRepayment = Number(loan?.interestDuringRepayment || 0);
  const moratoriumInterest = Number(recommended?.disbursement?.moratoriumInterest || 0);
  const effectivePrincipal = principal + moratoriumInterest;
  
  const years = Number(loan?.tenureYears || loan?.maxTenureYears || 10);
  const totalMonths = years * 12;
  const monthlyEMI = Number(loan?.emi || 0);

  // Percentage calculations for the segmented bar
  const principalWeight = (principal / totalRepayment) * 100;
  const growthWeight = (moratoriumInterest / totalRepayment) * 100;
  const interestWeight = (interestDuringRepayment / totalRepayment) * 100;

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm font-sans">
      {/* Header Section */}
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle size={18} className="text-amber-500" />
        <h3 className="font-bold text-slate-900">Full Cost Breakdown</h3>
      </div>
      <p className="text-slate-400 text-[11px] mb-8 leading-relaxed">
        You borrowed ₹{principal.toLocaleString('en-IN')} but will repay ₹{totalRepayment.toLocaleString('en-IN')} in total — 
        {Math.round((totalRepayment/principal - 1) * 100)}% more than you originally took.
      </p>

      {/* Main Math Table */}
      <div className="space-y-5">
        <div className="flex justify-between items-center text-sm">
          <span className="font-bold text-slate-800">Original loan amount</span>
          <span className="font-bold text-slate-900">₹{principal.toLocaleString('en-IN')}</span>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-center text-sm text-amber-600 font-bold">
            <span>+ Loan grows during study ({moratoriumInterest > 0 ? "Interest active" : "Subsidy active"})</span>
            <span>+₹{moratoriumInterest.toLocaleString('en-IN')}</span>
          </div>
          <p className="text-[10px] text-slate-400 max-w-[80%] leading-tight">
            Interest accrues while you study and is added to your principal before repayment begins.
          </p>
        </div>

        <div className="flex justify-between items-center py-4 border-t border-slate-50">
          <span className="font-bold text-slate-900 text-sm">= Effective principal (EMI calculated on this)</span>
          <span className="font-bold text-slate-900">₹{effectivePrincipal.toLocaleString('en-IN')}</span>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-center text-sm text-slate-900 font-bold">
            <span>EMI: ₹{Math.round(monthlyEMI).toLocaleString('en-IN')}/month × {totalMonths} months</span>
            <span>₹{totalRepayment.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between items-center pl-4 border-l-2 border-slate-100 text-[11px] text-slate-500">
            <span>of which: interest during repayment</span>
            <span>₹{Math.round(interestDuringRepayment).toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* The Big Purple Total */}
        <div className="flex justify-between items-center pt-6 border-t-2 border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-violet-600 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-violet-600" />
            </div>
            <span className="font-bold text-slate-900">Total You'll Pay</span>
          </div>
          <span className="text-2xl font-black text-[#6D28D9]">₹{Math.round(totalRepayment).toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Warning Callout */}
      <div className="mt-8 bg-amber-50/50 border border-amber-100 rounded-2xl p-4">
        <p className="text-xs text-amber-800 font-medium leading-relaxed">
          Almost <span className="font-bold">{Math.round(growthWeight + interestWeight)}%</span> of your total repayment goes toward interest and loan growth — <span className="underline">not</span> reducing your original loan.
        </p>
      </div>

      {/* Footer Disclaimer */}
      <p className="mt-6 text-[10px] text-slate-400 leading-relaxed italic">
        Your EMI is based on the effective principal and follows a <span className="font-bold">reducing balance method</span> — meaning interest decreases over time as your principal reduces with each payment.
      </p>

      {/* WHERE YOUR MONEY GOES - Segmented Bar */}
      <div className="mt-10">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Where your money goes</p>
        <div className="h-2.5 w-full bg-slate-100 rounded-full flex overflow-hidden">
          <div className="bg-[#6D28D9]" style={{ width: `${principalWeight}%` }} />
          <div className="bg-rose-400" style={{ width: `${growthWeight}%` }} />
          <div className="bg-amber-400" style={{ width: `${interestWeight}%` }} />
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4">
          <LegendItem color="bg-[#6D28D9]" label="Principal" percent={principalWeight} />
          <LegendItem color="bg-rose-400" label="Study Growth" percent={growthWeight} />
          <LegendItem color="bg-amber-400" label="Repayment Interest" percent={interestWeight} />
        </div>
      </div>
    </div>
  );
};

const LegendItem = ({ color, label, percent }) => (
  <div className="flex items-center gap-2">
    <div className={`w-2 h-2 rounded-full ${color}`} />
    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
      {label} — {Math.round(percent)}%
    </span>
  </div>
);

export default FullCostBreakdown;
import React from 'react';
import { AlertTriangle, TrendingUp } from "lucide-react";

const FullCostBreakdown = ({ recommended }) => {
  const loan = recommended?.loan || {};
  const disbursement = recommended?.disbursement || {};
  const bankRawInfo = recommended?.bankRawInfo || {};
  const userInfo = recommended?.userInfo || {};

  const sanctionedAmount = Number(loan?.sanctionedAmount || loan?.requestedLoan || 2000000);
  const principal = Number(loan?.netDisbursed || sanctionedAmount);   // Net Disbursed

  const totalRepayment = Number(loan?.totalRepayment || 0);
  const interestDuringRepayment = Number(loan?.interestDuringRepayment || 0);
  const interestRate = Number(loan?.interestRate || bankRawInfo?.interestRate || 8.5);
  const years = Number(loan?.years || loan?.tenureYears || 13);
  const emi = Number(loan?.emi || 44009);

  // Improved CSIS Logic
  const bankOffersCSIS = 
    bankRawInfo?.subsidy?.csis_applicable === true || 
    bankRawInfo?.subsidy?.csis === true;

  const userIsEligibleForCSIS = 
    userInfo?.csisEligible === true || 
    userInfo?.familyIncomeBelow4_5L === true || 
    recommended?.csisEligible === true;

  const csisApplicable = bankOffersCSIS && userIsEligibleForCSIS;

  // Final Moratorium Interest
  const moratoriumInterest = csisApplicable ? 0 : Number(disbursement?.moratoriumInterest || 0);

  const effectivePrincipal = principal + moratoriumInterest;
  const totalInterest = interestDuringRepayment + moratoriumInterest;

  const principalWeight = totalRepayment > 0 ? Math.round((sanctionedAmount / totalRepayment) * 100) : 0;
  const moratoriumWeight = totalRepayment > 0 ? Math.round((moratoriumInterest / totalRepayment) * 100) : 0;
  const repaymentInterestWeight = totalRepayment > 0 ? Math.round((interestDuringRepayment / totalRepayment) * 100) : 0;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-10 shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        <AlertTriangle size={22} className="text-amber-500" />
        <h3 className="text-2xl font-bold text-slate-900">Full Cost Breakdown</h3>
      </div>

      {/* ==================== AMOUNT BREAKDOWN ==================== */}
      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 mb-10">
        <p className="uppercase text-xs font-bold text-slate-500 mb-4 tracking-widest">AMOUNT BREAKDOWN</p>
        
        <div className="space-y-5">
          <div className="flex justify-between">
            <span className="text-slate-500">Sanctioned Amount (Requested)</span>
            <span className="font-semibold">₹{sanctionedAmount.toLocaleString('en-IN')}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Net Disbursed Amount</span>
            <span className="font-semibold text-amber-600">₹{principal.toLocaleString('en-IN')}</span>
          </div>

          <div className="flex justify-between border-t pt-4">
            <span className="text-slate-500">Moratorium Interest</span>
            <span className={`font-semibold ${csisApplicable ? 'text-emerald-600' : 'text-amber-600'}`}>
              {csisApplicable 
                ? "₹0 (CSIS Subsidy Applied)" 
                : `+ ₹${moratoriumInterest.toLocaleString('en-IN')}`}
            </span>
          </div>

          <div className="flex justify-between border-t border-slate-300 pt-5 font-medium text-lg bg-white p-4 rounded-xl">
            <span className="text-slate-700">Effective Principal (EMI calculated on this)</span>
            <span className="font-bold text-rose-600">₹{effectivePrincipal.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Helpful Note */}
        <div className="mt-6 text-xs text-amber-700 bg-amber-50 p-4 rounded-xl leading-relaxed">
          <strong>Note:</strong> The Net Disbursed Amount is higher than your requested ₹20 Lakh because the bank calculates 
          based on the actual course fee structure provided by your college. 
          <br /><br />
          If you want to strictly limit the loan to ₹20 Lakh only, inform the bank to <strong>cap the disbursement</strong> at your requested amount.
        </div>
      </div>

      {/* ==================== LOAN TERMS ==================== */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 mb-10">
        <p className="uppercase text-xs font-bold text-slate-500 mb-4 tracking-widest">Loan Terms</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-slate-500 text-sm">Interest Rate</p>
            <p className="font-bold">{interestRate}% p.a.</p>
          </div>
          <div>
            <p className="text-slate-500 text-sm">Tenure</p>
            <p className="font-bold">{years} Years</p>
          </div>
          <div>
            <p className="text-slate-500 text-sm">Monthly EMI</p>
            <p className="font-bold">₹{emi.toLocaleString('en-IN')}</p>
          </div>
          <div>
            <p className="text-slate-500 text-sm">CSIS Status</p>
            <p className={`font-bold ${csisApplicable ? 'text-emerald-600' : 'text-rose-600'}`}>
              {csisApplicable ? "Approved" : "Not Applied"}
            </p>
          </div>
        </div>
      </div>

      {/* Total Interest */}
      <div className="bg-rose-50 border border-rose-100 rounded-2xl p-7 mb-10">
        <TrendingUp className="text-rose-500 mb-3" size={22} />
        <p className="font-semibold text-rose-700">Total Interest You Will Pay</p>
        <p className="text-3xl font-bold text-rose-600 mt-1">₹{totalInterest.toLocaleString('en-IN')}</p>
      </div>

      {/* Bar Breakdown */}
      <div>
        <p className="text-sm font-bold text-slate-600 mb-4">Breakdown of Total Repayment</p>
        <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex">
          <div className="bg-violet-600 h-full" style={{ width: `${principalWeight}%` }} />
          <div className="bg-rose-500 h-full" style={{ width: `${moratoriumWeight}%` }} />
          <div className="bg-amber-500 h-full" style={{ width: `${repaymentInterestWeight}%` }} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <LegendItem color="bg-violet-600" label="Original Principal" amount={sanctionedAmount} percent={principalWeight} />
          <LegendItem color="bg-rose-500" label="Moratorium Interest" amount={moratoriumInterest} percent={moratoriumWeight} />
          <LegendItem color="bg-amber-500" label="Repayment Interest" amount={interestDuringRepayment} percent={repaymentInterestWeight} />
        </div>
      </div>
    </div>
  );
};

const LegendItem = ({ color, label, amount, percent }) => (
  <div className="flex gap-4">
    <div className={`w-4 h-4 rounded mt-1.5 flex-shrink-0 ${color}`} />
    <div>
      <p className="font-medium text-slate-700">{label}</p>
      <p className="text-xl font-semibold text-slate-900">₹{amount.toLocaleString('en-IN')}</p>
      <p className="text-xs text-slate-500">{percent}%</p>
    </div>
  </div>
);

export default FullCostBreakdown;
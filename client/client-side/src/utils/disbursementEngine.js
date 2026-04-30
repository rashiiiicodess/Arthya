import { calculateLoan } from "./LoanCalculator";

export function getSubsidyPolicy(parentalIncome) {
  if (!parentalIncome || parentalIncome <= 0) {
    return { eligible: false, applySubsidy: false, label: "Unknown", note: "Income data missing" };
  }
  if (parentalIncome <= 450000) {
    return { eligible: true, applySubsidy: true, label: "CSIS Eligible", note: "Moratorium interest likely subsidized" };
  }
  return { eligible: false, applySubsidy: false, label: "Not Eligible", note: "Family income exceeds ₹4.5L threshold" };
}

function calcTrancheInterest(amount, annualRate, months, type = "compound") {
  if (months <= 0 || amount <= 0) return 0;
  const r = annualRate / 100 / 12;
  return type === "simple" ? amount * r * months : amount * (Math.pow(1 + r, months) - 1);
}

function generateDynamicInsights(result, params) {
  const { totalMoratoriumInterest, monthlyPrepay, moneySaved, tenureSaved, subsidyPolicy, surplusDeficit, emi, emiToSalaryRatio } = result;
  const fmt = (v) => "₹" + Math.round(v || 0).toLocaleString("en-IN");

  const isRisky = emiToSalaryRatio >= 25;
  const isHighPrepay = params.surplusPrepayPct >= 20;
  const isFragileSurplus = surplusDeficit < 18000;

  return {
    verdict: { 
      type: isRisky ? "danger" : (emiToSalaryRatio >= 20 ? "warning" : "safe"), 
      headline: isRisky ? "HIGH RISK - EMI Burden Too High" : "Strategic Debt Map" 
    },

    realityCheck: [
      { label: "Monthly Salary", value: fmt(params.expectedSalary) },
      { label: "EMI Obligation", value: fmt(emi) },
      { label: "Net Surplus (after ~60% living expenses)", value: fmt(surplusDeficit) }
    ],

    disbursementImpact: [{
      title: "Moratorium Interest",
      means: `${fmt(totalMoratoriumInterest)} interest accrues during course + grace period.`,
      action: "This is a significant burden. Consider staggering disbursements and partial interest servicing during studies."
    }],

    hiddenCosts: [{
      title: "Prepayment Reality",
      means: `Extra ₹${monthlyPrepay.toLocaleString()}/month can save ${fmt(moneySaved)} in interest.`,
      action: isFragileSurplus 
        ? "Prepayment is fragile. Build emergency fund first before aggressive prepayment."
        : isHighPrepay 
          ? `Excellent strategy! This reduces your loan by ${tenureSaved} years.`
          : "Good start. Higher prepayment would have even more impact."
    }],

    parentalIncome: [{
      title: "Subsidy Status",
      means: subsidyPolicy.eligible ? "Eligible for CSIS Interest Subsidy" : "Not eligible for moratorium subsidy",
      action: subsidyPolicy.eligible 
        ? "Submit documents early — this can significantly reduce the moratorium burden." 
        : "No subsidy. Focus on controlling disbursements and partial interest payment during study."
    }],

    conclusion: {
      text: isRisky 
        ? `Warning: EMI at ${emiToSalaryRatio}% of salary is risky for a fresh graduate. Surplus is thin. Prioritize emergency fund, staggered disbursements, and consider paying some interest during studies.`
        : "The loan is manageable with discipline, but keep expenses realistic (often 60%+ in metros)."
    }
  };
}

export function runDisbursementAnalysis(params) {
  const {
    totalLoanAmount,
    interestRate,
    courseDuration,
    gracePeriod = 0.5,
    repaymentTenure = 7,
    expectedSalary = 100000,
    parentalIncome = null,
    disbursements = [],
    loanInsurance = 25000,
    surplusPrepayPct = 25,
    interestType = "compound"
  } = params;   // <-- This is the fix: destructure from the passed object

  const moratoriumMonths = Math.round((courseDuration + gracePeriod) * 12);
  const subsidy = getSubsidyPolicy(parentalIncome);

  let totalMoratoriumInterest = 0;

  const breakdown = disbursements.map((t) => {
    const startMonth = (t.year - 1) * 12;
    const monthsAccruing = Math.max(0, moratoriumMonths - startMonth);
    const interest = calcTrancheInterest(t.amount, interestRate, monthsAccruing, interestType);
    totalMoratoriumInterest += interest;

    return {
      year: t.year,
      amount: t.amount,
      interest: Math.round(interest),
      growsTo: Math.round(t.amount + interest)
    };
  });

  const disbursedPrincipal = totalLoanAmount + loanInsurance;
  const adjustedMoratorium = subsidy.applySubsidy ? 0 : totalMoratoriumInterest;
  const effectivePrincipal = disbursedPrincipal + adjustedMoratorium;

  const tenureMonths = repaymentTenure * 12;

  const baseLoan = calculateLoan({
    principal: effectivePrincipal,
    annualRate: interestRate,
    tenureMonths
  });

  const estimatedLivingExpenses = expectedSalary * 0.60; // realistic assumption
  const realSurplus = expectedSalary - baseLoan.emi - estimatedLivingExpenses;

  const monthlyPrepay = Math.round(Math.max(0, realSurplus) * (surplusPrepayPct / 100));

  let moneySaved = 0;
  let tenureSaved = 0;

  if (monthlyPrepay > 1000) {
    const prepayments = Array.from({ length: tenureMonths }, (_, i) => ({ month: i + 1, amount: monthlyPrepay }));
    const prepaidLoan = calculateLoan({ principal: effectivePrincipal, annualRate: interestRate, tenureMonths, prepayments });
    moneySaved = baseLoan.totalRepayment - prepaidLoan.totalRepayment;
    tenureSaved = Math.max(0, Math.round((tenureMonths - prepaidLoan.schedule.length) / 12));
  }

  const totalRepayment = baseLoan.totalRepayment;

  return {
    disbursementBreakdown: breakdown,
    totalDisbursed: disbursedPrincipal,
    totalMoratoriumInterest: Math.round(totalMoratoriumInterest),
    effectivePrincipal: Math.round(effectivePrincipal),
    disbursedPrincipal,

    emi: baseLoan.emi,
    totalRepayment,

    surplusDeficit: Math.round(realSurplus),
    isDeficit: realSurplus < 0,
    emiToSalaryRatio: Math.round((baseLoan.emi / expectedSalary) * 100) || 0,

    monthlyPrepay,
    moneySaved: Math.round(moneySaved),
    tenureSaved,

    percentages: {
      disbursedPct: Math.round((disbursedPrincipal / totalRepayment) * 100),
      moratoriumPct: subsidy.applySubsidy ? 0 : Math.round((totalMoratoriumInterest / totalRepayment) * 100),
      repaymentInterestPct: Math.round((baseLoan.interestDuringRepayment / totalRepayment) * 100)
    },

    subsidyPolicy: subsidy,

    insights: generateDynamicInsights({
      totalMoratoriumInterest,
      monthlyPrepay,
      moneySaved,
      tenureSaved,
      subsidyPolicy: subsidy,
      surplusDeficit: realSurplus,
      emi: baseLoan.emi,
      emiToSalaryRatio: Math.round((baseLoan.emi / expectedSalary) * 100)
    }, params)
  };
}

export function generateEqualDisbursements(totalAmount, courseDuration) {
  const n = Math.max(1, Math.round(courseDuration));
  const perYear = Math.round(totalAmount / n);
  return Array.from({ length: n }, (_, i) => ({ year: i + 1, amount: perYear }));
}
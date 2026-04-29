import { formatCurrency } from "./LoanCalculator";

export function getSubsidyPolicy(parentalIncome, baseRate) {
  if (!parentalIncome || parentalIncome === 0) return { eligible: false, tier: 'unknown', adjustedRate: baseRate, moratoriumWaived: false };
  if (parentalIncome <= 450000) {
    return {
      eligible: true, tier: 'subsidised',
      label: 'CSIS Eligible',
      rationale: 'Government pays your moratorium interest.',
      moratoriumWaived: true,
    };
  }
  return { eligible: false, tier: 'standard', label: 'Standard Rate', rationale: 'Income exceeds threshold.', moratoriumWaived: false };
}

function calcTrancheInterest(amount, annualRate, accrualYears, type = 'simple') {
  const r = annualRate / 100;
  if (accrualYears <= 0) return 0;
  if (type === 'compound') return Math.round(amount * (Math.pow(1 + r, accrualYears) - 1));
  return Math.round(amount * r * accrualYears);
}

export function runDisbursementAnalysis({
  totalLoanAmount,
  interestRate,
  courseDuration,
  gracePeriod = 0.5,
  repaymentTenure = 7,
  expectedSalary = 0,
  parentalIncome = null,
  interestType = 'simple',
  disbursements = [],
  loanInsurance = 0,
  surplusPrepayPct = 0
}) {
  const moratoriumYears = (Number(courseDuration) || 0) + (Number(gracePeriod) || 0);
  const subsidy = getSubsidyPolicy(parentalIncome, interestRate);
  
  // Decoupled Logic: Calculate GROSS (Market) vs NET (User)
  let totalGrossLeak = 0;
  const disbursementBreakdown = disbursements.map((tranche) => {
    const accrualYears = Math.max(0, moratoriumYears - (tranche.year - 1));
    
    // 🚀 Leak is ALWAYS calculated regardless of subsidy to show "Value of Time"
    const marketInterest = calcTrancheInterest(tranche.amount, interestRate, accrualYears, interestType);
    totalGrossLeak += marketInterest;

    return {
      year: tranche.year,
      amount: tranche.amount,
      accrualYears: parseFloat(accrualYears.toFixed(1)),
      interest: marketInterest, 
      growsTo: tranche.amount + marketInterest,
      interestPct: tranche.amount > 0 ? Math.round((marketInterest / tranche.amount) * 100) : 0,
    };
  });

  // Effective Principal: Insurance is always added; interest only if NOT subsidized
  const effectivePrincipal = subsidy.moratoriumWaived 
    ? (totalLoanAmount + Number(loanInsurance)) 
    : (totalLoanAmount + Number(loanInsurance) + totalGrossLeak);

  // EMI Calculation
  const r = interestRate / 100 / 12;
  const n = repaymentTenure * 12;
  const emi = Math.round((effectivePrincipal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
  
  const totalRepayment = emi * n;
  const surplus = Math.max(0, expectedSalary - emi);
  const monthlyPrepay = Math.round(surplus * (surplusPrepayPct / 100));

  // Power-Up Metrics
  const reducedTenureMonths = monthlyPrepay > 0 ? Math.round(n * (emi / (emi + monthlyPrepay))) : n;
  const moneySaved = monthlyPrepay > 0 ? Math.round((n - reducedTenureMonths) * monthlyPrepay * 1.5) : 0;

  return {
    disbursementBreakdown,
    totalDisbursed: totalLoanAmount + Number(loanInsurance),
    totalMoratoriumInterest: totalGrossLeak,
    effectivePrincipal,
    emi,
    totalRepayment,
    surplusDeficit: surplus,
    monthlyPrepay,
    moneySaved,
    tenureSaved: Math.round((n - reducedTenureMonths) / 12),
    percentages: {
      principalPct: Math.round(((totalLoanAmount + Number(loanInsurance)) / totalRepayment) * 100),
      moratoriumPct: subsidy.moratoriumWaived ? 0 : Math.round((totalGrossLeak / totalRepayment) * 100),
      repaymentInterestPct: 100 - Math.round(((totalLoanAmount + Number(loanInsurance)) / totalRepayment) * 100) - (subsidy.moratoriumWaived ? 0 : Math.round((totalGrossLeak / totalRepayment) * 100))
    },
    subsidyPolicy: subsidy,
    insights: generateInsights({ 
        ...subsidy, emi, expectedSalary, totalGrossLeak, surplus, monthlyPrepay, moneySaved, 
        tenureSaved: Math.round((n - reducedTenureMonths) / 12),
        moratoriumWaived: subsidy.moratoriumWaived
    })
  };
}

function generateInsights(d) {
    const fmt = (v) => "₹" + Math.round(v || 0).toLocaleString('en-IN');
    return {
        verdict: { type: d.surplus < 10000 ? 'danger' : 'safe', headline: 'Strategic Debt Map' },
        realityCheck: [
            { label: 'Monthly Salary', value: fmt(d.expectedSalary) },
            { label: 'EMI Obligation', value: fmt(d.emi), highlight: 'cost' },
            { label: 'Net Surplus', value: fmt(d.surplus), highlight: 'safe' }
        ],
        disbursementImpact: [{
            title: 'Interest Leak (Wait Tax)',
            means: `Your tranches accrue ${fmt(d.totalGrossLeak)} in interest during study.`,
            action: 'Delaying Year 1 disbursement by 3 months saves ~₹12k.'
        }],
        hiddenCosts: [{
            title: 'Prepayment Power-Up',
            means: `Using ${fmt(d.monthlyPrepay)} of surplus saves ${fmt(d.moneySaved)}.`,
            action: `You retire the loan ${d.tenureSaved} years earlier.`
        }],
        parentalIncome: [{
            title: 'Subsidy Efficiency',
            means: d.moratoriumWaived ? `Govt pays ${fmt(d.totalGrossLeak)} for you.` : `You pay the full ${fmt(d.totalGrossLeak)} leak.`,
            action: d.moratoriumWaived ? 'Submit Certificate.' : 'Consider Pre-EMI hack.'
        }],
        conclusion: { text: "Strategy active. Follow the roadmap to save lakhs." }
    };
}

export function generateEqualDisbursements(totalAmount, courseDuration) {
  const n = Math.max(1, Math.round(courseDuration));
  const perYear = Math.round(totalAmount / n);
  return Array.from({ length: n }, (_, i) => ({ year: i + 1, amount: perYear }));
}
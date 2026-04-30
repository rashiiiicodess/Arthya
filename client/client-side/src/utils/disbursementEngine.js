import { calculateLoan } from "./LoanCalculator";

/* ───────────────────────────────
   SUBSIDY LOGIC
─────────────────────────────── */
export function getSubsidyPolicy(parentalIncome) {
  if (!parentalIncome) {
    return {
      eligible: false,
      applySubsidy: false,
      label: "Unknown",
      note: "Income missing"
    };
  }

  if (parentalIncome <= 450000) {
    return {
      eligible: true,
      applySubsidy: true,
      label: "CSIS Eligible",
      note: "Moratorium interest may be covered"
    };
  }

  return {
    eligible: false,
    applySubsidy: false,
    label: "Not Eligible",
    note: "Income exceeds threshold"
  };
}

/* ───────────────────────────────
   TRANCHE INTEREST
─────────────────────────────── */
function calcTrancheInterest(amount, annualRate, months, type = "compound") {
  const r = annualRate / 100 / 12;
  if (months <= 0) return 0;

  if (type === "compound") {
    return amount * (Math.pow(1 + r, months) - 1);
  }

  return amount * r * months;
}

/* ───────────────────────────────
   INSIGHTS
─────────────────────────────── */
function generateInsights({
  emi,
  expectedSalary,
  moratoriumInterest,
  monthlyPrepay,
  moneySaved,
  tenureSaved,
  subsidyPolicy,
  surplus
}) {
  const fmt = (v) => "₹" + Math.round(v || 0).toLocaleString("en-IN");

  return {
    verdict: {
      type: surplus < 10000 ? "danger" : "safe",
      headline: "Strategic Debt Map"
    },

    realityCheck: [
      { label: "Monthly Salary", value: fmt(expectedSalary) },
      { label: "EMI Obligation", value: fmt(emi) },
      { label: "Net Surplus", value: fmt(surplus) }
    ],

    disbursementImpact: [
      {
        title: "Moratorium Interest Impact",
        means: `Loan accumulates ${fmt(moratoriumInterest)} during study.`,
        action: "Earlier disbursement reduces interest."
      }
    ],

    hiddenCosts: [
      {
        title: "Prepayment Advantage",
        means: `Using ${fmt(monthlyPrepay)} monthly saves ${fmt(moneySaved)}.`,
        action: `Loan closes ${tenureSaved} years earlier.`
      }
    ],

    parentalIncome: [
      {
        title: "Subsidy Status",
        means: subsidyPolicy.eligible
          ? "Eligible for CSIS benefits"
          : "Not eligible",
        action: subsidyPolicy.eligible
          ? "Apply with documents"
          : "Optimize prepayment"
      }
    ],

    conclusion: {
      text: "Loan is manageable if disciplined repayment strategy is followed."
    }
  };
}

/* ───────────────────────────────
   MAIN ENGINE
─────────────────────────────── */
export function runDisbursementAnalysis({
  totalLoanAmount,
  interestRate,
  courseDuration,
  gracePeriod = 0.5,
  repaymentTenure = 7,
  expectedSalary = 0,
  parentalIncome = null,
  disbursements = [],
  loanInsurance = 0,
  surplusPrepayPct = 0
}) {
  const moratoriumMonths = Math.round((courseDuration + gracePeriod) * 12);

  const subsidy = getSubsidyPolicy(parentalIncome);

  let totalMoratoriumInterest = 0;

  const breakdown = disbursements.map((t) => {
    const startMonth = (t.year - 1) * 12;
    const months = Math.max(0, moratoriumMonths - startMonth);

    const interest = calcTrancheInterest(
      t.amount,
      interestRate,
      months,
      "compound"
    );

    totalMoratoriumInterest += interest;

    return {
      year: t.year,
      amount: t.amount,
      interest: Math.round(interest),
      growsTo: Math.round(t.amount + interest)
    };
  });

  const basePrincipal = totalLoanAmount + loanInsurance;

  const adjustedMoratorium = subsidy.applySubsidy
    ? 0
    : totalMoratoriumInterest;

  const effectivePrincipal = basePrincipal + adjustedMoratorium;

  const tenureMonths = repaymentTenure * 12;

  const baseLoan = calculateLoan({
    principal: effectivePrincipal,
    annualRate: interestRate,
    tenureMonths
  });

  const emi = baseLoan.emi;

  const estimatedExpenses = expectedSalary * 0.5;
  const realSurplus = expectedSalary - emi - estimatedExpenses;

  const emiToSalaryRatio = Math.round((emi / expectedSalary) * 100);

  const isDeficit = realSurplus < 0;

  const monthlyPrepay = Math.round(
    Math.max(0, realSurplus) * (surplusPrepayPct / 100)
  );

  let moneySaved = 0;
  let tenureSaved = 0;

  if (monthlyPrepay > 0) {
    const prepayments = Array.from({ length: tenureMonths }, (_, i) => ({
      month: i + 1,
      amount: monthlyPrepay
    }));

    const prepaid = calculateLoan({
      principal: effectivePrincipal,
      annualRate: interestRate,
      tenureMonths,
      prepayments
    });

    moneySaved = baseLoan.totalRepayment - prepaid.totalRepayment;

    tenureSaved = Math.max(
      0,
      Math.round((tenureMonths - prepaid.schedule.length) / 12)
    );
  }

  const totalInterest =
    baseLoan.interestDuringRepayment + totalMoratoriumInterest;

  return {
    disbursementBreakdown: breakdown,

    totalDisbursed: totalLoanAmount + loanInsurance,
    totalMoratoriumInterest: Math.round(totalMoratoriumInterest),
    effectivePrincipal: Math.round(effectivePrincipal),

    emi,
    totalRepayment: baseLoan.totalRepayment,

    surplusDeficit: realSurplus,
    isDeficit,
    emiToSalaryRatio,

    monthlyPrepay,
    moneySaved: Math.round(moneySaved),
    tenureSaved,

    percentages: {
      principalPct: Math.round((basePrincipal / baseLoan.totalRepayment) * 100),
      moratoriumPct: subsidy.applySubsidy
        ? 0
        : Math.round((totalMoratoriumInterest / baseLoan.totalRepayment) * 100),
      repaymentInterestPct: Math.round(
        (baseLoan.interestDuringRepayment / baseLoan.totalRepayment) * 100
      )
    },

    subsidyPolicy: subsidy,

    insights: generateInsights({
      emi,
      expectedSalary,
      moratoriumInterest: totalMoratoriumInterest,
      monthlyPrepay,
      moneySaved,
      tenureSaved,
      subsidyPolicy: subsidy,
      surplus: realSurplus
    })
  };
}

/* ───────────────────────────────
   GENERATOR
─────────────────────────────── */
export function generateEqualDisbursements(totalAmount, courseDuration) {
  const n = Math.max(1, Math.round(courseDuration));
  const perYear = Math.round(totalAmount / n);

  return Array.from({ length: n }, (_, i) => ({
    year: i + 1,
    amount: perYear
  }));
}

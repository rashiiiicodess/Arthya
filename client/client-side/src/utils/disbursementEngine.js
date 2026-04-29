import { calculateLoan } from "./LoanCalculator";

/* ───────────────────────────────
   SUBSIDY LOGIC (CSIS MODEL)
─────────────────────────────── */
export function getSubsidyPolicy(parentalIncome) {
  if (!parentalIncome) {
    return {
      eligible: false,
      applySubsidy: false,
      label: "Unknown",
      note: "Income data missing"
    };
  }

  if (parentalIncome <= 450000) {
    return {
      eligible: true,
      applySubsidy: true,
      label: "CSIS Eligible",
      note: "Moratorium interest may be covered by government"
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
   TRANCHE INTEREST (REAL MODEL)
─────────────────────────────── */
function calcTrancheInterest(amount, annualRate, months, type = "simple") {
  const r = annualRate / 100 / 12;
  if (months <= 0) return 0;

  if (type === "compound") {
    return amount * (Math.pow(1 + r, months) - 1);
  }

  return amount * r * months;
}

/* ───────────────────────────────
   INSIGHTS ENGINE
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
        action: "Reducing disbursement delay reduces total interest."
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
          ? "You are eligible for CSIS benefits (approval required)."
          : "No subsidy applicable.",
        action: subsidyPolicy.eligible
          ? "Apply with documentation to bank."
          : "Focus on prepayment optimization."
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
  const monthlyRate = interestRate / 12 / 100;

  const subsidy = getSubsidyPolicy(parentalIncome);

  /* ───────────────────────────────
     1. MORATORIUM INTEREST (REALISTIC)
  ──────────────────────────────── */
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
      accrualMonths: months,
      interest: Math.round(interest),
      growsTo: Math.round(t.amount + interest),
      interestPct: t.amount
        ? Math.round((interest / t.amount) * 100)
        : 0
    };
  });

  /* ───────────────────────────────
     2. EFFECTIVE PRINCIPAL
  ──────────────────────────────── */
  const basePrincipal = totalLoanAmount + loanInsurance;

  const effectivePrincipal = subsidy.applySubsidy
    ? basePrincipal
    : basePrincipal + totalMoratoriumInterest;

  /* ───────────────────────────────
     3. EMI CALCULATION
  ──────────────────────────────── */
  const tenureMonths = repaymentTenure * 12;

  const baseLoan = calculateLoan({
    principal: effectivePrincipal,
    annualRate: interestRate,
    tenureMonths
  });

  const emi = baseLoan.emi;

  /* ───────────────────────────────
     4. REAL SURPLUS MODEL
  ──────────────────────────────── */
  const estimatedExpenses = expectedSalary * 0.5;
  const realSurplus = Math.max(0, expectedSalary - emi - estimatedExpenses);

  const monthlyPrepay = Math.round(
    realSurplus * (surplusPrepayPct / 100)
  );

  /* ───────────────────────────────
     5. PREPAYMENT SIMULATION
  ──────────────────────────────── */
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

  /* ───────────────────────────────
     6. FINAL OUTPUT
  ──────────────────────────────── */
  return {
    disbursementBreakdown: breakdown,

    totalDisbursed: totalLoanAmount + loanInsurance,
    totalMoratoriumInterest: Math.round(totalMoratoriumInterest),
    effectivePrincipal: Math.round(effectivePrincipal),

    emi,
    totalRepayment: baseLoan.totalRepayment,

    surplusDeficit: realSurplus,
    monthlyPrepay,

    moneySaved: Math.round(moneySaved),
    tenureSaved,

    percentages: {
      principalPct: Math.round(
        (basePrincipal / baseLoan.totalRepayment) * 100
      ),

      moratoriumPct: subsidy.applySubsidy
        ? 0
        : Math.round(
            (totalMoratoriumInterest / baseLoan.totalRepayment) * 100
          ),

      repaymentInterestPct: 100
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
   DISBURSEMENT GENERATOR
─────────────────────────────── */
export function generateEqualDisbursements(totalAmount, courseDuration) {
  const n = Math.max(1, Math.round(courseDuration));
  const perYear = Math.round(totalAmount / n);

  return Array.from({ length: n }, (_, i) => ({
    year: i + 1,
    amount: perYear
  }));
}

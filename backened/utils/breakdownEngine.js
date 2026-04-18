export function generateBreakdown({
  loan,
  disbursement,
  input
}) {
  const timeline = [];

  const {
    schedule
  } = loan;

  const {
    breakdown,
    moratoriumInterest,
    effectivePrincipal
  } = disbursement;

  // =========================
  // 🧱 PHASE 1: DISBURSEMENT
  // =========================

  breakdown.forEach(tranche => {
    timeline.push({
      type: "disbursement",
      label: `Tranche ${tranche.tranche}`,
      month: tranche.startMonth,
      amount: tranche.amount,
      impact: tranche.finalAmount,
      interest: tranche.interest,
      description: `₹${tranche.amount.toLocaleString()} disbursed → grows to ₹${tranche.finalAmount.toLocaleString()}`
    });
  });

  // =========================
  // ⏳ PHASE 2: MORATORIUM
  // =========================

  timeline.push({
    type: "moratorium_summary",
    label: "Moratorium Impact",
    month: 0,
    interest: moratoriumInterest,
    description: `Loan grew by ₹${moratoriumInterest.toLocaleString()} before EMI started`
  });

  // =========================
  // 💸 PHASE 3: REPAYMENT FLOW
  // =========================

  let yearly = {};
  let peakInterestMonth = null;
  let maxInterest = 0;

  schedule.forEach(row => {
    const year = Math.ceil(row.month / 12);

    if (!yearly[year]) {
      yearly[year] = {
        year,
        totalEMI: 0,
        interestPaid: 0,
        principalPaid: 0,
        endBalance: row.balance
      };
    }

    yearly[year].totalEMI += row.emi;
    yearly[year].interestPaid += row.interest;
    yearly[year].principalPaid += row.principal;
    yearly[year].endBalance = row.balance;

    // Track peak interest month
    if (row.interest > maxInterest) {
      maxInterest = row.interest;
      peakInterestMonth = row.month;
    }
  });

  const yearlyBreakdown = Object.values(yearly).map(y => ({
    ...y,
    totalEMI: Math.round(y.totalEMI),
    interestPaid: Math.round(y.interestPaid),
    principalPaid: Math.round(y.principalPaid),
    endBalance: Math.round(y.endBalance),
    interestShare: Math.round(
      (y.interestPaid / (y.interestPaid + y.principalPaid)) * 100
    )
  }));

  // =========================
  // 📊 KEY METRICS
  // =========================

  const totalInterest =
    loan.interestDuringRepayment + moratoriumInterest;

  const principal = input.totalLoan;

  const interestRatio = totalInterest / principal;

  // When principal overtakes interest
  let breakEvenMonth = null;

  for (let row of schedule) {
    if (row.principal > row.interest) {
      breakEvenMonth = row.month;
      break;
    }
  }

  // =========================
  // 🧠 FINAL OUTPUT
  // =========================

  return {
    timeline,

    yearlyBreakdown,

    summary: {
      totalInterest: Math.round(totalInterest),
      interestRatio: Number(interestRatio.toFixed(2)),
      peakInterestMonth,
      breakEvenMonth,
      loanStartPrincipal: Math.round(effectivePrincipal)
    }
  };
}
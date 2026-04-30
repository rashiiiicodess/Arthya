export function calculateLoan({
  principal = 1000000,
  annualRate = 9.5,
  tenureMonths = 120,
  moratoriumMonths = 30,
  csisEligible = false,
  disbursements = [],
  processingFeePercent = 0,
}) {
  let monthlyRate = annualRate / 12 / 100;
  let currentBalance = principal;
  let totalInterestAccrued = 0;           // All interest (moratorium + repayment)
  let schedule = [];

  // === Processing Fee ===
  const rawFee = (principal * processingFeePercent) / 100;
  const processingFee = Math.round(rawFee * 1.18); // GST
  const netDisbursed = principal - processingFee;

  // === MORATORIUM PERIOD ===
  for (let month = 1; month <= moratoriumMonths; month++) {
    const interestThisMonth = currentBalance * monthlyRate;

    if (csisEligible) {
      // Government pays → interest not added to principal
      totalInterestAccrued += interestThisMonth;
    } else {
      // No subsidy → interest capitalized
      currentBalance += interestThisMonth;
      totalInterestAccrued += interestThisMonth;
    }

    schedule.push({
      month,
      emi: 0,
      interest: Math.round(interestThisMonth),
      principal: 0,
      balance: Math.round(currentBalance),
      note: csisEligible ? "CSIS Subsidy" : "Interest Capitalized"
    });
  }

  // === REPAYMENT PERIOD ===
  const remainingMonths = tenureMonths;
  let emi = monthlyRate === 0
    ? currentBalance / remainingMonths
    : (currentBalance * monthlyRate * Math.pow(1 + monthlyRate, remainingMonths)) /
      (Math.pow(1 + monthlyRate, remainingMonths) - 1);

  emi = Math.round(emi);

  let interestDuringRepayment = 0;   // ← This was missing / causing the error

  for (let month = moratoriumMonths + 1; month <= moratoriumMonths + remainingMonths; month++) {
    const interest = currentBalance * monthlyRate;
    let principalPaid = emi - interest;

    if (currentBalance < emi) {
      principalPaid = currentBalance;
      emi = currentBalance + interest;
    }

    currentBalance -= principalPaid;
    interestDuringRepayment += interest;
    totalInterestAccrued += interest;

    schedule.push({
      month,
      emi: Math.round(emi),
      interest: Math.round(interest),
      principal: Math.round(principalPaid),
      balance: Math.max(0, Math.round(currentBalance)),
    });

    if (currentBalance <= 0) break;
  }

  const totalRepayment = schedule.reduce((sum, entry) => sum + (entry.emi || 0), 0);

  return {
    emi: Math.round(emi),
    netDisbursed: Math.round(netDisbursed),
    processingFee: Math.round(processingFee),
    totalRepayment: Math.round(totalRepayment),
    interestDuringRepayment: Math.round(interestDuringRepayment),
    moratoriumInterest: csisEligible ? 0 : Math.round(totalInterestAccrued - interestDuringRepayment),
    effectivePrincipal: Math.round(principal + (csisEligible ? 0 : (totalInterestAccrued - interestDuringRepayment))),
    schedule
  };
}
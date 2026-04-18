export function calculateLoan({
  principal,
  annualRate,
  tenureMonths,
  emiStartAfterMonths = 0,
  prepayments = [],
  rateChanges = [],
  processingFeePercent = 0
}) {
  let monthlyRate = annualRate / 12 / 100;

  const processingFee = (principal * processingFeePercent) / 100;
  const netDisbursed = principal - processingFee;

  let emi =
    monthlyRate === 0
      ? principal / tenureMonths
      : (principal *
          monthlyRate *
          Math.pow(1 + monthlyRate, tenureMonths)) /
        (Math.pow(1 + monthlyRate, tenureMonths) - 1);

  emi = Math.round(emi);

  let schedule = [];
  let totalInterest = 0;
  let currentBalance = principal;
  let currentRate = monthlyRate;

  for (let month = 1; month <= tenureMonths + emiStartAfterMonths; month++) {
    // --- RATE CHANGE ---
    const rateChange = rateChanges.find(r => r.month === month);
    if (rateChange) {
      currentRate = rateChange.newRate / 12 / 100;

      const remainingMonths =
        tenureMonths - Math.max(0, month - emiStartAfterMonths);

      if (remainingMonths > 0) {
        emi =
          (currentBalance *
            currentRate *
            Math.pow(1 + currentRate, remainingMonths)) /
          (Math.pow(1 + currentRate, remainingMonths) - 1);

        emi = Math.round(emi);
      }
    }

    // --- EMI NOT STARTED ---
    if (month <= emiStartAfterMonths) {
      const interest = currentBalance * currentRate;

      currentBalance += interest;
      totalInterest += interest;

      schedule.push({
        month,
        emi: 0,
        interest: Math.round(interest),
        principal: 0,
        balance: Math.round(currentBalance),
        note: "EMI not started"
      });

      continue;
    }

    // --- EMI ---
    const interest = currentBalance * currentRate;
    let principalPaid = emi - interest;

    if (currentBalance < emi) {
      principalPaid = currentBalance;
      emi = currentBalance + interest;
    }

    currentBalance -= principalPaid;

    // --- PREPAYMENT ---
    const prepay = prepayments.find(p => p.month === month);
    if (prepay) {
      currentBalance -= prepay.amount;
    }

    totalInterest += interest;

    schedule.push({
      month,
      emi: Math.round(emi),
      interest: Math.round(interest),
      principal: Math.round(principalPaid),
      balance: Math.max(0, Math.round(currentBalance)),
      prepayment: prepay ? prepay.amount : 0
    });

    if (currentBalance <= 0) break;
  }

  return {
    emi,
    netDisbursed: Math.round(netDisbursed),
    processingFee: Math.round(processingFee),
    totalRepayment: schedule.reduce((s, m) => s + m.emi, 0),
    interestDuringRepayment: Math.round(totalInterest), // ✅ FIXED NAME
    schedule
  };
}
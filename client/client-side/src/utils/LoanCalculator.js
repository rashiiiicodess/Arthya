/**
 * ARTHYA CORE LOAN UTILITIES
 * =========================
 * - formatCurrency: Indian Rupee formatting (en-IN)
 * - calculateLoan: Complex EMI engine with GST, Prepayments, and Rate Changes
 */

export function formatCurrency(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "₹0";
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateLoan({
  principal,
  annualRate,
  tenureMonths,
  emiStartAfterMonths = 0,
  prepayments = [],
  rateChanges = [],
  processingFeePercent = 0,
  maxFeeCap = 0
}) {
  let monthlyRate = annualRate / 12 / 100;
  const GST_RATE = 1.18; // 18% GST

  // Calculate fee based on %
  let rawFee = (principal * processingFeePercent) / 100;

  // Apply the Bank's Maximum Cap (if defined)
  if (maxFeeCap > 0 && rawFee > maxFeeCap) {
    rawFee = maxFeeCap;
  }

  // Calculate final fee including GST
  const processingFee = Math.round(rawFee * GST_RATE);
  
  // What the student actually receives
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
      const remainingMonths = tenureMonths - Math.max(0, month - emiStartAfterMonths);

      if (remainingMonths > 0) {
        emi = (currentBalance * currentRate * Math.pow(1 + currentRate, remainingMonths)) /
              (Math.pow(1 + currentRate, remainingMonths) - 1);
        emi = Math.round(emi);
      }
    }

    // --- MORATORIUM PHASE (EMI NOT STARTED) ---
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
        note: "Moratorium Period"
      });
      continue;
    }

    // --- REPAYMENT PHASE (EMI) ---
    const interest = currentBalance * currentRate;
    let principalPaid = emi - interest;

    if (currentBalance < principalPaid) {
      principalPaid = currentBalance;
      emi = currentBalance + interest;
    }

    currentBalance -= principalPaid;

    // --- PREPAYMENT LOGIC ---
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
    totalRepayment: Math.round(schedule.reduce((s, m) => s + m.emi, 0)),
    interestDuringRepayment: Math.round(totalInterest),
    schedule
  };
}
// utils/disburmentCalculator.js   ← Note: filename has typo "disburment"

export function calculateDisbursement({
  totalLoan,
  annualRate,
  disbursements,
  moratoriumMonths = 30,
  moratoriumType = "simple",
  csisEligible = false
}) {
  const monthlyRate = annualRate / 12 / 100;

  let totalInterest = 0;
  const breakdown = [];

  for (let i = 0; i < disbursements.length; i++) {
    const { amount, startMonth = 0 } = disbursements[i];   // Fixed: use startMonth safely

    // How many months does this tranche accrue interest during moratorium?
    const accrualMonths = Math.max(0, moratoriumMonths - startMonth);

    let interest = 0;
    let finalAmount = amount;

    if (!csisEligible && accrualMonths > 0) {
      if (moratoriumType === "simple" || moratoriumType === "interestOnly") {
        // Simple interest during moratorium
        interest = amount * monthlyRate * accrualMonths;
        finalAmount = amount + interest;
      } else {
        // Compound interest (most common for NBFCs like HDFC Credila)
        finalAmount = amount * Math.pow(1 + monthlyRate, accrualMonths);
        interest = finalAmount - amount;
      }
    }

    breakdown.push({
      tranche: i + 1,
      amount: Math.round(amount),
      startMonth,
      accrualMonths,
      interest: Math.round(interest),
      finalAmount: Math.round(finalAmount),
      interestPercent: amount > 0 ? Math.round((interest / amount) * 100) : 0
    });

    totalInterest += interest;
  }

  const effectivePrincipal = csisEligible 
    ? totalLoan 
    : totalLoan + totalInterest;

  const mostExpensive = breakdown.length > 0 
    ? breakdown.reduce((a, b) => (b.interest > a.interest ? b : a)) 
    : null;

  return {
    breakdown,
    moratoriumInterest: Math.round(totalInterest),        // ← This is the key fix
    effectivePrincipal: Math.round(effectivePrincipal),
    mostExpensive
  };
}
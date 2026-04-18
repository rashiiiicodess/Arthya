export function generateOverview({
  loan,
  disbursement,
  salary,
  input
}) {
  const emi = loan.emi;
  const totalRepayment = loan.totalRepayment;

  const totalInterest =
    loan.interestDuringRepayment +
    disbursement.moratoriumInterest;

  const principal = input.totalLoan;

  const interestMultiplier = totalRepayment / principal;

  const monthlyShortfall = salary - emi;
  const emiToIncomeRatio = emi / salary;

  const years = Math.ceil(loan.schedule.length / 12);
  const loanFreeYear = new Date().getFullYear() + years;

  let score = 100;

  if (emiToIncomeRatio > 1) score -= 70;
  else if (emiToIncomeRatio > 0.7) score -= 40;
  else if (emiToIncomeRatio > 0.5) score -= 20;

  if (interestMultiplier > 1.8) score -= 15;
  else if (interestMultiplier > 1.5) score -= 10;

  score = Math.max(0, Math.round(score));

  let verdict = "MANAGEABLE";
  if (monthlyShortfall < 0) verdict = "UNSUSTAINABLE";
  else if (emiToIncomeRatio > 0.7) verdict = "HIGH RISK";

  return {
    emi,
    totalRepayment: Math.round(totalRepayment),
    totalInterest: Math.round(totalInterest),
    interestMultiplier: Number(interestMultiplier.toFixed(2)),
    monthlyShortfall: Math.round(monthlyShortfall),
    affordabilityScore: score,
    years,
    loanFreeYear,
    verdict
  };
}
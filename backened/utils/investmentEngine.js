// utils/investmentEngine.js

export function generateInvestmentGuidance({ overview, salary }) {
  const { emi, monthlyShortfall } = overview;
  const disposableIncome = monthlyShortfall; // What's left after EMI
  const emiToSalaryRatio = emi / salary;

  // Thresholds for Indian middle-class reality
  const isUnsustainable = disposableIncome < 0;
  const isHighRisk = emiToSalaryRatio > 0.50; // EMI is more than half of salary

  if (isUnsustainable || isHighRisk) {
    return {
      status: "NOT_RECOMMENDED",
      title: "Investment Not Recommended",
      headline: "Focus on Managing Your EMI Burden First",
      reason: `Your EMI (₹${emi.toLocaleString()}) takes up too much of your salary. You have ₹${disposableIncome.toLocaleString()} left for survival.`,
      priorityAction: "Prioritize Loan Repayment & Emergency Fund",
      detailedAdvice: "Before aggressive investing, ensure your EMI payments are always on time. A good credit history and a manageable loan burden are your most valuable financial assets right now.",
      safetyBufferRequired: Math.round(emi * 6) // Suggest 6 months of EMI as buffer
    };
  }

  // If they HAVE money left, suggest a standard split
  return {
    status: "RECOMMENDED",
    title: "Ready to Invest",
    headline: "Small SIPS, Big Impact",
    reason: `You have ₹${disposableIncome.toLocaleString()} remaining. Even ₹2,000 in an Index Fund helps.`,
    priorityAction: "Start a monthly SIP",
    detailedAdvice: "Since your EMI is manageable, consider a 70/30 split between Loan Prepayment and Mutual Funds.",
    safetyBufferRequired: 0
  };
}
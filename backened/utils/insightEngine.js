// utils/insightEngine.js
export function generateInsights({ overview, loan, disbursement, input }) {
  // Initialize with empty arrays so the frontend always has a structure to map over
  const insights = {
    critical: [],
    warnings: [],
    suggestions: [],
    ai: [] 
  };

  // Safety check: if overview is missing, return empty structure early
  if (!overview) return insights;

  const { emi, monthlyShortfall, interestMultiplier } = overview;
  const totalRepayment = loan.totalRepayment;
  const totalInterest = loan.interestDuringRepayment + disbursement.moratoriumInterest;
  const salary = input.salary;
  const principal = input.totalLoan;

  // 🚨 CRITICAL: EMI exceeds Salary
  if (monthlyShortfall < 0) {
    insights.critical.push({
      title: "Financially Unsustainable",
      why: `EMI ₹${emi.toLocaleString()} exceeds salary ₹${salary.toLocaleString()}`,
      impact: `Monthly deficit ₹${Math.abs(monthlyShortfall).toLocaleString()}`,
      action: "Reduce loan or increase income",
      severity: "high"
    });
  }

  // ⚠️ WARNING: High EMI Ratio (moved to 40% for better sensitivity)
  const emiRatio = emi / salary;
  if (emiRatio > 0.4) {
    insights.warnings.push({
      title: "High EMI Burden",
      why: `${Math.round(emiRatio * 100)}% of income`,
      impact: "Very low savings buffer for emergencies",
      action: "Extend tenure or provide more margin money",
      severity: "medium"
    });
  }

  // ⚠️ WARNING: High Multiplier
  if (interestMultiplier > 1.7) {
    insights.warnings.push({
      title: "High Total Cost",
      why: `You pay ₹${interestMultiplier} for every ₹1 borrowed`,
      impact: "Total repayment is significantly higher than principal",
      action: "Plan aggressive prepayments after graduation",
      severity: "medium"
    });
  }

  // 💡 SUGGESTIONS
  insights.suggestions.push({
    title: "Prepay Early",
    why: "Interest is front-loaded in the schedule",
    impact: "Reduces total interest by lakhs",
    action: "Use joining bonuses for one-time prepayments",
    severity: "low"
  });

  return insights; // Ensure this is always returned
}
import { generateAIInsights } from "../services/aiInsightEngine.js";

export async function generateInsights({
  overview,
  loan,
  disbursement,
  input
}) {
  const insights = {
    critical: [],
    warnings: [],
    suggestions: [],
    ai: [] // 🔥 NEW
  };

  const {
    emi,
    monthlyShortfall,
    interestMultiplier
  } = overview;

  const totalRepayment = loan.totalRepayment;

  const totalInterest =
    loan.interestDuringRepayment +
    disbursement.moratoriumInterest;

  const salary = input.salary;
  const principal = input.totalLoan;

  // =========================
  // 🚨 CRITICAL
  // =========================

  if (monthlyShortfall < 0) {
    insights.critical.push({
      title: "Financially Unsustainable",
      why: `EMI ₹${emi.toLocaleString()} exceeds salary ₹${salary.toLocaleString()}`,
      impact: `Monthly deficit ₹${Math.abs(monthlyShortfall).toLocaleString()}`,
      action: "Reduce loan or increase income",
      severity: "high"
    });
  }

  // =========================
  // ⚠️ WARNINGS
  // =========================

  const emiRatio = emi / salary;

  if (emiRatio > 0.5) {
    insights.warnings.push({
      title: "High EMI Burden",
      why: `${Math.round(emiRatio * 100)}% of income`,
      impact: "Low savings buffer",
      action: "Extend tenure or reduce loan",
      severity: "medium"
    });
  }

  if (interestMultiplier > 1.7) {
    insights.warnings.push({
      title: "High Total Cost",
      why: `₹${totalRepayment.toLocaleString()} on ₹${principal.toLocaleString()}`,
      impact: "Majority paid as interest",
      action: "Consider prepayment",
      severity: "medium"
    });
  }

  if (totalInterest > principal * 0.25) {
    insights.warnings.push({
      title: "Heavy Interest Accumulation",
      why: "Moratorium + repayment interest",
      impact: `Loan grows significantly before payoff`,
      action: "Pay early interest if possible",
      severity: "high"
    });
  }

  // =========================
  // 💡 SUGGESTIONS
  // =========================

  insights.suggestions.push({
    title: "Prepay Early",
    why: "Interest is front-loaded",
    impact: "Reduces long-term cost",
    action: "Use bonuses for prepayment",
    severity: "low"
  });

  if (!input.csisEligible) {
    insights.suggestions.push({
      title: "Check CSIS Subsidy",
      why: "Govt covers moratorium interest",
      impact: "Can save lakhs",
      action: "Apply if eligible",
      severity: "low"
    });
  }

  // =========================
  // 🤖 AI INSIGHTS (NEW)
  // =========================

  /**const aiInsights = await generateAIInsights({
    overview,
    loan,
    disbursement,
    input
  });

  insights.ai = aiInsights;**/

  return insights;
}
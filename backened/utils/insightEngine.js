// utils/insightEngine.js
export function generateInsights({ overview, loan, disbursement, input }) {
  const insights = {
    critical: [],
    warnings: [],
    suggestions: [],
    ai: [] 
  };

  if (!overview) return insights;

  const { emi, monthlyShortfall, interestMultiplier, totalInterest } = overview;
  const principal = input.totalLoan;
  const salary = input.salary;

  // 1. 🚨 CRITICAL: UNSUSTAINABILITY
  if (monthlyShortfall < 0) {
    insights.critical.push({
      title: "Immediate Financial Crisis",
      why: `Monthly EMI (₹${emi.toLocaleString()}) exceeds your co-applicant's income (₹${salary.toLocaleString()}).`,
      impact: "You cannot afford this loan as-is. Defaulting will ruin your family's credit and risk your collateral.",
      action: "Do NOT proceed. Reduce the loan amount or extend tenure to 12-15 years immediately.",
      severity: "high"
    });
  }

  // 2. 🛡️ THE TAX 80E SHIELD (High Accuracy Move)
  // Logic: In India, interest is 100% deductible for 8 years.
  if (totalInterest > 50000) {
    insights.suggestions.push({
      title: "Tax 80E Wealth Shield",
      why: "The Indian Government allows you to deduct 100% of education loan interest from taxable income.",
      impact: "This effectively 'refunds' up to 30% of your interest cost if you or your co-applicant are in a high tax bracket.",
      action: "File ITR under Section 80E every year for the first 8 years of repayment to get your money back.",
      severity: "low"
    });
  }

  // 3. ⚠️ THE INSURANCE HIDDEN COST (Bank-Statement Accuracy)
  // Logic: Banks usually bundle MLOP (Mortgage Linked Online Policy) at ~1.5% of principal
  const estimatedInsurance = Math.round(principal * 0.015);
  insights.warnings.push({
    title: "Hidden Insurance Premium",
    why: "Banks mandate 'Loan Protector' insurance to cover the debt in case of tragedy.",
    impact: `This could add ~₹${estimatedInsurance.toLocaleString()} to your principal on Day 1. You will pay interest on this too!`,
    action: "Ask the bank for the 'Sanction Letter' WITHOUT insurance and compare with a separate Term Plan.",
    severity: "medium"
  });

  // 4. 📈 THE FLOATING RATE VOLATILITY
  // Logic: Almost all Indian Edu Loans are floating.
  insights.warnings.push({
    title: "Floating Rate Volatility",
    why: "This loan is linked to RBI's Repo Rate (External Benchmark).",
    impact: "If the RBI raises rates by 1%, your monthly EMI could jump by ₹1,500 - ₹2,500 overnight.",
    action: "Always keep a 10% 'Rate Hike Buffer' in your monthly budget.",
    severity: "medium"
  });

  // 5. 💸 THE MULTIPLIER TRAP
  if (interestMultiplier > 1.6) {
    insights.warnings.push({
      title: "The Multiplier Trap",
      why: `You are paying ₹${interestMultiplier} for every ₹1 borrowed.`,
      impact: "Total interest is eating into your future wealth (house downpayments/marriage funds).",
      action: "Plan aggressive prepayments in the first 3 years to 'kill' the principal early.",
      severity: "medium"
    });
  }

  return insights;
}
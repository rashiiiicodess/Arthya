import { generateOverview } from "../utils/overviewEngine.js";
import { generateBreakdown } from "../utils/breakdownEngine.js";
import { generateInsights } from "../utils/insightEngine.js";
import { calculateLoan } from "../utils/loanCalculator.js";
import { calculateDisbursement } from "../utils/disburmentCalculator.js";
import { generateAIExplanation } from "./aiExplainEngine.js";
import { generateAIInsights } from "./aiInsightEngine.js";

/**
 * Analyzes a loan configuration by calculating math, 
 * generating hardcoded logic insights, and fetching AI analysis.
 */
export async function analyzeLoan(input,bankData = null, includeAI = true) {
  const {
    totalLoan,
    annualRate,
    tenMonths, // Ensure this matches your input schema (usually tenureMonths)
    tenureMonths,
    moratoriumMonths,
    moratoriumType,
    disbursements,
    salary,
    ...rest
  } = input;

  // 1. Math Engines: Calculate core numbers
  const disbursementResult = calculateDisbursement({
    totalLoan,
    annualRate,
    disbursements,
    moratoriumMonths,
    moratoriumType,
    csisEligible: rest.csisEligible
  });

  const loanResult = calculateLoan({
    principal: disbursementResult.effectivePrincipal,
    annualRate,
    tenureMonths: tenureMonths || tenMonths,
    ...rest
  });

  // 2. Summary Engines: Organize totals and timelines
  const overview = generateOverview({
    loan: loanResult,
    disbursement: disbursementResult,
    salary,
    input
  });

  const breakdown = generateBreakdown({
    loan: loanResult,
    disbursement: disbursementResult,
    input
  });

  // 3. Local Insight Engine: Triggers hardcoded financial warnings
  const hardInsights = generateInsights({
    overview,
    loan: loanResult,
    disbursement: disbursementResult,
    input
  }) || { critical: [], warnings: [], suggestions: [], ai: [] };

  // Debug Logs
  console.log("--- INSIGHT DEBUG ---");
  console.log("Verdict:", overview.verdict);
  console.log("Interest Multiplier:", overview.interestMultiplier);
  console.log("Critical Count:", hardInsights.critical?.length || 0);
  console.log("Warning Count:", hardInsights.warnings?.length || 0);
  console.log("----------------------");

  // 4. AI Preparation: Prepare a "Slim Context"
  const aiContext = {
    overview,
    input,
   bankMeta: bankData ? {
      bankName: bankData.name,
      interestType: bankData.interest?.type || "floating",
      collateralRequired: (bankData.collateral?.required_above || 0) < totalLoan,
      processingTime: bankData.processing?.time_days || "Unknown",
      prepaymentPenalty: bankData.benefits?.flexible_repayment ? "No" : "Yes"
    } : null,
    disbursement: { moratoriumInterest: disbursementResult.moratoriumInterest },
    loan: { totalRepayment: loanResult.totalRepayment },
    insights: hardInsights
  };

  let aiInsightsResult = [];
  let aiExplanationResult = "AI Advisor is analyzing your data...";

  // 5. AI Engines: Fetch narrative and pro-tips
  // NOTE: includeAI is used to prevent rate-limiting when looping through multiple banks
  if (includeAI && process.env.GEMINI_API_KEY) {
    try {
      const [insightsRes, explainRes] = await Promise.all([
        generateAIInsights(aiContext),
        generateAIExplanation(aiContext)
      ]);
      aiInsightsResult = insightsRes;
      aiExplanationResult = explainRes;
    } catch (aiErr) {
      if (aiErr.message.includes("429") || aiErr.message.includes("quota")) {
        console.log("⚠️ Gemini Rate Limit - Falling back to local logic.");
      } else if (aiErr.message.includes("404")) {
        console.log("⚠️ Gemini Model ID Mismatch - Check apiVersion settings.");
      } else {
        console.error("AI Error:", aiErr.message);
      }
      aiExplanationResult = `Advisor Note: This ${overview.interestMultiplier}x loan is ${overview.verdict}. The ₹${disbursementResult.moratoriumInterest.toLocaleString()} moratorium cost is high; consider early interest payments.`;
    }
  } else {
    aiExplanationResult = "AI Analysis skipped for this comparison tier.";
  }

  // 6. Final Combined Output
  return {
    disbursement: disbursementResult,
    loan: loanResult,
    overview,
    breakdown,
    insights: {
      critical: hardInsights.critical || [],
      warnings: hardInsights.warnings || [],
      suggestions: hardInsights.suggestions || [],
      ai: aiInsightsResult || []
    },
    aiExplanation: aiExplanationResult
  };
}
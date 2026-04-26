import { generateOverview } from "../utils/overviewEngine.js";
import { generateBreakdown } from "../utils/breakdownEngine.js";
import { generateInsights } from "../utils/insightEngine.js";
import { calculateLoan } from "../utils/loanCalculator.js";
import { calculateDisbursement } from "../utils/disburmentCalculator.js";
import { generateAIExplanation } from "./aiExplainEngine.js";
import { generateAIInsights } from "./aiInsightEngine.js";
import { generateInvestmentGuidance } from "../utils/investmentEngine.js";

/**
 * Analyzes a loan configuration by calculating math, 
 * generating hardcoded logic insights, and fetching AI analysis.
 */
export async function analyzeLoan(input, bankData = null, includeAI = true) {
  const {
    totalLoan,
    annualRate,
    tenMonths, 
    tenureMonths,
    moratoriumMonths,
    moratoriumType,
    disbursements,
    salary,
    ...rest
  } = input;

  // --- STEP 1: CORE MATH ENGINES ---
  // Calculate principal growth during the study period
  const disbursementResult = calculateDisbursement({
    totalLoan,
    annualRate,
    disbursements,
    moratoriumMonths,
    moratoriumType,
    csisEligible: rest.csisEligible
  });

  // Calculate the monthly EMI and repayment schedule
  const loanResult = calculateLoan({
    principal: disbursementResult.effectivePrincipal,
    annualRate,
    tenureMonths: tenureMonths || tenMonths,
    ...rest
  });

  // --- STEP 2: SUMMARY ENGINES (DEPENDS ON MATH) ---
  // Generate the overview first so other engines can use its values
  const overview = generateOverview({
    loan: loanResult,
    disbursement: disbursementResult,
    salary,
    input
  });

  // --- STEP 3: LOGIC ENGINES (DEPENDS ON OVERVIEW) ---
  // Now it is safe to generate guidance and insights
  const investmentGuidance = generateInvestmentGuidance({ 
    overview, 
    salary: input.salary 
  });

  const breakdown = generateBreakdown({
    loan: loanResult,
    disbursement: disbursementResult,
    input
  });

  const hardInsights = generateInsights({
    overview,
    loan: loanResult,
    disbursement: disbursementResult,
    input
  }) || { critical: [], warnings: [], suggestions: [], ai: [] };

  // --- STEP 4: DEBUG LOGGING ---
  console.log("--- ANALYSIS DEBUG ---");
  console.log(`Bank: ${bankData?.name || "Generic"}`);
  console.log(`Verdict: ${overview.verdict}`);
  console.log(`Multiplier: ${overview.interestMultiplier}x`);
  console.log("-----------------------");

  // --- STEP 5: AI PREPARATION ---
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

  // --- STEP 6: AI ENGINES (CONDITIONAL) ---
  if (includeAI && process.env.GEMINI_API_KEY) {
    try {
      const [insightsRes, explainRes] = await Promise.all([
        generateAIInsights(aiContext),
        generateAIExplanation(aiContext)
      ]);
      aiInsightsResult = insightsRes;
      aiExplanationResult = explainRes;
    } catch (aiErr) {
      console.warn("⚠️ AI Engine Error:", aiErr.message);
      // Fallback message so UI doesn't break
      aiExplanationResult = `Advisor Note: This ${overview.interestMultiplier}x loan is ${overview.verdict}. You will pay ₹${disbursementResult.moratoriumInterest.toLocaleString()} just in moratorium interest.`;
    }
  } else {
    aiExplanationResult = "Detailed AI Analysis skipped for this view.";
  }

  // --- STEP 7: FINAL STRUCTURED OUTPUT ---
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
    aiExplanation: aiExplanationResult,
    investmentGuidance
  };
}
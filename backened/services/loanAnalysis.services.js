import { generateOverview } from "../utils/overviewEngine.js";
import { generateBreakdown } from "../utils/breakdownEngine.js";
import { generateInsights } from "../utils/insightEngine.js";
import { calculateLoan } from "../utils/loanCalculator.js";
import { calculateDisbursement } from "../utils/disburmentCalculator.js";
import { generateAIExplanation } from "./aiExplainEngine.js";

export async function analyzeLoan(input) {
  const {
    totalLoan,
    annualRate,
    tenureMonths,
    moratoriumMonths,
    moratoriumType,
    disbursements,
    salary,
    ...rest
  } = input;

  // --- DISBURSEMENT ---
  const disbursementResult = calculateDisbursement({
    totalLoan,
    annualRate,
    disbursements,
    moratoriumMonths,
    moratoriumType,
    csisEligible: rest.csisEligible
  });

  // --- LOAN ---
  const loanResult = calculateLoan({
    principal: disbursementResult.effectivePrincipal,
    annualRate,
    tenureMonths,
    ...rest
  });

  // --- OVERVIEW ---
  const overview = generateOverview({
    loan: loanResult,
    disbursement: disbursementResult,
    salary,
    input
  });

  // --- BREAKDOWN ---
  const breakdown = generateBreakdown({
    loan: loanResult,
    disbursement: disbursementResult,
    input
  });
  

  // ✅ FIX: define insights FIRST
  const insights = await generateInsights({
    overview,
    loan: loanResult,
    disbursement: disbursementResult,
    input
  });

  // --- AI ---
  /** const ai = await generateAIExplanation({
    overview,
    breakdown,
    loan:loanResult,
    insights,
     disbursement: disbursementResult,
    input
  }); */

  return {
    disbursement: disbursementResult,
    loan: loanResult,
    overview,
    breakdown,
    insights // ✅ include this (IMPORTANT)
    
  };
}
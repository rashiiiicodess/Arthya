import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel(
  { model: "gemini-3-flash-preview" }
  //{ apiVersion: "v1" }
);

export async function generateAIExplanation({ overview, insights, disbursement, input }) {
  try {
    if (!process.env.GEMINI_API_KEY) return "Advisor offline: Missing API Key.";

    // 1. Pre-calculate the burden percentage strictly before the prompt
    // This ensures emiBurden is defined for the template literal
    const emiValue = overview.emi || 0;
    const salaryValue = input.salary || 1; // Prevent division by zero
    const emiBurden = Math.round((emiValue / salaryValue) * 100);

    // 2. Build the prompt using the calculated value
   // Add this to your variable definitions at the top of generateAIExplanation
    const savingsAmount = input.maxRepayment ? input.maxRepayment - overview.totalRepayment : 0;
    const alternativesText = input.alternatives || "other banks";

    const prompt = `
      You are Arthya AI, a brutally honest Indian financial advisor. 
      Your goal is to deconstruct an education loan for a student, focusing on the cold, hard math provided.

      --- DATA POINTS (USE THESE ONLY) ---
      Monthly Salary: ₹${input.salary}
      Monthly EMI: ₹${overview.emi}
      Loan Principal: ₹${input.totalLoan}
      Total Repayment: ₹${overview.totalRepayment}
      Total Interest: ₹${overview.totalInterest}
      Interest Multiplier: ${overview.interestMultiplier}x
      Loan Tenure: ${overview.years} years
      Moratorium Interest Added: ₹${disbursement.moratoriumInterest}
      Estimated Savings vs Worst Option: ₹${savingsAmount}

      --- MANDATORY CONSTRAINTS ---
      1. FACTUAL ACCURACY: Do NOT invent or exaggerate the tenure or interest rate. If the data says ${overview.years} years, use exactly that. 
      2. CURRENCY: Always use the ₹ symbol for amounts.
      3. TONE: Human, slightly harsh, but helpful. No corporate jargon.

      --- RESPONSE STRUCTURE ---
      1. IS THIS SAFE OR A DEBT TRAP?: Analyze the EMI-to-Salary ratio. (Spending ${emiBurden}% of income).
      2. THE "HIDDEN COST": Explain what the ${overview.interestMultiplier}x multiplier really means for their future. Focus on the ₹${overview.totalInterest} they are paying just for the "privilege" of borrowing.
      3. SURVIVAL AFTER EMI: Calculate what is left (₹${overview.monthlyShortfall}) and describe the lifestyle reality in an Indian city with that amount.
      
      --- NEW: COMPARISON STRATEGY (ADD THESE SECTIONS) ---
      4. WHY THIS IS THE BEST CHOICE: Explicitly state why this bank won. Mention that it saves the user ₹${savingsAmount.toLocaleString()} compared to the most expensive options like ${alternativesText}.
      5. CONSIDER AVOIDING: Briefly mention that banks like ${alternativesText} are significantly more expensive and should be avoided unless this bank rejects them.
      
      --- WRAP UP ---
      6. FINAL VERDICT: A one-line, cold-truth summary.

      Keep the response concise and scannable using Markdown headings.
    `;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();

  } catch (error) {
    console.error("Gemini Explanation Error:", error.message);
    // Dynamic fallback that doesn't rely on emiBurden if it fails
    return `Advisor Note: This ${overview.interestMultiplier}x loan is ${overview.verdict}. You'll pay ₹${overview.totalInterest.toLocaleString()} in interest over ${overview.years} years. Don't just pay the minimum!`;
  }
}
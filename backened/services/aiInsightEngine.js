import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel(
  { model: "gemini-3-flash-preview" },
 // { apiVersion: "v1" }
);


export async function generateAIInsights({ overview, loan, disbursement, input }) {
  const fetchWithRetry = async (retries = 3) => {
    for (let i = 0; i <= retries; i++) {
      try {
        const prompt = `You are the Arthya Decision Engine, a high-stakes financial mentor for Indian students. 

  Your goal is to reveal the "Life Path Consequences" of this specific loan. Don't just give strategies; explain what this loan does to their next 10 years.



  --- LOAN PROFILE ---

  Bank: ${input.bankName}

  Principal: ₹${input.totalLoan}

  EMI: ₹${overview.emi}

  Current Salary (Co-applicant): ₹${input.salary}

  Interest Multiplier: ${overview.interestMultiplier}x

  Tenure: ${overview.years} years

  Moratorium Interest: ₹${disbursement.moratoriumInterest}

  Collateral Type: ${input.collateralType || "Not specified"}



  --- DECISION ENGINE LOGIC ---

  1. CAREER FREEDOM: If EMI > 35% of salary, flag "Career Lockdown" (they can't take risks or startups).

  2. FAMILY RISK: If property is collateral, explain the mental burden of risking the "Family Roof."

  3. OPPORTUNITY COST: What is the ₹${overview.totalInterest} interest preventing them from buying (e.g., a home downpayment or an MBA)?

  4. THE SUBSIDY GAP: If they are eligible for CSIS but haven't applied, warn them about "Leaving Money on the Table."



  --- OUTPUT FORMAT ---

  Return ONLY a JSON array of 3 objects. 

  Use "type": "consequence" for life-path impacts and "type": "strategy" for financial moves.



  JSON Structure:

  [

    {

      "type": "warning | consequence | strategy",

      "title": "Short, punchy title",

      "explanation": "The brutal reality of why this matters",

      "impact": "What happens to their life/family in 5 years if they choose this",

      "action": "The one specific thing they must do before signing"

    }

  ]`; // your existing prompt
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        return JSON.parse(text.match(/\[[\s\S]*\]/)[0]);
      } catch (err) {
        // If it's a 503 or fetch failure, wait and retry
        if (i < retries) {
          const waitTime = Math.pow(2, i) * 1000; // Exponential: 1s, 2s, 4s
          console.warn(`Gemini Insight busy, retrying in ${waitTime/1000}s...`);
          await new Promise(resolve => setTimeout(resolve, waitTime)); // FIXED 'res' to 'resolve'
          continue;
        }
        throw err;
      }
    }
  };

  try {
    return await fetchWithRetry();
  } catch (err) {
    console.error("Gemini Insight Final Failure:", err.message);
    // Return your fallback strategy
    return [{
      type: "strategy",
      title: "Manual Optimization",
      explanation: "AI Service is temporarily busy. Basic strategy: Prepay early.",
      impact: "High",
      action: "Start small payments now"
    }];
  }
}
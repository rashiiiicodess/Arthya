import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function generateAIExplanation({
  overview,
  insights,
  loan,
  disbursement,
  input
}) {
  try {
    const prompt = `
You are a brutally honest financial advisor.

Explain this education loan in a clear, human, slightly harsh but helpful tone.

USER PROFILE:
- Salary: ₹${input.salary}
- Loan: ₹${input.totalLoan}
- Interest Rate: ${input.annualRate}%
- Tenure: ${input.tenureMonths} months

LOAN SUMMARY:
- EMI: ₹${overview.emi}
- Total Repayment: ₹${overview.totalRepayment}
- Interest Multiplier: ${overview.interestMultiplier}x
- Verdict: ${overview.verdict}

RISK:
- Monthly Surplus/Deficit: ₹${overview.monthlyShortfall}
- Affordability Score: ${overview.affordabilityScore}/100

MORATORIUM IMPACT:
- Interest Added Before EMI: ₹${disbursement.moratoriumInterest}

CRITICAL INSIGHTS:
${(insights?.critical || []).map(i => `- ${i.title}`).join("\n")}

WARNINGS:
${(insights?.warnings || []).map(i => `- ${i.title}`).join("\n")}

SUGGESTIONS:
${(insights?.suggestions || []).map(i => `- ${i.title}`).join("\n")}

---

Now explain:

1. Is this loan safe or dangerous?
2. What will happen month-to-month?
3. Biggest mistake user is making
4. What they should do instead
5. Final verdict (1 line)

Keep it concise but powerful.
`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert Indian financial advisor."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7
    });

    return {
      explanation: response.choices[0].message.content
    };

  } catch (error) {
    console.error("AI Explanation Error:", error.message);

    return {
      explanation: "AI explanation temporarily unavailable."
    };
  }
}
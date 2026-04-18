export async function generateAIInsights({ overview, loan, disbursement, input }) {
  try {
    const prompt = `
      You are a sharp financial advisor analyzing an education loan. 

      USER DATA: 
      - Loan: ₹${input.totalLoan} 
      - Salary: ₹${input.salary} 
      - EMI: ₹${overview.emi} 
      - Total Repayment: ₹${overview.totalRepayment} 
      - Interest Multiplier: ${overview.interestMultiplier} 
      - Verdict: ${overview.verdict} 

      LOAN BEHAVIOR: 
      - Total Interest: ₹${loan.interestDuringRepayment} 
      - Moratorium Interest: ₹${disbursement.moratoriumInterest} 
      - Peak Interest Month: ${overview.peakInterestMonth || "N/A"} 

      INSTRUCTIONS: 
      - Give 3–5 HIGH QUALITY insights 
      - Focus on non-obvious patterns 
      - Avoid generic advice 
      - Be specific with numbers 
      - Use simple language 

      RETURN JSON: 
      [ 
        { 
          "type": "warning | opportunity | strategy", 
          "title": "...", 
          "explanation": "...", 
          "impact": "...", 
          "action": "..." 
        } 
      ]
    `;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a financial expert." },
        { role: "user", content: prompt }
      ],
      temperature: 0.6
    });

    const text = response.choices[0].message.content;

    try {
      return JSON.parse(text);
    } catch {
      return [];
    }
  } catch (err) {
    console.error("AI Insight Error:", err.message);
    return [];
  }
}
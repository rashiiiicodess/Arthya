import Bank from "../models/bankModel.js";
import { analyzeLoan } from "../services/loanAnalysis.services.js";

/**
 * Main analysis controller.
 * 1. Fetches all banks from DB.
 * 2. Runs fast math-only analysis for all banks.
 * 3. Sorts to find the best deal.
 * 4. Triggers AI only for the top recommendation.
 */
// ... existing imports ...

export const analyzeController = async (req, res) => {
  try {
    const input = req.body;

    // 1. Validation
    if (!input.disbursements || !Array.isArray(input.disbursements)) {
      return res.status(400).json({ success: false, error: "Missing disbursements data." });
    }

    // 2. Fetch Banks
    const banks = await Bank.find();
    if (!banks || banks.length === 0) {
      return res.status(404).json({ success: false, error: "No bank data found." });
    }

    // 3. Fast Math Pass (includeAI = false)
    const normalizedInput = {
      ...input,
      disbursements: input.disbursements.map(d => ({
        amount: Number(d.amount || 0),
        startMonth: Number(d.startMonth ?? d.month ?? 0)
      }))
    };

    const results = await Promise.all(
      banks.map(async (bank) => {
        // 🔥 ADDED FIX HERE: processing.fee_percent
        const analysis = await analyzeLoan({
          ...normalizedInput,
          annualRate: bank.interest.effective_mid,
          processingFeePercent: bank.processing?.fee_percent || 0 
        },bank, false);

        return {
          bankName: bank.name,
          bankType: bank.bank_type,
          bankRawInfo: bank,
          ...analysis
        };
      })
    );

    // 4. Data Refinement & Sort
    const processedResults = results.map(r => ({
      ...r,
      loan: { ...r.loan, schedule: r.loan.schedule?.slice(0, 12) || [] }
    }));

    processedResults.sort((a, b) => {
      const totalA = a.overview?.totalRepayment ?? Infinity;
      const totalB = b.overview?.totalRepayment ?? Infinity;
      return totalA - totalB;
    });

    // 5. Trigger AI ONLY for the #1 Recommended Bank
    const bestBank = processedResults[0];
    
    try {
      // 🔥 ADDED FIX HERE: normalizedInput and processing.fee_percent
      const aiEnriched = await analyzeLoan({
        ...normalizedInput, 
        annualRate: bestBank.bankRawInfo.interest.effective_mid,
        processingFeePercent: bestBank.bankRawInfo.processing?.fee_percent || 0
      },bestBank.bankRawInfo, true); 

      processedResults[0].insights.ai = aiEnriched.insights.ai;
      processedResults[0].aiExplanation = aiEnriched.aiExplanation;
    } catch (aiErr) {
      console.warn("⚠️ AI Service skipped for top bank.");
    }

    // 6. Return payload
    res.status(200).json({
      success: true,
      results: processedResults,
      recommended: processedResults[0]
    });

  } catch (err) {
    console.error("Controller Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
import Bank from "../models/bankModel.js";
import { analyzeLoan } from "../services/loanAnalysis.services.js";
import userModal from "../models/userModel.js";
export const analyzeController = async (req, res) => {
  try {
    const input = req.body;
  
    const userGender = input.gender?.toLowerCase() || 'male';

    // 1. Validation
    if (!input.disbursements || !Array.isArray(input.disbursements)) {
      return res.status(400).json({ success: false, error: "Missing disbursements data." });
    }
    const normalizedInput = {
      ...input,
      disbursements: input.disbursements.map(d => ({
        amount: Number(d.amount || 0),
        startMonth: Number(d.startMonth ?? d.month ?? 0)
      }))
    };

    await userModal.findByIdAndUpdate(req.body.userId, {
      lastAnalysisInput: normalizedInput 
    });

    // 2. Fetch Banks from DB
    const banks = await Bank.find();
    if (!banks || banks.length === 0) {
      return res.status(404).json({ success: false, error: "No bank data found." });
    }

 
    // 4. Fast Math Pass (AI = false) for all banks
    const results = await Promise.all(
      banks.map(async (bank) => {
        // Calculate Female Student Concession (usually 0.50%)
        const femaleDiscount = (userGender === 'female' && bank.benefits?.women_discount_percent) 
          ? bank.benefits.women_discount_percent 
          : 0;

        const analysis = await analyzeLoan({
          ...normalizedInput,
          annualRate: bank.interest.effective_mid - femaleDiscount, // Apply discount
          processingFeePercent: bank.processing?.fee_percent || 0,
          maxFeeCap: bank.processing?.fee_flat_max || 0 // Pass Cap for GST logic
        }, bank, false);

        return {
          bankName: bank.name,
          bankType: bank.bank_type,
          bankRawInfo: bank,
          ...analysis
        };
      })
    );

    // 5. Data Refinement & Sort by Total Cost
    const processedResults = results.map(r => ({
      ...r,
      loan: { ...r.loan, schedule: r.loan.schedule?.slice(0, 12) || [] }
    }));

    processedResults.sort((a, b) => {
      const totalA = a.overview?.totalRepayment ?? Infinity;
      const totalB = b.overview?.totalRepayment ?? Infinity;
      return totalA - totalB;
    });

    // 6. Trigger Decision Engine AI for the #1 Recommended Bank
    const recommendedBank = processedResults[0];
    const worstBank = processedResults[processedResults.length - 1]; 
    const expensiveNames = processedResults.slice(-2).map(b => b.bankName).join(" and ");

    try {
      const winnerBankRaw = recommendedBank.bankRawInfo;
      const femaleDiscount = (userGender === 'female' && winnerBankRaw.benefits?.women_discount_percent) 
        ? winnerBankRaw.benefits.women_discount_percent 
        : 0;

      // Call AI with "Comparison Context"
      const aiEnriched = await analyzeLoan({
        ...normalizedInput, 
        annualRate: winnerBankRaw.interest.effective_mid - femaleDiscount,
        processingFeePercent: winnerBankRaw.processing?.fee_percent || 0,
        maxFeeCap: winnerBankRaw.processing?.fee_flat_max || 0,
        // Passing these variables for the enhanced prompt
        maxRepayment: worstBank.overview.totalRepayment, 
        alternatives: expensiveNames 
      }, winnerBankRaw, true); 

      recommendedBank.insights.ai = aiEnriched.insights.ai;
      recommendedBank.aiExplanation = aiEnriched.aiExplanation;
    } catch (aiErr) {
      console.warn("⚠️ AI Decision Logic failed, using math fallback.", aiErr.message);
    }

    // 7. Return Final Payload
    res.status(200).json({
      success: true,
      results: processedResults,
      recommended: recommendedBank
    });

  } catch (err) {
    console.error("Controller Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
import { analyzeLoan } from "../services/loanAnalysis.services.js";

/**
 * Fetches detailed AI insights for a specific bank.
 * Fixes the 'null' and '0 interest' issues by normalizing input field names
 * (mapping 'month' to 'startMonth') and extracting nested DB rates.
 */
export const getBankDetails = async (req, res) => {
  try {
    const { input, bank } = req.body;

    if (!input || !bank) {
      return res.status(400).json({ success: false, error: "Input or Bank data missing." });
    }

    // 1. Identify bank data source (Handle if bank object is wrapped or raw)
    const rawData = bank.bankRawInfo || bank;

    // 2. DATA NORMALIZATION (The Fix for 0 Interest / NaN Multiplier)
    // Ensure we have a valid disbursements array and map 'month' to 'startMonth'
    const normalizedDisbursements = (input.disbursements || []).map(d => ({
      amount: Number(d.amount || 0),
      startMonth: Number(d.startMonth ?? d.month ?? 0)
    }));

    // 3. SCHEMA MAPPING
    // Extract numerical rate from MongoDB structure (bank.interest.effective_mid)
    const extractedRate = rawData.interest?.effective_mid || 
                         ((Number(rawData.interest?.min || 0) + Number(rawData.interest?.max || 0)) / 2) || 
                         10.5;

    const mathReadyInput = {
      ...input,
      totalLoan: Number(input.totalLoan || 0),
      disbursements: normalizedDisbursements,
      bankName: rawData.name || "Selected Bank",
      annualRate: parseFloat(Number(extractedRate).toFixed(2)),
      processingFeePercent: parseFloat(Number(rawData.processing?.fee_percent || 0).toFixed(2)),
      // Handle various tenure field names
      tenureMonths: Number(input.tenureMonths || input.tenMonths || 120),
      moratoriumMonths: Number(input.moratoriumMonths || rawData.interest?.moratorium?.duration_months || 36),
      moratoriumType: input.moratoriumType || rawData.interest?.moratorium?.interest_type || 'simple'
    };

    // Server-side logging for debugging
    console.log(`>>> [DETAILS API] ANALYZING: ${mathReadyInput.bankName}`);
    console.log(`>>> RATE: ${mathReadyInput.annualRate}% | TOTAL: ${mathReadyInput.totalLoan}`);

    // 4. RUN ANALYSIS (includeAI = true)
    const detailedResult = await analyzeLoan(mathReadyInput,rawData, true);

    // 5. FINAL VALIDATION (Prevent NaN leaks to UI)
    if (detailedResult.overview.totalRepayment === 0 || isNaN(detailedResult.overview.totalRepayment)) {
       return res.status(500).json({
         success: false,
         error: "Math calculation failed. Ensure input numbers and bank rates are correct.",
         debug: { rateUsed: mathReadyInput.annualRate, principal: detailedResult.disbursement.effectivePrincipal }
       });
    }

    res.status(200).json({
      success: true,
      details: detailedResult
    });

  } catch (error) {
    console.error("Details Fetch Error:", error.message);
    res.status(500).json({ success: false, error: "An internal error occurred while fetching bank details." });
  }
};
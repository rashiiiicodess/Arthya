import Bank from "../models/bankModel.js";
import { analyzeLoan } from "../services/loanAnalysis.services.js";
export const analyzeController = async (req, res) => {
  try {
    const input = req.body;

    const banks = await Bank.find();

    // ✅ FIX: async map + Promise.all
    const results = await Promise.all(
      banks.map(async (bank) => {
        const analysis = await analyzeLoan({
          ...input,
          annualRate: bank.interest.effective_mid
        });

        return {
          bankName: bank.name,
          bankType: bank.bank_type,
          ...analysis
        };
      })
    );

 // ✅ FIRST: trim schedule
const trimmedResults = results.map(r => ({
  ...r,
  loan: {
    ...r.loan,
    schedule: r.loan.schedule.slice(0, 12)
  }
}));

// ✅ THEN: sort
trimmedResults.sort((a, b) => {
  const aVal = a?.overview?.totalRepayment ?? Infinity;
  const bVal = b?.overview?.totalRepayment ?? Infinity;
  return aVal - bVal;
});

// ✅ THEN: pick best
const recommended = trimmedResults[0];

    res.json({
      success: true,
  results: trimmedResults,
  recommended: recommended || null
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
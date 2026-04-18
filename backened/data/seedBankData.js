export const seedBanks = [
    {
        name: "State Bank of India (SBI)",
        bank_type: "public",
        logo_url: "https://example.com/logos/sbi.svg",
        interest: {
            min: 8.85, max: 10.15, type: "floating",
            rate_reset_frequency: "half-yearly",
            calculation_method: "daily_reducing",
            compounding_frequency: "monthly",
            moratorium: { interest_type: "simple", duration_months: 42 }
        },
        loan: { min_amount: 100000, max_amount: 15000000, margin_money_percent: 5, emi_ready: true },
        disbursement: { type: "progressive", frequency: "semester" },
       
        collateral: { required_above: 750000, type: ["Property", "FD"] },
        processing: { fee_percent: 0, fee_flat: 0,fee_flat_max: 10000, time_days: 22 },
        subsidy: { csis_applicable: true, income_limit: 450000, covers_moratorium_interest: true },
        benefits: { tax_80E: true, women_discount_percent: 0.50, flexible_repayment: true },
        pros: ["Lowest Lifetime Cost", "Government Subsidy support"],
        cons: ["Slow manual verification", "Heavy physical paperwork"]
    },
    {
        name: "HDFC Credila",
        bank_type: "nbfc",
        logo_url: "https://example.com/logos/credila.svg",
        interest: {
            min: 10.75, max: 13.50, type: "floating",
            rate_reset_frequency: "quarterly",
            calculation_method: "monthly_reducing",
            compounding_frequency: "monthly",
            moratorium: { interest_type: "compound", duration_months: 48 }
        },
        loan: { min_amount: 500000, max_amount: 15000000, margin_money_percent: 0, emi_ready: true },
        disbursement: { type: "progressive", frequency: "semester" },
        collateral: { required_above: 4000000, type: ["Property", "FD"] },
        processing: { fee_percent: 1.5, fee_flat: 0,fee_flat_max: 0, time_days: 4 },
        subsidy: { csis_applicable: false, income_limit: 0, covers_moratorium_interest: false },
        benefits: { tax_80E: true, women_discount_percent: 0, flexible_repayment: true },
        pros: ["100% Funding No Margin", "Doorstep digital service"],
        cons: ["Compounding study interest", "High processing fees"]
    },
    {
        name: "ICICI Bank",
        bank_type: "private",
        logo_url: "https://example.com/logos/icici.svg",
        interest: {
            min: 9.25, max: 12.50, type: "floating",
            rate_reset_frequency: "quarterly",
            calculation_method: "monthly_reducing",
            compounding_frequency: "monthly",
            moratorium: { interest_type: "simple", duration_months: 36 }
        },
        loan: { min_amount: 100000, max_amount: 10000000, margin_money_percent: 15, emi_ready: true },
        disbursement: { type: "progressive", frequency: "semester" },
        collateral: { required_above: 2000000, type: ["Property", "FD"] },
        processing: { fee_percent: 1.0, fee_flat: 0, fee_flat_max: 15000,time_days: 8 },
        subsidy: { csis_applicable: false, income_limit: 0, covers_moratorium_interest: false },
        benefits: { tax_80E: true, women_discount_percent: 0, flexible_repayment: false },
        pros: ["Pre-visa approval support", "No collateral for top unis"],
        cons: ["High 15% margin money", "Strict academic Score cutoffs"]
    },
    {
        name: "Bank of Baroda",
        bank_type: "public",
        logo_url: "https://example.com/logos/bob.svg",
        interest: {
            min: 9.15, max: 10.85, type: "floating",
            rate_reset_frequency: "half-yearly",
            calculation_method: "daily_reducing",
            compounding_frequency: "monthly",
            moratorium: { interest_type: "simple", duration_months: 42 }
        },
        loan: { min_amount: 100000, max_amount: 8000000, margin_money_percent: 5, emi_ready: true },
        disbursement: { type: "progressive", frequency: "semester" },
        collateral: { required_above: 750000, type: ["Property", "FD", "Insurance"] },
        processing: { fee_percent: 1.0, fee_flat: 0,fee_flat_max: 10000, time_days: 12 },
        subsidy: { csis_applicable: true, income_limit: 450000, covers_moratorium_interest: true },
        benefits: { tax_80E: true, women_discount_percent: 0.50, flexible_repayment: true },
        pros: ["Refundable processing fees", "Longer grace periods"],
        cons: ["Requires 100% collateral above 7.5L", "Branch visits mandatory"]
    },
    {
        name: "Axis Bank",
        bank_type: "private",
        logo_url: "https://example.com/logos/axis.svg",
        interest: {
            min: 10.25, max: 14.25, type: "floating",
            rate_reset_frequency: "quarterly",
            calculation_method: "monthly_reducing",
            compounding_frequency: "monthly",
            moratorium: { interest_type: "compound", duration_months: 42 }
        },
        loan: { min_amount: 50000, max_amount: 7500000, margin_money_percent: 10, emi_ready: true },
        disbursement: { type: "progressive", frequency: "yearly" },
        collateral: { required_above: 750000, type: ["Property", "FD", "Gold"] },
        processing: { fee_percent: 0.75, fee_flat: 10000, fee_flat_max: 20000,time_days: 10 },
        subsidy: { csis_applicable: false, income_limit: 0, covers_moratorium_interest: false },
        benefits: { tax_80E: true, women_discount_percent: 0, flexible_repayment: true },
        pros: ["Fast post-approval disbursal", "Minimal documentation"],
        cons: ["Lower loan cap for domestic", "Frequent rate resets"]
    }
];
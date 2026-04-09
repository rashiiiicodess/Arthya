import mongoose from 'mongoose';
import slugify from 'slugify';

const bankSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true,
        lowercase: true 
    },
    slug: { type: String, unique: true },
    logo_url: { type: String, required: true },
    bank_type: { 
        type: String, 
        enum: ['public', 'private', 'nbfc'], 
        required: true 
    },

    // --- INTEREST & EMI LOGIC ---
    interest: {
        min: { type: Number, required: true, min: 0 },
        max: { 
            type: Number, 
            required: true, 
            min: 0,
            validate: {
                validator: function(value) { return value >= this.get('interest.min'); },
                message: "Maximum interest rate cannot be lower than minimum."
            }
        },
        base_rate: { type: Number }, 
        effective_mid: { type: Number },
        calculation_method: {
            type: String,
            enum: ['daily_reducing', 'monthly_reducing'],
            default: 'monthly_reducing'
        },
        compounding_frequency: {
            type: String,
            enum: ['monthly', 'quarterly', 'annually'],
            default: 'monthly'
        },
        type: { type: String, enum: ['fixed', 'floating'], required: true },
        rate_reset_frequency: { 
            type: String, 
            enum: ['monthly', 'quarterly', 'half-yearly', 'yearly'],
            required: true 
        },
        moratorium: {
            interest_type: { type: String, enum: ['simple', 'compound'], required: true },
            duration_months: { type: Number, required: true, min: 0 }
        }
    },

    loan: {
        min_amount: { type: Number, default: 100000 },
        max_amount: { type: Number, required: true, min: 100000 },
        max_tenure_years: { type: Number, default: 15, min: 1 }, 
        margin_money_percent: { type: Number, default: 5, min: 0, max: 100 },
        emi_start_after_months: { type: Number, default: 6 },
        emi_ready: { type: Boolean, default: true }
    },

    disbursement: {
        type: { type: String, default: "progressive" },
        frequency: { type: String, enum: ['yearly', 'semester'], required: true }
    },

    collateral: {
        required_above: { type: Number, required: true, min: 0 },
        type: [{ type: String, enum: ['Property', 'FD', 'Gold', 'Insurance'] }],
        collateral_required_early: { type: Boolean, default: false }
    },

    processing: {
        fee_percent: { type: Number, default: 0, min: 0, max: 5 },
        fee_flat: { type: Number, default: 0 },
        time_days: { type: Number, required: true, min: 1, max: 60 }
    },

    subsidy: {
        csis_applicable: { type: Boolean, required: true },
        income_limit: { type: Number, default: 450000 },
        covers_moratorium_interest: { type: Boolean, default: false }
    },

    benefits: {
        tax_80E: { type: Boolean, default: true },
        flexible_repayment: { type: Boolean, required: true },
        women_discount_percent: { type: Number, default: 0 }
    },

    insight_flags: {
        high_processing_time: { type: Boolean, default: false },
        government_backed: { type: Boolean, default: false },
        high_risk_compounding: { type: Boolean, default: false }
    },

    analytics: {
        total_cost_multiplier: { type: Number }, 
        ranking_score: { type: Number } 
    },

    meta: {
        cost_category: { type: String, enum: ['low', 'medium', 'high'] },
        risk_level: { type: String, enum: ['low', 'moderate', 'high'] }
    },

    tags: [{ type: String }],
    pros: [{ type: String }],
    cons: [{ type: String }]

}, { 
    timestamps: true, 
    strict: "throw" 
});

// --- THE RANKING ENGINE MIDDLEWARE ---
bankSchema.pre('save', function(next) {
    if (!this.analytics) this.analytics = {};
    if (!this.meta) this.meta = {};
    if (!this.insight_flags) this.insight_flags = {};

    this.slug = slugify(this.name, { lower: true, strict: true });
    this.interest.effective_mid = (this.interest.min + this.interest.max) / 2;
    if (!this.interest.base_rate) this.interest.base_rate = this.interest.min;

    // Intelligence Flags
    this.insight_flags.high_risk_compounding = this.interest.moratorium.interest_type === 'compound';
    this.insight_flags.high_processing_time = this.processing.time_days > 12;
    this.collateral.collateral_required_early = this.collateral.required_above <= 750000;
    this.insight_flags.government_backed = this.bank_type === 'public';

    // Advanced Ranking Score
    const costScore = (15 - this.interest.min) * 0.5;
    const flexibilityBonus = (this.benefits.flexible_repayment ? 1.5 : 0);
    const subsidyBonus = (this.subsidy.csis_applicable ? 1.0 : 0);
    
    const riskPenalty = (this.insight_flags.high_risk_compounding ? 1.5 : 0);
    const processingPenalty = (this.processing.fee_percent > 1 ? 0.5 : 0);
    const collateralPenalty = (this.collateral.collateral_required_early ? 1.0 : 0);

    this.analytics.ranking_score = parseFloat(
        (costScore + flexibilityBonus + subsidyBonus - riskPenalty - processingPenalty - collateralPenalty).toFixed(2)
    );

    if (!this.meta.risk_level) {
        this.meta.risk_level = (this.interest.max > 13 || this.insight_flags.high_risk_compounding) ? "high" : "low";
    }
    this.meta.cost_category = this.interest.min <= 9.5 ? "low" : (this.interest.min <= 11.5 ? "medium" : "high");

    const systemTags = [];
    if (this.insight_flags.government_backed) systemTags.push("Govt-Backed");
    if (this.insight_flags.high_risk_compounding) systemTags.push("Compounding-Risk");
    this.tags = [...new Set([...(this.tags || []), ...systemTags])];

    next();
});

const Bank = mongoose.models.Bank || mongoose.model('Bank', bankSchema);
export default Bank;
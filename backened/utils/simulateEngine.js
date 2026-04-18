import { calculateLoan } from "./loanCalculator.js";

export function simulateScenario(basePlan, tweaks) {
  // 1. Merge Base Plan with Tweaks
  const simulatedInput = {
    principal: tweaks.loanAmount || basePlan.loan.netDisbursed,
    annualRate: tweaks.interestRate || basePlan.bankRawInfo.interest.effective_mid,
    tenureMonths: tweaks.tenureYears ? tweaks.tenureYears * 12 : basePlan.loan.tenureMonths,
    salary: tweaks.salary || basePlan.input.salary,
  };

  // 2. Run the math for the NEW scenario
  const simulatedLoan = calculateLoan({
    principal: simulatedInput.principal,
    annualRate: simulatedInput.annualRate,
    tenureMonths: simulatedInput.tenureMonths,
    // Note: Simulation usually assumes fees are already paid or constant
  });

  // 3. Calculate Deltas (Differences)
  const emiDelta = simulatedLoan.emi - basePlan.loan.emi;
  const totalRepaymentDelta = simulatedLoan.totalRepayment - basePlan.overview.totalRepayment;
  const emiToSalaryRatio = (simulatedLoan.emi / simulatedInput.salary) * 100;

  // 4. Generate Dynamic Simulation Insights
const simInsights = [];

// --- A. THE SURVIVAL ANALYSIS (Real-world Cashflow) ---
const leftAfterEMI = simulatedInput.salary - simulatedLoan.emi;

if (leftAfterEMI < 15000 && leftAfterEMI > 0) {
    simInsights.push({
        category: "Survival",
        title: "The 'Survival' Zone",
        text: `After EMI, you only have ₹${leftAfterEMI.toLocaleString()} left. In a Tier-1 Indian city, this barely covers rent and basic groceries. You will have ₹0 for emergencies or travel.`,
        severity: "medium"
    });
} else if (leftAfterEMI <= 0) {
    simInsights.push({
        category: "Survival",
        title: "Financial Deadlock",
        text: `This scenario is a deadlock. Your debt (₹${simulatedLoan.emi.toLocaleString()}) eats your entire income. You will be forced to rely on your parents or take more loans just to eat.`,
        severity: "critical"
    });
}

// --- B. THE 'TENURE TRAP' (Long-term Wealth) ---
if (totalRepaymentDelta > 0 && tweaks.tenureYears > basePlan.overview.years) {
    const extraLakhs = (totalRepaymentDelta / 100000).toFixed(1);
    simInsights.push({
        category: "Cost",
        title: "The Wealth Leak",
        text: `You lowered your EMI, but you just signed away ₹${extraLakhs} Lakhs of your future wealth. That money is equivalent to a downpayment for a house or 2 years of global travel that you've handed to the bank.`,
        severity: "high"
    });
}

// --- C. FLOATING RATE STRESS TEST (Future-Proofing) ---
if (tweaks.interestRate > basePlan.bankRawInfo.interest.effective_mid) {
    const rateDiff = (tweaks.interestRate - basePlan.bankRawInfo.interest.effective_mid).toFixed(1);
    simInsights.push({
        category: "Market Risk",
        title: "The Inflation Hit",
        text: `A ${rateDiff}% market rate hike isn't just a number—it increases your total debt by ₹${totalRepaymentDelta.toLocaleString()}. If the RBI raises rates, your 10-year plan just became ${((totalRepaymentDelta/basePlan.overview.totalRepayment)*100).toFixed(1)}% more expensive.`,
        severity: "medium"
    });
}

// --- D. THE POSITIVE "PATHWAY" (Encouraging smart moves) ---
if (totalRepaymentDelta < 0) {
    simInsights.push({
        category: "Freedom",
        title: "Accelerated Freedom",
        text: `By choosing this path, you save ₹${Math.abs(totalRepaymentDelta).toLocaleString()}. You will be debt-free earlier, allowing you to start investing in your 20s rather than just paying for your past.`,
        severity: "low"
    });
}

  return {
    simulatedLoan,
    deltas: {
      emiDelta,
      totalRepaymentDelta,
      ratioDelta: emiToSalaryRatio - (basePlan.loan.emi / basePlan.input.salary * 100)
    },
    riskLevel: emiToSalaryRatio > 40 ? "High Risk" : "Manageable",
    simInsights
  };
}
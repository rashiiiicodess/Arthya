import { calculateLoan } from "./LoanCalculator";

export function simulateScenario(basePlan, tweaks) {
  const simInsights = [];

  // 1. Merge Base Plan with Tweaks
  const simulatedInput = {
    principal: tweaks.loanAmount || basePlan?.loan?.netDisbursed || 1000000, 
    annualRate: tweaks.interestRate || basePlan?.bankRawInfo?.interest?.effective_mid || 9.5,
    tenureMonths: tweaks.tenureYears ? tweaks.tenureYears * 12 : (basePlan?.loan?.tenureMonths || 120),
    salary: tweaks.salary || 50000 
  };

  // 2. RUN THE MATH FIRST (Crucial for the insights below)
  const simulatedLoan = calculateLoan({
    principal: simulatedInput.principal,
    annualRate: simulatedInput.annualRate,
    tenureMonths: simulatedInput.tenureMonths,
  });

  // 3. Setup Deltas
  const emiDelta = simulatedLoan.emi - (basePlan?.loan?.emi || 0);
  const totalRepaymentDelta = simulatedLoan.totalRepayment - (basePlan?.overview?.totalRepayment || 0);
  const emiRatio = (simulatedLoan.emi / simulatedInput.salary) * 100;
  const baseRatio = ((basePlan?.loan?.emi || 0) / (simulatedInput.salary || 1)) * 100;

  // 4. DEEP INTELLIGENCE LOGIC

  // --- A. CAREER LOCKDOWN ---
  if (emiRatio > 35) {
    simInsights.push({
      title: "Career Lockdown",
      text: `With ${emiRatio.toFixed(0)}% of your pay locked, you lose the "Risk Appetite" to join startups or quit toxic jobs. You are now tethered to stability.`,
      severity: "critical"
    });
  }

  // --- B. WEALTH VELOCITY LOSS (Opportunity Cost) ---
  // Calculates what that EMI could have grown to in a 12% Index Fund over 10 years
  const tenYearLostWealth = Math.round(simulatedLoan.emi * 230); 
  simInsights.push({
    title: "Opportunity Cost",
    text: `Handing ₹${Math.round(simulatedLoan.emi).toLocaleString()} to the bank monthly blocks a potential ₹${(tenYearLostWealth/1000000).toFixed(1)} Cr corpus you could have built by Year 10.`,
    severity: "high"
  });

  // --- C. SURVIVAL ZONE ---
  const leftAfterEMI = simulatedInput.salary - simulatedLoan.emi;
  if (leftAfterEMI < 15000) {
    simInsights.push({
      title: leftAfterEMI <= 0 ? "Financial Deadlock" : "The Survival Zone",
      text: leftAfterEMI <= 0 
        ? `Your EMI exceeds your income. You will be net-negative every month.`
        : `After EMI, you only have ₹${Math.round(leftAfterEMI).toLocaleString()} left for rent and food. This is graduate-level poverty.`,
      severity: "critical"
    });
  }

  // --- D. ACCELERATED FREEDOM ---
  if (totalRepaymentDelta < -20000) {
    simInsights.push({
      title: "Wealth Preservation",
      text: `By optimizing this way, you prevent ₹${Math.abs(Math.round(totalRepaymentDelta)).toLocaleString()} from leaking out of your future net worth.`,
      severity: "low"
    });
  }

  return {
    simulatedLoan,
    deltas: {
      emiDelta,
      totalRepaymentDelta,
      ratioDelta: emiRatio - baseRatio
    },
    riskLevel: emiRatio > 40 ? "High Risk" : "Manageable",
    simInsights
  };
}
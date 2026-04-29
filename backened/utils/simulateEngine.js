import { calculateLoan } from "./LoanCalculator";

export function simulateScenario(basePlan, tweaks) {
  const simInsights = [];

  // 1. Prepare Inputs
  const simulatedInput = {
    principal: tweaks.loanAmount || basePlan?.loan?.netDisbursed || 1000000, 
    annualRate: tweaks.interestRate || basePlan?.bankRawInfo?.interest?.effective_mid || 9.5,
    tenureMonths: tweaks.tenureYears ? tweaks.tenureYears * 12 : (basePlan?.loan?.tenureMonths || 120),
    salary: tweaks.salary || 50000 
  };

  // 2. RUN MATH FIRST (Crucial: Define simulatedLoan before using it for insights)
  const simulatedLoan = calculateLoan({
    principal: simulatedInput.principal,
    annualRate: simulatedInput.annualRate,
    tenureMonths: simulatedInput.tenureMonths,
  });

  // 3. CALCULATE DELTAS
  const emiDelta = simulatedLoan.emi - (basePlan?.loan?.emi || 0);
  const totalRepaymentDelta = simulatedLoan.totalRepayment - (basePlan?.overview?.totalRepayment || 0);
  const emiToSalaryRatio = (simulatedLoan.emi / simulatedInput.salary) * 100;

  // 4. DEEP INTELLIGENCE ENGINE

  // --- A. CAREER LOCKDOWN ---
  if (emiToSalaryRatio > 35) {
    simInsights.push({
      title: "Career Lockdown",
      text: `With ${emiToSalaryRatio.toFixed(0)}% of your pay gone, you cannot afford to quit a toxic job or join a high-growth startup. Your freedom is now restricted.`,
      severity: "critical"
    });
  }

  // --- B. WEALTH VELOCITY / OPPORTUNITY COST ---
  const tenYearLostWealth = Math.round(simulatedLoan.emi * 230); // 10yr SIP multiplier at 12%
  simInsights.push({
    title: "Opportunity Cost",
    text: `Handing ₹${Math.round(simulatedLoan.emi).toLocaleString()} to the bank monthly blocks a potential ₹${(tenYearLostWealth/1000000).toFixed(1)} Cr corpus by Year 10.`,
    severity: "high"
  });

  // --- C. SURVIVAL & DEBT-FREE HORIZON ---
  const leftAfterEMI = simulatedInput.salary - simulatedLoan.emi;
  if (leftAfterEMI < 15000) {
    simInsights.push({
      title: "The 'Survival' Zone",
      text: `After EMI, you only have ₹${Math.round(leftAfterEMI).toLocaleString()} left. In a Tier-1 city, this is below the living wage for a graduate.`,
      severity: leftAfterEMI <= 0 ? "critical" : "high"
    });
  }

  // --- D. POSITIVE PATHWAY ---
  if (totalRepaymentDelta < -20000) {
    simInsights.push({
      title: "Wealth Preservation",
      text: `By optimizing this way, you prevent ₹${Math.abs(Math.round(totalRepaymentDelta)).toLocaleString()} from leaking out of your net worth.`,
      severity: "low"
    });
  }

  return {
    simulatedLoan,
    deltas: {
      emiDelta,
      totalRepaymentDelta,
      ratioDelta: emiToSalaryRatio - ((basePlan?.loan?.emi / simulatedInput.salary) * 100)
    },
    riskLevel: emiToSalaryRatio > 40 ? "High Risk" : "Manageable",
    simInsights
  };
}
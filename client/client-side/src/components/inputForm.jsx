import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Calculator } from "lucide-react";

// --- UI COMPONENTS --- //

const Input = (props) => (
  <input
    {...props}
    className="flex h-11 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6D28D9]"
  />
);

const Label = ({ children }) => (
  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
    {children}
  </label>
);

const Button = ({ children, isLoading, ...props }) => (
  <button
    {...props}
    className="w-full h-14 rounded-2xl bg-[#6D28D9] text-white font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-60"
  >
    {isLoading ? "Analyzing..." : children}
  </button>
);

const Card = ({ children }) => (
  <div className="rounded-[32px] border shadow-xl bg-white">{children}</div>
);

const CardContent = ({ children }) => (
  <div className="p-8">{children}</div>
);

const Switch = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`w-11 h-6 flex items-center rounded-full p-1 ${
      checked ? "bg-[#6D28D9]" : "bg-gray-200"
    }`}
  >
    <div
      className={`bg-white w-4 h-4 rounded-full transition ${
        checked ? "translate-x-5" : ""
      }`}
    />
  </button>
);

// --- MAIN --- //

export default function InputForm({ onAnalyze, isLoading }) {
  const [form, setForm] = useState({
    totalLoan: "",
    tenureYears: "10",
    courseDurationYears: "2",
    salary: "",
    moratoriumType: "simple",
    processingFeePercent: "",
    csisEligible: false
  });

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const totalLoan = Number(form.totalLoan);
    const salary = Number(form.salary);
    const tenureMonths = Number(form.tenureYears) * 12;
    const courseYears = Number(form.courseDurationYears);
    const moratoriumMonths = courseYears * 12 + 6;

    // ✅ VALIDATION
    if (!totalLoan || totalLoan <= 0) {
      alert("Enter a valid loan amount");
      return;
    }

    if (!salary || salary <= 0) {
      alert("Enter a valid salary");
      return;
    }

    if (!tenureMonths || tenureMonths <= 0) {
      alert("Invalid tenure");
      return;
    }

    if (!courseYears || courseYears <= 0) {
      alert("Invalid course duration");
      return;
    }

    // ✅ SMART DISBURSEMENT (front-loaded)
    const base = totalLoan / courseYears;

    const disbursements = Array.from({ length: courseYears }, (_, i) => ({
      amount: Math.round(i === 0 ? base * 1.2 : base * 0.9),
      month: i * 12
    }));

    const payload = {
      totalLoan,
      tenureMonths,
      moratoriumMonths,
      moratoriumType: form.moratoriumType,
      disbursements,
      salary,

      processingFeePercent: Number(form.processingFeePercent) || 0,
      csisEligible: form.csisEligible,

      // backend-safe defaults
      emiStartAfterMonths: 0,
      prepayments: [],
      rateChanges: []
    };

    onAnalyze(payload);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <CardContent>
          {/* HEADER */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <Calculator className="text-[#6D28D9]" />
            </div>
            <div>
              <h2 className="font-bold text-xl">Loan Intelligence</h2>
              <p className="text-sm text-gray-500">
                AI-powered loan comparison across banks
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* CORE */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Loan Amount (₹)">
                <Input
                  type="number"
                  value={form.totalLoan}
                  onChange={(e) =>
                    handleChange("totalLoan", e.target.value)
                  }
                  required
                />
              </Field>

              <Field label="Expected Salary (₹)">
                <Input
                  type="number"
                  value={form.salary}
                  onChange={(e) =>
                    handleChange("salary", e.target.value)
                  }
                  required
                />
              </Field>

              <Field label="Tenure (Years)">
                <Input
                  type="number"
                  value={form.tenureYears}
                  onChange={(e) =>
                    handleChange("tenureYears", e.target.value)
                  }
                />
              </Field>

              <Field label="Course Duration (Years)">
                <Input
                  type="number"
                  value={form.courseDurationYears}
                  onChange={(e) =>
                    handleChange("courseDurationYears", e.target.value)
                  }
                />
              </Field>
            </div>

            {/* MORATORIUM */}
            <div>
              <Label>Moratorium Interest Type</Label>
              <div className="flex gap-2 mt-2">
                {["simple", "compound"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleChange("moratoriumType", type)}
                    className={`flex-1 py-2 rounded font-medium ${
                      form.moratoriumType === type
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* PROCESSING FEE */}
            <Field label="Processing Fee (%)">
              <Input
                type="number"
                value={form.processingFeePercent}
                onChange={(e) =>
                  handleChange("processingFeePercent", e.target.value)
                }
                placeholder="Optional"
              />
            </Field>

            {/* CSIS */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                CSIS Subsidy Eligible
              </span>
              <Switch
                checked={form.csisEligible}
                onChange={(v) => handleChange("csisEligible", v)}
              />
            </div>

            {/* SUBMIT */}
            <Button type="submit" isLoading={isLoading}>
              Analyze Loan <Sparkles />
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// --- FIELD --- //
function Field({ label, children }) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sparkles, ShieldCheck, BarChart3, ArrowLeft } from "lucide-react";
import InputForm from "../components/inputForm";

const CHAR_IMG =
  "https://media.base44.com/images/public/69d145fab4e9dff45f4e4d66/e9affcc43_generated_image.png";

export default function Analyze() {
  const navigate = useNavigate();
  const [isCalculating, setIsCalculating] = useState(false);
const handleAnalyze = async (input) => {
  setIsCalculating(true);
  try {
    const res = await fetch("http://localhost:4002/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", 
      body: JSON.stringify(input)
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Something went wrong");

    // 🚀 THE FIX: Manually attach the input values to the result object
    const enrichedData = {
      ...data,
      salary: input.expectedSalary || input.salary, // Save the salary you typed
      input: input // Save the whole input object just in case
    };

    sessionStorage.setItem("arthya_results", JSON.stringify(enrichedData));
    navigate("/dashboard");
  } catch (err) {
    console.error(err);
    alert(err.message);
    setIsCalculating(false);
  }
};
  return (
    <div className="min-h-screen bg-[#FDFDFF] pb-20 font-sans">
      {/* Navigation Header */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-[#6D28D9] transition-colors font-medium text-sm"
        >
          <ArrowLeft size={18} /> Back to Home
        </button>
        <div className="flex items-center gap-2 opacity-50">
          <ShieldCheck size={16} className="text-[#6D28D9]" />
          <span className="text-xs font-bold uppercase tracking-widest text-slate-900">Encrypted Analysis</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        {/* HERO HEADER SECTION */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
          <div className="relative">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute inset-0 bg-purple-200 rounded-full blur-3xl opacity-30"
            />
            <motion.img
              src={CHAR_IMG}
              alt="Student character"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="w-40 h-40 md:w-48 md:h-48 object-contain relative z-10 drop-shadow-2xl"
            />
          </div>

          <div className="text-center md:text-left flex-1">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 bg-purple-50 text-[#6D28D9] px-4 py-1.5 rounded-full text-xs font-bold mb-4 tracking-wide"
            >
              <Sparkles size={14} /> LOAN DECISION ENGINE
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-medium text-slate-900 leading-tight tracking-tight"
            >
              Analyze your <br />
              <span className="text-[#6D28D9] font-bold">financial future.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-slate-500 mt-4 text-lg font-medium leading-relaxed max-w-md"
            >
              We’ll process your data against 5 major banks to calculate risk, compounding costs, and interest impact.
            </motion.p>
          </div>
        </div>

        {/* STATUS INDICATOR */}
        <div className="flex justify-between items-center mb-8 px-2">
           <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all ${isCalculating ? 'bg-slate-100 text-slate-400' : 'bg-[#6D28D9] text-white shadow-lg shadow-purple-100'}`}>1</div>
              <span className={`text-sm font-bold tracking-tight transition-colors ${isCalculating ? 'text-slate-400' : 'text-slate-900'}`}>Input Details</span>
           </div>
           <div className="h-[2px] flex-1 mx-4 bg-slate-100 relative">
              {isCalculating && (
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  className="absolute inset-0 bg-[#6D28D9]"
                />
              )}
           </div>
           <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold border-2 transition-all ${isCalculating ? 'bg-[#6D28D9] border-[#6D28D9] text-white shadow-lg shadow-purple-100' : 'bg-white border-slate-100 text-slate-300'}`}>2</div>
              <span className={`text-sm font-bold tracking-tight transition-colors ${isCalculating ? 'text-slate-900' : 'text-slate-300'}`}>Intelligence Report</span>
           </div>
        </div>

        {/* THE FORM COMPONENT */}
        <div className="relative group">
           {/* Decorative elements behind form */}
           <div className="absolute -inset-1 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-[42px] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
           
           <div className="relative bg-white rounded-[40px]">
             <InputForm onAnalyze={handleAnalyze} isLoading={isCalculating} />
           </div>
        </div>

        {/* FOOTER INFO */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="flex items-start gap-3 p-4">
            <div className="text-[#6D28D9] mt-1"><ShieldCheck size={20} /></div>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">Data is anonymized and processed using banking-grade security protocols.</p>
          </div>
          <div className="flex items-start gap-3 p-4">
            <div className="text-[#6D28D9] mt-1"><BarChart3 size={20} /></div>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">Comparing SBI, HDFC, BoB, ICICI, and NBFC interest ranges.</p>
          </div>
          <div className="flex items-start gap-3 p-4">
            <div className="text-[#6D28D9] mt-1"><Sparkles size={20} /></div>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">Powered by Arthya Decision Engine v2.0.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
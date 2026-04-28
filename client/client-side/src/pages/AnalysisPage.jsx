import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import InputForm from "../components/inputForm";
import Dashboard from "./Dashboard"; 

// Use 4002 to match your server.js
const API_BASE_URL = "http://localhost:4002/api";
axios.defaults.withCredentials = true;
// ... imports
export default function AnalysisPage() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserHistory = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/user/data`); 
        const savedInput = response.data?.userData?.lastAnalysisInput;

        if (savedInput) {
          const result = await axios.post(`${API_BASE_URL}/analyze`, savedInput);
          setAnalysisResult(result.data);
        }
      } catch (err) {
        console.error("Session check failed:", err.message);
      } finally {
        // ALWAYS stop loading at the end
        setIsLoading(false); 
      }
    };
    checkUserHistory();
  }, []);

  /**const handleNewAnalysis = async (payload) => {
    setIsLoading(true);
    try {
      const result = await axios.post(`${API_BASE_URL}/analyze`, payload);
      setAnalysisResult(result.data);
    } catch (err) {
      alert("Analysis failed.");
    } finally {
      setIsLoading(false);
    }
  };*/
 const handleNewAnalysis = async (payload) => {
  setIsLoading(true);
  try {
    const result = await axios.post(`${API_BASE_URL}/analyze`, payload);
    
    // 🚀 THE CRITICAL FIX: 
    // Merge the AI's response with the salary the user actually typed.
    const enrichedData = {
      ...result.data, 
      salary: payload.expectedSalary || payload.salary 
    };
    
    setAnalysisResult(enrichedData);
  } catch (err) {
    console.error("Analysis failed:", err);
    alert("Could not analyze loan. Please check your connection.");
  } finally {
    setIsLoading(false);
  }
};

  // Logic: If we are actively fetching, show spinner.
  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 min-h-screen bg-slate-50">
      <AnimatePresence mode="wait">
        {/* CRITICAL: Check for 'recommended' inside analysisResult 
          to ensure Dashboard has what it needs to render 
        */}
        {analysisResult && analysisResult.recommended ? (
          <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Dashboard 
              data={analysisResult} 
              onReset={() => setAnalysisResult(null)} 
            />
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <InputForm onAnalyze={handleNewAnalysis} isLoading={isLoading} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import InputForm from "../components/inputForm";
import Dashboard from "./Dashboard"; // Pick one name

// Configure axios once for the whole project (or do it here)
axios.defaults.withCredentials = true;

export default function AnalysisPage() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserHistory = async () => {
      try {
        // 1. Fetch user data
        const response = await axios.get("http://localhost:4000/api/user/data"); 
        const savedInput = response.data.userData.lastAnalysisInput;

        if (savedInput) {
          // 2. Automatically trigger analysis
          const result = await axios.post("http://localhost:4000/api/analyze", savedInput);
          setAnalysisResult(result.data);
        }
      } catch (err) {
        console.log("No previous analysis found or session expired.");
      } finally {
        setIsLoading(false);
      }
    };

    checkUserHistory();
  }, []);

  const handleNewAnalysis = async (payload) => {
    setIsLoading(true);
    try {
      const result = await axios.post("http://localhost:4000/api/analyze", payload);
      setAnalysisResult(result.data);
    } catch (err) {
      alert("Analysis failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen">
      <AnimatePresence mode="wait">
        {analysisResult ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Using 'Dashboard' as per your import */}
            <Dashboard 
              data={analysisResult} 
              onReset={() => setAnalysisResult(null)} 
            />
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <InputForm onAnalyze={handleNewAnalysis} isLoading={isLoading} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Simple Purple Spinner for your UI
function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
      <p className="text-purple-600 font-medium animate-pulse">Consulting Arthya AI...</p>
    </div>
  );
}
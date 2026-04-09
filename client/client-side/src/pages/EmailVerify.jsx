import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { ShieldCheck, Loader2, RotateCcw, ArrowRight } from 'lucide-react';

const EmailVerify = () => {
    axios.defaults.withCredentials = true;
    const { backendUrl, isLoggedIn, userData, getUserData } = useContext(AppContext);
    const navigate = useNavigate();
    
    const inputRefs = useRef([]);
    const isInitialMount = useRef(true); // Lock for preventing double-send
    
    const [loading, setLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);

    // --- OTP Navigation ---
    const handleInput = (e, index) => {
        if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    // --- Send OTP (Triggered only once on mount) ---
    const sendOtp = async () => {
        setIsSending(true);
        try {
            const { data } = await axios.post(backendUrl + '/api/auth/send-verify-otp');
            if (data.success) {
                toast.success("Verification code sent!");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Could not send OTP");
        } finally {
            setIsSending(false);
        }
    };

    // --- Verify OTP ---
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const otpArray = inputRefs.current.map(e => e.value);
            const otp = otpArray.join('');
            
            if (otp.length < 6) {
                toast.error("Please enter the full 6-digit code");
                setLoading(false);
                return;
            }

            const { data } = await axios.post(`${backendUrl}/api/auth/verify-account`, { otp });

            if (data.success) {
                toast.success("Account Verified!");
                await getUserData(); 
                navigate('/dashboard');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    // --- Control Logic ---
    useEffect(() => {
        // Redirect if already verified
        if (isLoggedIn && userData?.isAccountVerified) {
            navigate('/dashboard');
        }
        
        // Auto-send only on the first valid mount
        if (isLoggedIn && userData && !userData.isAccountVerified && isInitialMount.current) {
            sendOtp();
            isInitialMount.current = false; // Close the lock
        }
    }, [isLoggedIn, userData]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#FDFDFF] px-6 font-sans">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[1000px] flex flex-col md:flex-row items-stretch bg-white rounded-[40px] shadow-2xl shadow-purple-100/50 overflow-hidden border border-slate-100"
            >
                {/* Left Side: Brand Panel */}
                <div className="hidden md:flex flex-1 flex-col justify-between p-16 bg-[#6D28D9] text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-16">
                            <div className="w-10 h-10 bg-white text-[#6D28D9] rounded-xl flex items-center justify-center font-bold text-xl shadow-lg">A</div>
                            <span className="text-2xl font-semibold tracking-tight">Arthya</span>
                        </div>
                        <h1 className="text-5xl font-medium leading-[1.15] mb-6">Secure your <br /> access.</h1>
                        <p className="text-purple-100 text-lg font-light leading-relaxed max-w-xs">Enter the code we sent to your email to verify your identity.</p>
                    </div>
                </div>

                {/* Right Side: OTP Input */}
                <div className="flex-1 p-8 md:p-20 flex flex-col justify-center">
                    <div className="mb-10">
                        <div className="w-14 h-14 bg-purple-50 text-[#6D28D9] rounded-2xl flex items-center justify-center mb-6">
                            <ShieldCheck size={28} />
                        </div>
                        <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">Verify email</h2>
                        <p className="text-slate-500 mt-2">Code sent to <span className="text-[#6D28D9] font-medium">{userData?.email}</span></p>
                    </div>

                    <form onSubmit={onSubmitHandler} className="space-y-10">
                        <div className="flex justify-between gap-2 max-w-sm" onPaste={(e) => {
                            const paste = e.clipboardData.getData('text').slice(0, 6);
                            paste.split('').forEach((char, i) => { if(inputRefs.current[i]) inputRefs.current[i].value = char });
                        }}>
                            {Array(6).fill(0).map((_, i) => (
                                <input
                                    key={i} type="text" maxLength="1" required
                                    className="w-12 h-16 text-2xl font-semibold text-center bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#6D28D9]/10 focus:border-[#6D28D9] transition-all"
                                    ref={el => inputRefs.current[i] = el}
                                    onInput={(e) => handleInput(e, i)}
                                    onKeyDown={(e) => handleKeyDown(e, i)}
                                />
                            ))}
                        </div>

                        <div className="space-y-6">
                            <motion.button 
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={loading}
                                className="w-full py-4 bg-[#6D28D9] text-white rounded-2xl font-semibold text-lg shadow-lg shadow-purple-200 flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {loading ? <Loader2 className="animate-spin" size={24} /> : <>Verify Account <ArrowRight size={20} /></>}
                            </motion.button>

                            <button 
                                type="button"
                                onClick={() => { isInitialMount.current = true; sendOtp(); }}
                                disabled={isSending}
                                className="flex items-center justify-center gap-2 mx-auto md:mx-0 text-[#6D28D9] font-medium hover:underline disabled:text-slate-400"
                            >
                                <RotateCcw size={16} className={isSending ? "animate-spin" : ""} />
                                {isSending ? "Sending..." : "Resend Code"}
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default EmailVerify;
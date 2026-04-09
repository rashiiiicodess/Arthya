import React, { useContext, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Mail, Lock, ArrowLeft, KeySquare } from 'lucide-react';

const ResetPassword = () => {
    const { backendUrl } = useContext(AppContext);
    axios.defaults.withCredentials = true;
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

    const inputRefs = useRef([]);

    const handleInput = (e, index) => {
        if (e.target.value.length > 0 && index < inputRefs.current.length - 1) inputRefs.current[index + 1].focus();
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && e.target.value === '' && index > 0) inputRefs.current[index - 1].focus();
    };

    const onSubmitEmail = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(`${backendUrl}/api/auth/send-reset-otp`, { email });
            if (data.success) { toast.success(data.message); setIsEmailSent(true); }
            else { toast.error(data.message); }
        } catch (error) { toast.error(error.message); }
    };

    const onSubmitOtp = async (e) => {
        e.preventDefault();
        const otpArray = inputRefs.current.map(e => e.value);
        setOtp(otpArray.join(''));
        setIsOtpSubmitted(true);
    };

    const onSubmitNewPassword = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(`${backendUrl}/api/auth/reset-password`, { email, otp, newPassword });
            if (data.success) { toast.success(data.message); navigate('/login'); }
            else { toast.error(data.message); }
        } catch (error) { toast.error(error.message); }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 px-6 font-inter">
            <button onClick={() => navigate('/login')} className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 font-semibold hover:text-purple-600 transition-colors">
                <ArrowLeft size={20} /> Back to Login
            </button>

            <div className="bg-white p-10 rounded-3xl shadow-2xl shadow-purple-100 w-full max-w-md border border-slate-100">
                {!isEmailSent && (
                    <form onSubmit={onSubmitEmail} className="text-center">
                        <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6"><Mail size={32} /></div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Reset Password</h2>
                        <p className="text-slate-500 mb-8 font-medium">Enter your email to receive a password reset OTP.</p>
                        <div className="relative mb-6">
                            <Mail className="absolute left-4 top-3.5 text-slate-400" size={20} />
                            <input type="email" placeholder="Email Address" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-purple-500" value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>
                        <button className="w-full py-4 bg-purple-600 text-white rounded-2xl font-bold hover:bg-purple-700 transition-all">Send OTP</button>
                    </form>
                )}

                {isEmailSent && !isOtpSubmitted && (
                    <form onSubmit={onSubmitOtp} className="text-center">
                        <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6"><KeySquare size={32} /></div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Verify OTP</h2>
                        <div className="flex justify-between gap-2 mb-8">
                            {Array(6).fill(0).map((_, i) => (
                                <input key={i} type="text" maxLength="1" required className="w-12 h-16 text-2xl font-bold text-center bg-slate-50 border-2 border-slate-200 rounded-xl outline-none focus:border-purple-500" ref={el => inputRefs.current[i] = el} onInput={(e) => handleInput(e, i)} onKeyDown={(e) => handleKeyDown(e, i)} />
                            ))}
                        </div>
                        <button className="w-full py-4 bg-purple-600 text-white rounded-2xl font-bold hover:bg-purple-700 transition-all">Verify Code</button>
                    </form>
                )}

                {isOtpSubmitted && (
                    <form onSubmit={onSubmitNewPassword} className="text-center">
                        <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6"><Lock size={32} /></div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">New Password</h2>
                        <div className="relative mb-6">
                            <Lock className="absolute left-4 top-3.5 text-slate-400" size={20} />
                            <input type="password" placeholder="New Password" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-purple-500" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                        </div>
                        <button className="w-full py-4 bg-purple-600 text-white rounded-2xl font-bold hover:bg-purple-700 transition-all">Set Password</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
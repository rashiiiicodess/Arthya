import bcrypt from "bcrypt";
import  jwt  from 'jsonwebtoken';
import userModal from "../models/userModel.js";
import transporter from "../config/nodemailer.js";
export const Register=async(req,res)=>{
    const{name,email,password}=req.body;
    if(!name || !password || !email)
        return res.status(400).json({
    success:false,
    message:"Missing Details. Please provide name, email, and password."

    })
    try{
        const existingUser=await userModal.findOne({email})
        if(existingUser)
        {
            return res.status(409).json({ success: false, message: "User already exists" });
        }
        const hashed=await bcrypt.hash(password,10);

        const user = new userModal({
            name,
            email,
            password: hashed
        });
        await user.save();

        const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'});
        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:'lax',
            path:'/',
            maxAge:7 * 24 * 60 * 60 * 1000

        })
        const mailOptions={
            from:process.env.SENDER_EMAIL,
            to:email,
            subject: 'Welcome to Arthya | Your Financial Clarity Starts Here',
    html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; color: #1a202c;">
            <div style="background-color: #7c3aed; padding: 30px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px; letter-spacing: -0.5px;">Arthya</h1>
            </div>
            
            <div style="padding: 40px; background-color: #ffffff;">
                <h2 style="color: #2d3748; margin-top: 0;">Welcome aboard, ${name}!</h2>
                <p style="font-size: 16px; line-height: 1.6; color: #4a5568;">
                    Thank you for choosing <strong>Arthya</strong>. You've taken the first step toward making a smarter, data-backed decision for your education financing.
                </p>
                
                <div style="background-color: #f7fafc; border-left: 4px solid #7c3aed; padding: 20px; margin: 25px 0;">
                    <p style="margin: 0; font-weight: 600; color: #2d3748;">Account Details:</p>
                    <p style="margin: 5px 0 0 0; color: #718096; font-size: 14px;">Email: ${email}</p>
                </div>

                <p style="font-size: 16px; line-height: 1.6; color: #4a5568;">
                    <strong>With Arthya, you can now:</strong>
                </p>
                <ul style="padding-left: 20px; color: #4a5568; line-height: 1.8;">
                    <li>Compare 5+ major banks with real-time interest rates.</li>
                    <li>Uncover hidden costs like capitalized interest.</li>
                    <li>Simulate your future career tranches for realistic repayment.</li>
                </ul>

                <p style="margin-top: 30px; font-size: 14px; color: #a0aec0; text-align: center;">
                    Please proceed to verify your account on the dashboard to unlock all features.
                </p>
            </div>

            <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #edf2f7;">
                <p style="font-size: 12px; color: #94a3b8; margin: 0;">&copy; 2026 Arthya Decision Engine. All rights reserved.</p>
            </div>
        </div>
    `
        }
        await transporter.sendMail(mailOptions);

        res.status(200).json({success:true ,message:"User registered successfully"});

    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json({ 
            success: false, 
            message: err.message 
        });
    }

}

export const login=async(req,res)=>{
    const{email,password}=req.body;

    if(!email ||!password)
    {
         return res.status(400).json({
    success:false,
    message:"Missing Details. Please provide name, email, and password."})

    }
    try{
        const user=await userModal.findOne({email});
        if(!user)
        {
           return res.status(401).json({ success: false, message: "Invalid email or password" });
        } 
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({ 
            success: true, 
            message: "Logged in successfully" 
        });

    }
    catch(err)
    {
        return res.status(500).json({ success: false, message: err.message });
    }
}

export const logout=async(req,res)=>{
    try{
        res.clearCookie('token',{
             httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            
        })
        return res.status(200).json({ 
            success: true, 
            message: "Logged out successfully" 
        });

    }
    catch(err)
    {
        return res.status(500).json({ 
            success: false, 
            message: err.message 
        });
    }
}

export const sendVerifyOtp=async(req,res)=>{
    try{
        const {userId}=req.body;

        const user=await userModal.findById(userId);
        if(user.isAccountVerified)
        {
            return res.status(400).json({ success: false, message: "Account already verified" });
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000));
            user.verifyOtp = otp;
        user.verifyOtpExpiresAt = Date.now() + 24 * 60 * 60 * 1000; // Valid for 24 hours
        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Verify Your Identity - Arthya',
            html: `
        <div style="font-family: 'Inter', sans-serif; text-align: center; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
            <h2 style="color: #7c3aed;">Secure Verification</h2>
            <p>Use the code below to verify your account and access the loan decision engine.</p>
            <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #111; margin: 20px 0;">
                ${otp}
            </div>
            <p style="color: #666; font-size: 14px;">This code will expire in 24 hours. If you did not request this, please ignore this email.</p>
        </div>
    `
            };
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ 
            success: true, 
            message: "Verification OTP sent to your email" 
        });
       
    }
    catch(err)
    {
        return res.status(500).json({ success: false, message: err.message });
    }
}

export const verifyEmail=async(req,res)=>{
    const {userId,otp}=req.body;
    if(!userId ||!otp)
    {
        return res.status(400).json({ success: false, message: "Missing Details" });
    }
        try{

        const user = await userModal.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }
        if (user.verifyOtpExpiresAt < Date.now()) {
            return res.status(400).json({ success: false, message: "OTP Expired" });
        }
        user.isAccountVerified = true;
        user.verifyOtp = ''; // Clear the OTP so it can't be used again
        user.verifyOtpExpiresAt = 0;

        await user.save();
           return res.status(200).json({ 
            success: true, 
            message: "Email verified successfully" 
        });

        }
        catch(err)
        {
             return res.status(500).json({ success: false, message: err.message });
        }
    
}

export const isAuthenticated = async (req, res) => {
    try {
        return res.status(200).json({ success: true });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
export const sendResetOtp=async(req,res)=>{
    const {email}=req.body;
    if(!email)
       return res.status(400).json({ success: false, message: "Email is required" });
    try{
        const user=await userModal.findOne({email});
        if(!user)
            return res.status(404).json({ success: false, message: "User not found" });
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        
        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
              subject: 'Action Required: Reset Your Arthya Password',
             html: `
        <div style="font-family: 'Inter', sans-serif; background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
            <h3 style="color: #dc2626;">Password Reset Request</h3>
            <p>We received a request to reset your password. Use the following code to proceed:</p>
            <div style="background: #fff; padding: 15px; display: inline-block; font-size: 24px; font-weight: bold; border: 2px dashed #7c3aed;">
                ${otp}
            </div>
            <p style="margin-top: 20px;"><strong>Note:</strong> This code is valid for only 15 minutes.</p>
            <p style="font-size: 12px; color: #888;">If you didn't ask for this change, your account is still secure. No further action is required.</p>
        </div>
    `
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ success: true, message: "Reset OTP sent to your email" });
    }
    catch(err)
    {
        return res.status(500).json({ success: false, message: err.message });
    }
}

export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(400).json({ success: false, message: "Email, OTP, and new password are required" });
    }

    try {
        const user = await userModal.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.resetOtp === "" || user.resetOtp !== otp) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

        if (user.resetOtpExpireAt < Date.now()) {
            return res.status(400).json({ success: false, message: "OTP Expired" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetOtp = "";
        user.resetOtpExpireAt = 0;

        await user.save();

        return res.status(200).json({ success: true, message: "Password has been reset successfully" });

    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}
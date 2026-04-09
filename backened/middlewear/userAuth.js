import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";

const userAuth=async(req,res,next)=>{
    const {token}=req.cookies;
    console.log("Token from middleware:", token);

    if(!token)
    {
        return res.status(401).json({ 
            success: false, 
            message: "Not Authorized. Please login again." 
        });
    }
    try{

        const tokenDecoded=jwt.verify(token,process.env.JWT_SECRET);
        if(tokenDecoded.id)
        {
            if (!req.body) {
                req.body = {};
            }
            req.body.userId=tokenDecoded.id;
        }
        else{
            return res.status(401).json({ 
                success: false, 
                message: "Not Authorized. Please login again." 
            })
        }
        next();
    }
    catch(err)
    {
        return res.status(401).json({ 
            success: false, 
            message: err.message 
        });
    }
}

export default userAuth;
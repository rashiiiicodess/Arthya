import mongooose from "mongoose";

const userSchema=new mongooose.Schema({
    name:{
        type:String,
        required:true
    },
     email:{
        type:String,
        required:true,
        unique:true

    },
    password:{
        type:String,
        required:true,
      

    },
    verifyOtp:{
        type:String,
        default:''
    },
    verifyOtpExpiresAt:{
        type:Number,
        default:0
    },
    isAccountVerified:{
        type:Boolean,
        default:false
    },
    resetOtp:{
        type:String,
        default:' '
    },
    resetOtpExpireAt:{
        type:Number,
        default:0
    }
    ,
    lastAnalysisInput: {
    type: Object,
    default: null // Will store totalLoan, salary, tenure, etc.
  }

})
const userModal=mongooose.models.user ||mongooose.model('user',userSchema);
export default userModal;
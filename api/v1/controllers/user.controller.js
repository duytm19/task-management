const md5 = require("md5")
const User = require("../models/user.model")
const ForgotPassword = require("../models/forgot-password.models")
const generateHelper = require("../../../helpers/generate")
const sendMailHelper = require("../../../helpers/sendEmail")
// [POST] /api/v1/users/register
module.exports.register = async (req,res)=>{
    req.body.password =  md5(req.body.password)
    const existEmail = await User.findOne({
        email:req.body.email,
        deleted:false
    })

    if(existEmail){
        res.json({
            code:400,
            message:"Email is existence!"
        })
    }
    else{
        const user = new User ({
            fullName: req.body.fullName,
            email: req.body.email,
            password: req.body.password
        })

        user.save()
        const token =user.token
        res.cookie("token",token)
        res.json({
            code:200,
            message:"Create new user successfully!",
            token:token
        })
    }

}

// [POST] /api/v1/users/login
module.exports.login = async(req,res)=>{
    const email= req.body.email
    const password = req.body.password

    const user = await User.findOne({
        email:email,
        deleted:false
    })

    if(!user){
        res.json({
            code:400,
            message:"Email is not existence"
        })
        return
    }

    if(md5(password)!== user.password){
        res.json({
            code:400,
            message: "Password is incorrect!"
        })
        return
    }
    const token =user.tokenUser
    res.cookie("token",token)
    res.json({
        code:200,
        message:"Login successfully!",
        token:token
    })
}

// [POST] /api/v1/users/password/forgot

module.exports.forgotPassword =async(req,res)=>{
    const email = req.body.email

    const user = await User.findOne({
        email:email,
        deleted: false
    })

    if(!email){
        res.json({
            code:400,
            message:"Account is not existence !!!"
        })

        return
    }

    const otp = generateHelper.generateRandomNumber(8)

    const objectForgotPassword ={
        email: email,
        otp:otp,
        expireAt:Date.now()
    }

    const forgotPassword = new ForgotPassword(objectForgotPassword)

    await forgotPassword.save()

    //Send OTP
    const subject = "OTP CODE TO RESET YOUR PASSWORD"
    const html = `<h3> OTP CODE TO RESET YOUR PASSWORD: </h3>
    <b style="color: red;">${otp}</b>.<h3>The expired time is: 3 minutes</h3>
    `
    sendMailHelper.sendMail(email,subject,html)
    //End Send OTP

    res.json({
        code:200,
        message:'Send otp successfull, please check your email'
    })
}
// [POST] /api/v1/users/password/otp
module.exports.otpPassword =async(req,res)=>{
    const email = req.body.email
    const otp = req.body.otp

    const result = await ForgotPassword.findOne({
        email:email,
        otp:otp
    })

    if(!result){
        res.json({
            code:400,
            message:"Your otp is not available!"
        })
        return
    }
    
    const user = await User.findOne({
        email:email
    })

    res.cookie("tokenUser", user.tokenUser)
    res.json({
        code:200,
        message:"Authenticate you OTP successfully"
    })
}
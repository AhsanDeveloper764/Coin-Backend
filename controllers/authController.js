const Joi = require("joi");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const UserDto = require("../dto/index");
const JWTService = require("../services/JWTService");
const Token = require("../models/token");
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;

const authController = {
    async register(req,resp,next){
        // validate user input  
        console.log("Incoming register data:", req.body);
        const userRegisterSchema = Joi.object({
            username:Joi.string().min(5).max(30).required(),
            name:Joi.string().max(30).required(),
            email:Joi.string().email().required(),
            password:Joi.string().pattern(passwordPattern).required(),
            confirmPassword:Joi.ref("password")     
        });
        // Agar user galat data bheje, toh validation error return ho jayega.
        const {error} = userRegisterSchema.validate(req.body);
        // if error in validation --> return error via middleware
        if(error){
            return next(error)
        }
        // if email or username is already registered ---> return an error
        const {username,name,email,password} = req.body;
        try{
            const eamilInUse = await User.exists({email});
            const usernameInUse = await User.exists({username}); 
            if(eamilInUse){
                const error = {
                    status : 409,
                    message : "Email Already Used"
                }
                return next(error)
            }

            if(usernameInUse){
                const error = {
                    status : 409,
                    message : "UserName not Available,Choose another Username!"
                }
                return next(error)  // middleware ma call krwadengay
            }
        }catch(error){
            return next(error);
        }
        // Password Hashing
        // Password ko hash karke save karte hain (plain text kabhi store nahi karna).
        const HashedPassword = await bcrypt.hash(password,10); //10 ka mtlb sorting round
        // store user data in database
        let accessToken;
        let refreshToken;
        let data;
        // New user DB mai save hota hai.
        try{
            const userToRegister = new User({
               username:username,
               email:email,
               name:name,
               password:HashedPassword
            })
            data = await userToRegister.save();
            // Token Generation;
            // username:data.username;
            accessToken = JWTService.signAccessToken({_id :data._id},"30m");  // payload and expiry time 
            refreshToken = JWTService.signRefreshToken({_id:data._id},"60m");  //  payload and expiry time 
        }
        catch(error){
            return next(error)
        }
        // Store refreshToken in db
        await JWTService.storeRefreshToken(refreshToken,data._id);
        // ab hum cookie ma apnay token send kreingay
        resp.cookie("accessToken",accessToken,{
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly:true
        })

        resp.cookie("refreshToken",refreshToken,{
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly:true,
        })

        //  Finally return responce
        const dto = new UserDto(data)
        return resp.status(200).json({Data:dto,auth:true})
    },
    async login(req,resp,next) {
        // validate user Input
        // if validation Error , return error
        // if no any error match username and password
        // at the end return responce   

        // We expect data to be in such shape
        const userLoginSchema = Joi.object({
            username:Joi.string().min(5).max(30).required(),
            password:Joi.string().pattern(passwordPattern).required()
        });

        const {error} = userLoginSchema.validate(req.body);
        if(error){
            return next(error)
        }

        const {username,password} = req.body;
        let user;
        try{
            user = await User.findOne({username:username});
            if(!user){
                const error = {
                    status:401,
                    message:"Invalid Username"
                }
                return next(error)
            }
            // match password
            // req.body.password -> hash -> match
            const match = await bcrypt.compare(password,user.password);
            if(!match){
                const error = {
                    status:401,
                    message:"Your Password Does Not Match"
                }
                return next(error)
            }
        }catch(error){
            return next(error)
        }

        const accessToken = JWTService.signAccessToken({_id:user._id},"30m")
        const RefreshTokenNew = JWTService.signRefreshToken({_id:user._id},"60m")
        // Update Refresh Token in Database
        
        await Token.updateOne(
            { userId: user._id },
            { token: RefreshTokenNew },
            { upsert: true }
        );
        // Refresh token ko DB me save/update karte hain.
        // upsert: true ka matlab:
        // Agar userId ka record exist karta hai → update kar do.
        // Agar nahi karta → naya record bana do.

        resp.cookie("accessToken", accessToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true,
        })
        // Tokens ko cookies me save karte hain taake frontend ko bar bar bhejne ki zarurat na ho.
        // httpOnly: true → iska matlab ye cookies browser JS se access nahi kar sakta (security ke liye).
        resp.cookie("refreshToken",RefreshTokenNew,{
            maxAge:1000 * 60 * 60 * 24,
            httpOnly:true,
        })
        const dto = new UserDto(user)
        return resp.status(201).json({Data:dto,auth:true})
    },
    async logOut(req,resp,next){
        // Delete Refresh TOken from DataBase
        const {refreshToken} = req.cookies;
        try{
            await Token.deleteOne({token:refreshToken})
        }catch(error){
            return next(error)
        }
        // delete Cookie
        resp.clearCookie("accessToken");
        resp.clearCookie("refreshToken");
        // responce 
        resp.status(200).json({user:null,auth:false})
        // is responce say hmein client side par pta chlaga user authentic hay ya UnAuthentic hay
    },
    async Refresh(req,resp,next){
        // get refreshtoken from cookies
        // verify generation
        const OriginalRefreshToken = req.cookies.refreshToken;
        console.log("Refresh Token from Cookie:", OriginalRefreshToken);
        let id;
        try{
            id = JWTService.verifyRefreshToken(OriginalRefreshToken)._id
            console.log("Decoded Refresh Token ID:", id);
        }
        catch(e){
            const error = {
                status: 401,
                message:"Unauthorized"
            }
            return next(error)
        }

        const match = await Token.findOne({userId: id, token:OriginalRefreshToken})
        console.log("DB Token Found:", match ? match.token : null);
        if(!match){
            const error = {
                status:401,
                message:"Unauthorized"
            }
            return next(error)
        }
        // generate new token
        // update DB, return responce
        try{
            const accessToken = JWTService.signAccessToken({_id:id},"30m")
            const refToken = JWTService.signRefreshToken({_id:id},"60m")
            await Token.updateOne({ userId: id }, { token: refToken });
            console.log("DB Refresh Token Updated");
            console.log("Refresh Successful for user:", id);
            
            resp.cookie("accessToken",accessToken,{
                maxAge: 1000 * 60 * 60 * 24,
                httpOnly:true
            })
            resp.cookie("refreshToken",refToken,{
                maxAge: 1000 * 60 * 60 * 24,
                httpOnly:true
            })
        }
        catch(error){
            return next(error)   
        }
        const user = await User.findOne({_id:id});
        const Userdto = new UserDto(user)
        resp.status(200).json({user:Userdto,auth:true})
    }
}
module.exports = authController

// user input ka jo password hota hay hum usko hash krwatay hein security purpose
// next controller ke andar hota hai taake error ko middleware (errorHandler.js) tak bheja ja sake.
// Controller khud middleware nahi hai, lekin usko next parameter milta hai jisse wo dusre middleware se connect hota hai.
// Tumhare code me next ka main kaam hai → error ko forward karna errorHandler middleware tak.
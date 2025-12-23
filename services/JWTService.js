const jwt = require("jsonwebtoken");
const {Refresh_Token_Secret,Access_Token_Secret} = require("../config/index")
const RefreshToken = require("../models/token")

class JWTService {
    // sign access token
    static signAccessToken(payload,expiryTime){
        return jwt.sign(payload,Access_Token_Secret,{expiresIn: expiryTime});
    }
    // sign refresh token
    static signRefreshToken(payload,expiryTime){
        return jwt.sign(payload,Refresh_Token_Secret,{expiresIn: expiryTime});
    }
    // verfiy access token
    static verifyAccessToken(token){
        return jwt.verify(token,Access_Token_Secret)
    }
    // verfiy refresh token
    static verifyRefreshToken(token){
        return jwt.verify(token,Refresh_Token_Secret)
    }
    //Store RefreshToken
    static async storeRefreshToken(token,userId){
        try{
            const newToken = new RefreshToken({
                token:token,
                userId:userId
            })
            await newToken.save();
        }
        catch(err){
            console.log("Error Occured",err);
        }
    }
}

module.exports = JWTService;
const JWTService = require("../services/JWTService")
const user = require("../models/user")
const Userdto = require("../dto/index");

const auth = async (req,resp,next) => {
    try{
        // Refresh access token validation
        const {refreshToken,accessToken} = req.cookies;
        if(!refreshToken || !accessToken){
            const error = {
                status:401,
                message:"Unauthorized"    
            }
            return next(error)
        }

        let _id;
        try{
           _id = JWTService.verifyAccessToken(accessToken)._id;
           //  _id kahan se aati hai?
           //  Jab aap user login / signup karte ho aur usko JWT token generate karke dete ho, tab aap us token ke 
           //  andar user ki kuch info encode (sign) karte ho.
           //  jwt service file ma jo payload hay basically token kay andaar ye payload hamara data hay jo encode hua wa hay
        }catch(error){
            return next(error)
        }

        let User;
        try {
            User = await user.findOne({_id:_id})  // ye jo id hay wo hmein verification kay bad mili hay 
        } catch(error) {
            return next(error)
        }

        const userdto = new Userdto(User); 
        req.user = userdto;
        next() 
        // Database ka user object (jo bada aur sensitive data hota hai, jaise password, tokens etc.)
        // ko DTO (Data Transfer Object) me convert karte hain.
        // DTO ka kaam hota hai sirf zaroori fields bhejna (e.g. name, email, id).
        // Fir req.user me store kar dete hain taake baaki controller me use ho sake.
        // Agar sab sahi chal gaya to request ko agle handler pe bhej do.
        // Ab controller ko pata hai ke req.user me authenticated user ka data hai.
    }
    catch(error){
        return next(error)
    }
}
module.exports = auth

// // middle ware 1 asa function hota hay jo req or resp kay complete honay par run hoga
// // ye middleware ye check krega kay iskay jo tokens hein wo valid hein ya nhi or user authentic hay ya nhi 

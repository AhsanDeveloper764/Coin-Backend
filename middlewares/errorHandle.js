const {ValidationError} =  require("joi")
// joi library me ek special class hai ValidationError, usko destructure karke laa liya.
//Joi validation karte waqt agar galti hoti hai (jaise email galat format, required field missing), to wo isi class ka error throw karta hai.
const errorHandler = (error,req,resp,next) => {
    // default error
    let status = 500;
    let data = {
        message:"Internal Server Error"
    }//Agar kuch samajh na aaye to default 500 aur generic message bhejna hai.
    if(error instanceof ValidationError){
        status = 401;
        data.message = error.message;
        return resp.status(status).json(data)
    } //joi kee trf say koi error ahay tw ye block handle krlega     
    if(error.status){
        status = error.status;
    }//Step C: Agar kisi ne manually error banaya ho
    //or jab na hee validation wala eror hay na hee status wala or na hee messge ka tw is condition ma default error ahaga jo set kra hay
    if(error.message){
        data.message = error.message
    }//Agar koi error object ke sath message hai to use return karo Warna default "Internal Server Error" hi rahega.
    return resp.status(status).json(data)
}
module.exports = errorHandler

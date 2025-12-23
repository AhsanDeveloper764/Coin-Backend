const dotenv = require("dotenv").config()
//config it's a method of dotenv

const PORT = process.env.PORT;
const CONNECTION_STRING = process.env.CONNECTION_STRING
const Access_Token_Secret = process.env.Access_Token_Secret
const Refresh_Token_Secret = process.env.Refresh_Token_Secret
const BACKEND_SERVER_PATH = process.env.BACKEND_SERVER_PATH
const cloudName = process.env.cloudName;
const apikey = process.env.apikey;
const apiSecret = process.env.apiSecret;

module.exports = {
    PORT,
    CONNECTION_STRING,
    Access_Token_Secret,
    Refresh_Token_Secret,
    BACKEND_SERVER_PATH,
    cloudName,
    apikey,
    apiSecret
}
 
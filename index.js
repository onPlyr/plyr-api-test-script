const { generateHmacSignature } = require("./utils/hmacUtils");
const axios = require("axios");
require("dotenv").config();

const apiEndpoint = process.env.PLYR_API_ENDPOINT;
const apiKey = process.env.PLYR_API_KEY;
const secretKey = process.env.PLYR_API_SECRET;


/* 
    [POST] Authenication - Login
    params:
        plyrId
        otp
        deadline
    return:
        sessionJwt
        plyrId
        nonce
        gameId
        primaryAddress
        mirrorAddress
*/
async function userLogin(plyrId, otp, deadline) {
    const timestamp = Date.now().toString();

    let body = {
        plyrId: plyrId, // Always be a lowercase string (autoconvert)
        otp: otp, // 2FA token
        deadline: deadline ? deadline : null, // Null = Date.now() + 1000 * 60 * 60 * 24; << 24 hrs session
    }

    let hmac = generateHmacSignature(timestamp, body, secretKey);

    try {
        let ret = await axios.post(
            apiEndpoint + "/api/user/login",
            body,
            {
                headers: {
                    apikey: apiKey,
                    signature: hmac,
                    timestamp: timestamp,
                },
            }
        );
        console.log("status", ret.status);
        console.log("ret", ret.data);
    } catch (error) {
        console.log("status", error.response.status);
        console.log(error.response.data);
    }
}

/* 
    [POST] Authentication - Logout
    Param: sessionJwt
*/
async function userLogout(sessionJwt) {
    const timestamp = Date.now().toString();

    let body = {
        sessionJwt: sessionJwt, // logged in sessionJwt
    }

    let hmac = generateHmacSignature(timestamp, body, secretKey);

    try {
        let ret = await axios.post(
            apiEndpoint + "/api/user/logout",
            body,
            {
                headers: {
                    apikey: apiKey,
                    signature: hmac,
                    timestamp: timestamp,
                },
            }
        );
        console.log("status", ret.status);
        console.log("ret", ret.data);
    } catch (error) {
        console.log("status", error.response.status);
        console.log(error.response.data);
    }
}


/* 
    [POST] Session - check user's sessionJWT  //
    param: sessionJwt
*/
async function checkSessionJwt(sessionJwt) {
    const timestamp = Date.now().toString();

    let body = {
       sessionJwt: sessionJwt
    }

    let hmac = generateHmacSignature(timestamp, body, secretKey);

    try {
        let ret = await axios.post(
            apiEndpoint + "/api/user/session/verify",
            body,
            {
                headers: {
                    apikey: apiKey,
                    signature: hmac,
                    timestamp: timestamp,
                },
            }
        );
        console.log("status", ret.status);
        console.log("ret", ret.data);
    } catch (error) {
        console.log("status", error.response.status);
        console.log(error.response.data);
    }
}

/* [GET] UserInfo 
    Can use both PLYR[ID] or Primary address
    Example:
    /api/user/info/fennec2
    or /api/user/info/0xbb0ca470620348c8297281C3bA3740b02879a327

    param: searchTxt
*/
async function getUserInfo(searchTxt) {
    const timestamp = Date.now().toString();
    let hmac = generateHmacSignature(timestamp, {}, secretKey);

    try {
        let ret = await axios.get(
            apiEndpoint + "/api/user/info/" + searchTxt,
            {
                headers: {
                    apikey: apiKey,
                    signature: hmac,
                    timestamp: timestamp,
                },
            }
        );
        console.log("status", ret.status);
        console.log("ret", ret.data);
    } catch (error) {
        console.log("status", error.response.status);
        console.log(error.response.data);
    }
}

const args = process.argv.splice(2);

// node index.js login fennec2 123456
if (args[0] == 'login') {
    userLogin(args[1], args[2], args[3]);

// node index.js logout eyJhbGciOiJFUzI1N...
} else if (args[0] == 'logout') {
    userLogout(args[1]);

// node index.js check eyJhbGciOiJFUzI1N...
} else if (args[0] == 'verifyJwt') {
    checkSessionJwt(args[1]);
}
// node index.js info fennec2
else if (args[0] == 'info') {
    getUserInfo(args[1]);
}
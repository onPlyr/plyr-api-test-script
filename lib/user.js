const { generateHmacSignature } = require("../utils/hmacUtils");
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
async function userLogin(plyrId, otp, expiresIn, gameId) {
    const timestamp = Date.now().toString();

    let body = {
        plyrId: plyrId, // Always be a lowercase string (autoconvert)
        otp: otp, // 2FA token
        expiresIn: expiresIn ? expiresIn : null, // In second (integer),  Null = '86400s' << 24 hrs by default
        gameId: gameId,
        //uid: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        // uid is a random string of 15 characters
    }

    console.log("body", body);

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
        console.dir(error, { depth: null });
    }
}
async function userLoginAndApprove(plyrId, gameId, tokenName, amount, expiresIn, otp) {
    const timestamp = Date.now().toString();

    let body = {
        plyrId: plyrId,
        gameId: gameId,
        otp: otp,
        tokens: [tokenName],
        amounts: [amount],
        expiresIn: expiresIn ? expiresIn : null, // In second (integer),  Null = '86400s' << 24 hrs by default
        //uid: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    }

    console.log("body", body);


    let hmac = generateHmacSignature(timestamp, body, secretKey);

    try {
        let ret = await axios.post(
            apiEndpoint + "/api/user/loginAndApprove",
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
        console.dir(error, { depth: null });
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
        console.dir(error, { depth: null });
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
        console.dir(error, { depth: null });
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
    console.log("timestamp", timestamp);
    let hmac = generateHmacSignature(timestamp, {}, secretKey);
    console.log("hmac", hmac);
    try {
        let ret = await axios.get(
            apiEndpoint + "/api/user/info/" + searchTxt + '/',
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
        console.log("stauts", error.response.data);
        //console.dir(error, { depth: null });
    }
}

/* [GET] User Balance 
    Can use both PLYR[ID] or Primary address
    Example:
    /api/user/balance/fennec2
    or /api/user/balance/0xbb0ca470620348c8297281C3bA3740b02879a327 (Primary address)

    param: searchTxt
*/
async function getUserBalance(searchTxt, tokenName) {
    const timestamp = Date.now().toString();
    let hmac = generateHmacSignature(timestamp, {}, secretKey);

    try {
        let ret = await axios.get(
            apiEndpoint + "/api/user/balance/" + searchTxt + '/' + (tokenName ? tokenName : ''),
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
        console.dir(error, { depth: null });
    }
}

/* [GET] avatar 
    Get user avatar / return default avatar if not set
    Example:
    /api/user/avatar/fennec2
    
    param: plyrId
*/
async function getAvatar(plyrId) {
    const timestamp = Date.now().toString();
    let hmac = generateHmacSignature(timestamp, {}, secretKey);

    try {
        let ret = await axios.get(
            apiEndpoint + "/api/user/avatar/" + plyrId,
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
        console.dir(error, { depth: null });
    }
}

async function getAvatars(plyrId1, plyrId2) {
    const timestamp = Date.now().toString();
    let body = {
        plyrIds: [plyrId1, plyrId2] // Can add more plyrIds like [plyrId1, plyrId2, plyrId3]
    }

    let hmac = generateHmacSignature(timestamp, body, secretKey);

    try {
        let ret = await axios.post(
            apiEndpoint + "/api/user/avatars",
            body,
            {
                headers: {
                    apikey: apiKey,
                    signature: hmac,
                    timestamp: timestamp,
                },
            },
            
        );
        console.log("status", ret.status);
        console.log("ret", ret.data);
    } catch (error) {
        console.dir(error, { depth: null });
    }
}

module.exports = { userLogin, userLogout, checkSessionJwt, getUserInfo, getAvatar, getAvatars, userLoginAndApprove, getUserBalance };
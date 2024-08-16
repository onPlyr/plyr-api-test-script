const { generateHmacSignature } = require("./utils/hmacUtils");
const axios = require("axios");
require("dotenv").config();

const apiEndpoint = process.env.PLYR_API_ENDPOINT;
const apiKey = process.env.PLYR_API_KEY;
const secretKey = process.env.PLYR_API_SECRET;


/* 
    [POST] Authenication - Login
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
        console.log("ret", ret.status);
        console.log("ret", ret.data);
    } catch (error) {
        console.log(error.response.data);
    }
}

/* 
    [POST] Session - check user's sessionJWT  //

/* 
    [POST] Authentication - Logout - Please don't use it yet. Maybe need to remove plyrId parameter.
*/
async function userLogout(plyrId, sessionJwt) {
    const timestamp = Date.now().toString();

    let body = {
        plyrId: plyrId, // Always be a lowercase string (autoconvert)
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
        console.log("ret", ret.status);
        console.log("ret", ret.data);
    } catch (error) {
        console.log(error.response.data);
    }
}


// To Implement //
async function checkSessionJwt(sessionJwt) {
    
}

// [GET] UserInfo  //
/*
    Can use both PLYR[ID] or Primary address
    Example:
    /api/user/info/fennec1
    or /api/user/info/0xbb0ca470620348c8297281C3bA3740b02879a327
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
        console.log("ret", ret.status);
        console.log("ret", ret.data);
    } catch (error) {
        console.log(error.response.data);
    }
}


//getUserInfo('fennec2');

//userLogin('fennec2', '460225');

// Please don't use userLogout() yet.
//userLogout('fennec2', 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJwbHlySWQiOiJmZW5uZWMyIiwibm9uY2UiOjIsImRlYWRsaW5lIjoxNzIzOTA4MTUyMDM0LCJnYW1lSWQiOiJ0ZXN0ZXIiLCJwcmltYXJ5QWRkcmVzcyI6IjB4QTdGQzA1ZDVjOGU5ZDU0ZGJhNzMyQmIxQUQ2ODBjNTBhNmUwZDJjYyIsIm1pcnJvciI6IjB4MDc0N2FCMzNkZTFGOTBkMGY3MTIyODYwNTk1ZWZDNDU4NUVlZTA3MyIsImlhdCI6MTcyMzgyMTc1Mn0.zVgNxpwzeiyJeg5Yg1bSB_JDvt53d7FP3aGEtd8eFVONGjR8VAnVX_IFVJmLKZToNAP-MpB9dHXconGWqUQ3FQ')



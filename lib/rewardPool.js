const { generateHmacSignature } = require("../utils/hmacUtils");
const axios = require("axios");

require("dotenv").config();

const apiEndpoint = process.env.PLYR_API_ENDPOINT;
const apiKey = process.env.PLYR_API_KEY;
const secretKey = process.env.PLYR_API_SECRET;

async function depositRewardPool(gameId, plyrId, sessionJwt, token, amount, expiresIn = 604800) { // ExpiresIn is in seconds
    const timestamp = Date.now().toString();

    // startTime need to be at least 60 seconds in the future
    const startTime = (Math.floor(Date.now() / 1000) + 40).toString(); // seconds // add 40 seconds to timestamp
    // endTime need to be at least 60 seconds in the future
    const endTime = (Math.floor((Date.now() + expiresIn * 1000) / 1000) + 40).toString(); // seconds // add 40 seconds to timestamp


    let body = {
        gameId: gameId,
        plyrId: plyrId,
        sessionJwt: sessionJwt,
        token: token,
        amount: amount,
        startTime: startTime,
        endTime: endTime,
    }

    console.log("body", body);

    let hmac = generateHmacSignature(timestamp, body, secretKey);

    try {
        let ret = await axios.post(
            apiEndpoint + "/api/game/rewardPool/deposit",
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
        //console.log("status", error.response.status);
        console.dir(error.response, { depth: null });
    }

}

async function claimableAmounts(gameId, tokenId) {
    const timestamp = Date.now().toString();

    let hmac = generateHmacSignature(timestamp, {}, secretKey);


    try {
        let ret = await axios.get(
            apiEndpoint + "/api/game/rewardPool/claimableAmounts?gameId=" + gameId + "&tokens=" + tokenId,
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
        //console.log("status", error.response.status);
        console.dir(error, { depth: null });
    }
}

// Must claim less than the claimable amount or else it will fail
async function claimRewardPool(plyrId, token, amount) { 
    const timestamp = Date.now().toString();
    const body = {
        plyrId: plyrId,
        token: token,
        amount: amount,
    }

    let hmac = generateHmacSignature(timestamp, body, secretKey);

    try {
        let ret = await axios.post(
            apiEndpoint + "/api/game/rewardPool/claim",
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
        //console.log("status", error.response.status);
        console.dir(error.response.data, { depth: null });
    }
}

module.exports = { depositRewardPool, claimableAmounts, claimRewardPool };

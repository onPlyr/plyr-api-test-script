const { generateHmacSignature } = require("../utils/hmacUtils");
const axios = require("axios");

require("dotenv").config();

const apiEndpoint = process.env.PLYR_API_ENDPOINT;
const apiKey = process.env.PLYR_API_KEY;
const secretKey = process.env.PLYR_API_SECRET;

async function depositRewardPool(gameId, plyrId, sessionJwt, token, amount, expiresIn = 604800) { // ExpiresIn is in seconds


    // // startTime need to be at least 60 seconds in the future
    //const startTime = (Math.floor(Date.now() / 1000) + 40).toString(); // seconds // add 40 seconds to timestamp
    // endTime need to be at least 60 seconds in the future
    //const endTime = (Math.floor((Date.now() + expiresIn * 1000) / 1000) + 40).toString(); // seconds // add 40 seconds to timestamp


    let body = {
        gameId: gameId,
        plyrId: plyrId,
        sessionJwt: sessionJwt,
        token: token,
        amount: amount,
        startTime: 0,
        endTime: 0,
    }

    const timestamp = Date.now().toString();

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

async function batchClaimRewardPool(plyrId, token, amount) {
    const timestamp = Date.now().toString();
    const body = {
        plyrIds: [plyrId],
        tokens: [token],
        amounts: [amount],
    }
    

    let hmac = generateHmacSignature(timestamp, body, secretKey);

    try {
        let ret = await axios.post(
            apiEndpoint + "/api/game/rewardPool/batchClaim",
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

async function runDepositLoop(gameId, plyrId, sessionJwt, token, amount, expiresIn = 604800, loopCount = 10000) {
    console.log(`Starting deposit loop: ${loopCount} iterations`);
    console.log(`Parameters: gameId=${gameId}, plyrId=${plyrId}, token=${token}, amount=${amount}`);

    let successCount = 0;
    let errorCount = 0;
    const startTime = Date.now();

    for (let i = 1; i <= loopCount; i++) {
        try {
            console.log(`\n--- Iteration ${i}/${loopCount} ---`);
            await depositRewardPool(gameId, plyrId, sessionJwt, token, amount, expiresIn);
            successCount++;

            // Add a small delay to avoid overwhelming the API
            if (i % 100 === 0) {
                console.log(`Progress: ${i}/${loopCount} completed. Success: ${successCount}, Errors: ${errorCount}`);
                await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay every 100 requests
            }

        } catch (error) {
            errorCount++;
            console.log(`Error in iteration ${i}:`, error.message);
        }
    }

    const endTime = Date.now();
    const totalTime = (endTime - startTime) / 1000; // Convert to seconds

    console.log(`\n=== LOOP COMPLETED ===`);
    console.log(`Total iterations: ${loopCount}`);
    console.log(`Successful requests: ${successCount}`);
    console.log(`Failed requests: ${errorCount}`);
    console.log(`Success rate: ${((successCount / loopCount) * 100).toFixed(2)}%`);
    console.log(`Total time: ${totalTime.toFixed(2)} seconds`);
    console.log(`Average time per request: ${(totalTime / loopCount).toFixed(3)} seconds`);
}

module.exports = { depositRewardPool, claimableAmounts, claimRewardPool, batchClaimRewardPool, runDepositLoop };

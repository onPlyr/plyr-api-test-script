const { generateHmacSignature } = require("../utils/hmacUtils");
const axios = require("axios");

require("dotenv").config();

const apiEndpoint = process.env.PLYR_API_ENDPOINT;
const apiKey = process.env.PLYR_API_KEY;
const secretKey = process.env.PLYR_API_SECRET;

async function registerIPP() {
    const timestamp = Date.now().toString();

    let body = {
        tokens: ['plyr', 'gamr'], // You can add more tokens here
        //sync: true
    }

    let hmac = generateHmacSignature(timestamp, body, secretKey);

    try {
        let ret = await axios.post(
            apiEndpoint + "/api/instantPlayPass/register",
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

        // Check Status of Queue Message, retry every 5 seconds until success //
        let taskId = ret.data.task.id;
        let roomId = null;
        // Let take a break a little bit. To let queue system process the task //
        //await new Promise(resolve => setTimeout(resolve, 2000));

        while (true) {
            // get roomId 
            hmac = generateHmacSignature(timestamp, {}, secretKey);
            ret = await axios.get(
                apiEndpoint + "/api/task/status/" + taskId,
                {
                    headers: {
                        apikey: apiKey,
                        signature: hmac,
                        timestamp: timestamp,
                    },
                }
            );
            console.log("queue ret", ret.data);
            if (ret.data.status !== 'PENDING') {
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        }


    } catch (error) {
        //console.log("status", error.response.status);
        console.log(error);
    }
}

async function revealClaimingCode(IPPSessionJWT) {
    const timestamp = Date.now().toString();

    let body = {
       sessionJwt: IPPSessionJWT
    }

    let hmac = generateHmacSignature(timestamp, body, secretKey);

    try {
        let ret = await axios.post(
            apiEndpoint + "/api/instantPlayPass/reveal/claimingCode",
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
        console.log(error);
    }
}

async function verifyClaimingCode(claimingCode) {
    const timestamp = Date.now().toString();

    let hmac = generateHmacSignature(timestamp, {}, secretKey);

    try {
        let ret = await axios.get(
            apiEndpoint + "/api/instantPlayPass/verify/claimingCode/" + claimingCode,
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
        console.log(error);
    }
}

// async function revealIPPPrivateKey(IPPSessionJWT) {
//     const timestamp = Date.now().toString();

//     let body = {
//        sessionJwt: IPPSessionJWT
//     }

//     let hmac = generateHmacSignature(timestamp, body, secretKey);

//     try {
//         let ret = await axios.post(
//             apiEndpoint + "/api/instantPlayPass/reveal/privateKey",
//             body,
//             {
//                 headers: {
//                     apikey: apiKey,
//                     signature: hmac,
//                     timestamp: timestamp,
//                 },
//             }
//         );
//         console.log("status", ret.status);
//         console.log("ret", ret.data);

//     } catch (error) {
//         //console.log("status", error.response.status);
//         console.log(error);
//     }
// }

module.exports = { registerIPP, revealClaimingCode,verifyClaimingCode };

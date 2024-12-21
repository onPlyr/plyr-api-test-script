const { generateHmacSignature } = require("../utils/hmacUtils");
const axios = require("axios");

require("dotenv").config();

const apiEndpoint = process.env.PLYR_API_ENDPOINT;
const apiKey = process.env.PLYR_API_KEY;
const secretKey = process.env.PLYR_API_SECRET;


async function createGameRoom(expiresIn = 86400) {



    const timestamp = Date.now().toString();

    let body = {
        expiresIn: expiresIn ? expiresIn : 86400, // Default 24 hrs

    }

    let hmac = generateHmacSignature(timestamp, body, secretKey);

    try {
        let ret = await axios.post(
            apiEndpoint + "/api/game/create",
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
                roomId = ret.data.taskData.result.roomId;
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

    } catch (error) {
        //console.log("status", error.response.status);
        console.dir(error, { depth: null });
    }

}

async function joinGameRoom(roomId, sessionJwt) {
    const timestamp = Date.now().toString();

    let body = {
        roomId: roomId,
        sessionJwts: [sessionJwt],
    }

    let hmac = generateHmacSignature(timestamp, body, secretKey);

    try {
        let ret = await axios.post(
            apiEndpoint + "/api/game/join",
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

        // Let take a break a little bit. To let queue system process the task //
        await new Promise(resolve => setTimeout(resolve, 2000));

        while (true) {

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
                console.log("join room success", ret.data);
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 5000));
        }

    } catch (error) {
        //console.log("status", error.response.status);
        console.dir(error, { depth: null });
    }

}

async function isJoinedGameRoom(roomId, plyrId) {
    const timestamp = Date.now().toString();

    let hmac = generateHmacSignature(timestamp, {}, secretKey);

    try {
        let ret = await axios.get(
            apiEndpoint + "/api/game/isJoined?roomId=" + roomId + "&plyrId=" + plyrId,
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

async function leaveGameRoom(roomId, sessionJwt) {
    const timestamp = Date.now().toString();

    let body = {
        roomId: roomId,
        sessionJwts: [sessionJwt],
    }

    let hmac = generateHmacSignature(timestamp, body, secretKey);

    try {
        let ret = await axios.post(
            apiEndpoint + "/api/game/leave",
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
        // Let take a break a little bit. To let queue system process the task //
        await new Promise(resolve => setTimeout(resolve, 2000));

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
                console.log("leave room success", ret.data);
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 5000));
        }

    } catch (error) {
        //console.log("status", error.response.status);
        console.dir(error, { depth: null });
    }

}


async function approveGameToken(plyrId, gameId, tokenName, amount, expiresIn, otp) {
    const timestamp = Date.now().toString();

    let body = {
        plyrId: plyrId,
        gameId: gameId,
        otp: otp,
        token: tokenName,
        amount: amount,
        expiresIn: expiresIn,
    }

    console.log("body", body);


    let hmac = generateHmacSignature(timestamp, body, secretKey);

    try {
        let ret = await axios.post(
            apiEndpoint + "/api/game/approve",
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
        console.dir(error, { depth: null });
    }

}

async function payGameRoom(roomId, sessionJwt, tokenName, amount) {
    const timestamp = Date.now().toString();

    let body = {
        roomId: roomId,
        sessionJwt: sessionJwt,
        token: tokenName,
        amount: amount,
    }

    let hmac = generateHmacSignature(timestamp, body, secretKey);

    try {
        let ret = await axios.post(
            apiEndpoint + "/api/game/pay",
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
        // Let take a break a little bit. To let queue system process the task //
        await new Promise(resolve => setTimeout(resolve, 2000));

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
                console.log("Pay to Room success", ret.data);
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 5000));
        }

    } catch (error) {
        //console.log("status", error.response.status);
        console.dir(error, { depth: null });
    }

}

async function batchPayGameRoom(roomId, sessionJwt1, sessionJwt2, tokenName, amount) {
    const timestamp = Date.now().toString();

    let body = {
        roomId: roomId,
        sessionJwts: [sessionJwt1, sessionJwt2], // Can add more sessionJwt like [sessionJwt1, sessionJwt2, sessionJwt3]
        tokens: [tokenName, tokenName], // Can add more token like ['token1', 'token2', 'token3']
        amounts: [amount, amount], // Can add more amount like [100, 200, 300]
    }

    let hmac = generateHmacSignature(timestamp, body, secretKey);

    try {
        let ret = await axios.post(
            apiEndpoint + "/api/game/batchPay",
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
        // Let take a break a little bit. To let queue system process the task //
        await new Promise(resolve => setTimeout(resolve, 2000));

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
                console.log("Batch Paysuccess", ret.data);
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 5000));
        }

    } catch (error) {
        //console.log("status", error.response.status);
        console.dir(error, { depth: null });
    }
}

async function earnGameRoom(roomId, plyrId, tokenName, amount) {
    const timestamp = Date.now().toString();

    let body = {
        roomId: roomId,
        plyrId: plyrId,
        token: tokenName,
        amount: amount,
        //sync: true,
    }

    let hmac = generateHmacSignature(timestamp, body, secretKey);

    try {
        let ret = await axios.post(
            apiEndpoint + "/api/game/earn",
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
        // Let take a break a little bit. To let queue system process the task //
        await new Promise(resolve => setTimeout(resolve, 2000));

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
                console.log("Earn from Game Room success", ret.data);
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 5000));
        }

    } catch (error) {
        //console.log("status", error.response.status);
        console.dir(error, { depth: null });
    }

}

async function batchEarnGameRoom(roomId, plyrId1, plyrId2, tokenName, amount) {
    const timestamp = Date.now().toString();

    let body = {
        roomId: roomId,
        plyrIds: [plyrId1, plyrId2], // Can add more plyrIds like [plyrId1, plyrId2, plyrId3]
        tokens: [tokenName, tokenName], // Can add more token like ['token1', 'token2', 'token3']
        amounts: [amount, amount], // Can add more amount like [100, 200, 300]
    }

    let hmac = generateHmacSignature(timestamp, body, secretKey);

    try {
        let ret = await axios.post(
            apiEndpoint + "/api/game/batchEarn",
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
        // Let take a break a little bit. To let queue system process the task //
        await new Promise(resolve => setTimeout(resolve, 2000));

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
                console.log("Batch Earn success", ret.data);
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 5000));
        }

    } catch (error) {
        //console.log("status", error.response.status);
        console.dir(error, { depth: null });
    }
}

async function endGameRoom(roomId) {
    const timestamp = Date.now().toString();

    let body = {
        roomId: roomId,

    }

    let hmac = generateHmacSignature(timestamp, body, secretKey);

    try {
        let ret = await axios.post(
            apiEndpoint + "/api/game/end",
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
        // Let take a break a little bit. To let queue system process the task //
        await new Promise(resolve => setTimeout(resolve, 2000));

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
                console.log("End Game Room success", ret.data);
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 5000));
        }

    } catch (error) {
        console.dir(error, { depth: null });
    }

}

async function getGameAllowance(plyrId, gameId, tokenName) {
    const timestamp = Date.now().toString();
    let hmac = generateHmacSignature(timestamp, {}, secretKey);
    console.log("Data", plyrId, gameId, tokenName);
    try {
        let ret = await axios.get(
            apiEndpoint + "/api/game/allowance/" + plyrId + "/" + gameId + "/" + tokenName,
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

async function revokeApproval(plyrId, gameId, tokenName, otp) {
    const timestamp = Date.now().toString();

    let body = {
        plyrId: plyrId,
        gameId: gameId,
        token: tokenName,
        otp: otp,
    }

    console.log("body", body);


    let hmac = generateHmacSignature(timestamp, body, secretKey);

    try {
        let ret = await axios.post(
            apiEndpoint + "/api/game/revoke",
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


// Settlement Helper //
async function joinPay(gameId, roomId, sessionJwt, token, amount) {
    const timestamp = Date.now().toString();

    let body = {
        gameId: gameId,
        roomId: roomId,
        sessionJwts: [sessionJwt], // Can add more sessionJwt like [sessionJwt1, sessionJwt2, sessionJwt3]
        tokens: [token], // Can add more token like ['token1', 'token2', 'token3']
        amounts: [amount], // Can add more amount like [100, 200, 300]
    }

    let hmac = generateHmacSignature(timestamp, body, secretKey);

    try {
        let ret = await axios.post(
            apiEndpoint + "/api/game/joinPay",
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
        // Let take a break a little bit. To let queue system process the task //
        await new Promise(resolve => setTimeout(resolve, 2000));

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
                console.log("JoinPay success", ret.data);
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 5000));
        }

    } catch (error) {
        console.dir(error, { depth: null });
    }
}

async function earnLeave(roomId, plyrId, token, amount) {
    const timestamp = Date.now().toString();

    let body = {
        roomId: roomId,
        plyrIds: [plyrId], // Can add more players to the room like playrs: ['plyrId1', 'plyrId2', 'plyrId3']
        tokens: [token], // Can add more token like ['token1', 'token2', 'token3']
        amounts: [amount], // Can add more amount like [100, 200, 300]
    }

    let hmac = generateHmacSignature(timestamp, body, secretKey);

    try {
        let ret = await axios.post(
            apiEndpoint + "/api/game/earnLeave",
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
        // Let take a break a little bit. To let queue system process the task //
        await new Promise(resolve => setTimeout(resolve, 2000));

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
                console.log("earnLeave success", ret.data);
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 5000));
        }

    } catch (error) {
        console.dir(error, { depth: null });
    }
}


async function createJoinPay(sessionJwt, token, amount) {
    const timestamp = Date.now().toString();

    let body = {
        sessionJwts: [sessionJwt], // Can add more sessionJwt like [sessionJwt1, sessionJwt2, sessionJwt3]
        tokens: [token], // Can add more token like ['token1', 'token2', 'token3']
        amounts: [amount], // Can add more amount like [100, 200, 300]
    }

    //console.log("body", body);


    let hmac = generateHmacSignature(timestamp, body, secretKey);

    try {
        let ret = await axios.post(
            apiEndpoint + "/api/game/createJoinPay",
            body,
            {
                headers: {
                    apikey: apiKey,
                    signature: hmac,
                    timestamp: timestamp,
                },
            }
        );
        // console.log("status", ret.status);
         console.log("ret", ret.data);



        // Check Status of Queue Message, retry every 5 seconds until success //
        let taskId = ret.data.task.id;

        // Let take a break a little bit. To let queue system process the task //
        await new Promise(resolve => setTimeout(resolve, 2000));

        while (true) {

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
            
            if (ret.data.status !== 'PENDING') {
                console.log("create join pay success", ret.data);
                break;
            }
            else{
                console.log("queue ret", ret.data);
            }
            await new Promise(resolve => setTimeout(resolve, 5000));
        }

    } catch (error) {
        console.dir(error, { depth: null });
    }
}

async function earnLeaveEnd(roomId, plyrId, token, amount) {
    const timestamp = Date.now().toString();

    let body = {
        roomId: roomId,
        plyrIds: [plyrId], // Can add more players to the room like playrs: ['plyrId1', 'plyrId2', 'plyrId3']
        tokens: [token], // Can add more token like ['token1', 'token2', 'token3']
        amounts: [amount], // Can add more amount like [100, 200, 300]
    }

    //console.log("body", body);
    //return;

    let hmac = generateHmacSignature(timestamp, body, secretKey);

    try {
        let ret = await axios.post(
            apiEndpoint + "/api/game/earnLeaveEnd",
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

        // Let take a break a little bit. To let queue system process the task //
        await new Promise(resolve => setTimeout(resolve, 2000));

        while (true) {

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
                console.log("Earn Leave End success", ret.data);
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 5000));
        }

    } catch (error) {
        //console.log("status", error.response.status);
        console.dir(error, { depth: null });
    }
}

module.exports = { createGameRoom, joinGameRoom, isJoinedGameRoom, leaveGameRoom, approveGameToken, payGameRoom, batchPayGameRoom, earnGameRoom, batchEarnGameRoom, endGameRoom, getGameAllowance, revokeApproval, joinPay, earnLeave, createJoinPay, earnLeaveEnd };

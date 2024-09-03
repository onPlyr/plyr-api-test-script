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
                roomId = ret.data.taskData.result.roomId;
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 5000));
        }

    } catch (error) {
        //console.log("status", error.response.status);
        console.log(error);
    }

}

async function joinGameRoom(roomId, plyrId, sessionJwt) {
    const timestamp = Date.now().toString();

    let body = {
        roomId: roomId,
        sessionJwts: {
            [plyrId]: sessionJwt,
            // Can add more players to the room
            // [plyrId2]: sessionJwt2,
            // [plyrId3]: sessionJwt3,

        }
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
        console.log(error);
    }

}

async function leaveGameRoom(roomId, plyrId, sessionJwt) {
    const timestamp = Date.now().toString();

    let body = {
        roomId: roomId,
        sessionJwts: {
            [plyrId]: sessionJwt,
            // Can add more players to the room
            // [plyrId2]: sessionJwt2,
            // [plyrId3]: sessionJwt3,

        }
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
        console.log(error);
    }

}

module.exports = { createGameRoom, joinGameRoom, leaveGameRoom };

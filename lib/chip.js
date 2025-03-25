const { generateHmacSignature } = require("../utils/hmacUtils");
const axios = require("axios");

require("dotenv").config();

const apiEndpoint = process.env.PLYR_API_ENDPOINT;
const apiKey = process.env.PLYR_API_KEY;
const secretKey = process.env.PLYR_API_SECRET;

async function createChip(name, symbol, image) {
    const timestamp = Date.now().toString();

    let body = {
        name: name,
        symbol: symbol,
        image: image || undefined
    }

    let hmac = generateHmacSignature(timestamp, body, secretKey);

    try {
        let ret = await axios.post(
            apiEndpoint + "/api/game/chip/create",
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
        console.log(error); 
    }
}

async function mintChip(chip, plyrId, amount) {
    const timestamp = Date.now().toString();

    let body = {
        chips: [chip],
        plyrIds: [plyrId],
        amounts: [amount]
    }

    let hmac = generateHmacSignature(timestamp, body, secretKey);

    try {
        let ret = await axios.post(
            apiEndpoint + "/api/game/chip/mint",
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
        console.log(error);
    }
}

async function burnChip(chip, plyrId, amount) {
    const timestamp = Date.now().toString();

    let body = {
        chips: [chip],
        plyrIds: [plyrId],
        amounts: [amount]
    }

    let hmac = generateHmacSignature(timestamp, body, secretKey);

    try {
        let ret = await axios.post(
            apiEndpoint + "/api/game/chip/burn",
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
        console.log(error);
    }
}

async function transferChip(chip, fromPlyrId, toPlyrId, amount) {
    const timestamp = Date.now().toString();

    let body = {
        chips: [chip],
        fromPlyrIds: [fromPlyrId],
        toPlyrIds: [toPlyrId],
        amounts: [amount]
    }

    let hmac = generateHmacSignature(timestamp, body, secretKey);
    
    try {
        let ret = await axios.post(
            apiEndpoint + "/api/game/chip/transfer",
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
        console.log(error);
    }
}


// Get function //
async function chipBalance(plyrId) {
    const timestamp = Date.now().toString();

    let hmac = generateHmacSignature(timestamp, {}, secretKey);

    try {
        let ret = await axios.get(
            apiEndpoint + "/api/game/chip/balance?plyrId=" + plyrId, // you can filter by plyrId, chip, gammeId too
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
        console.log(error);
    }
}

async function chipInfo(gameId) {
    const timestamp = Date.now().toString();

    let hmac = generateHmacSignature(timestamp, {}, secretKey);

    try {
        let ret = await axios.get(
            apiEndpoint + "/api/game/chip/info?gameId=" + gameId, // you can filter by chip, gammeId too
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
        console.log(error);
    }
}

module.exports = {
    createChip,
    mintChip,
    burnChip,
    transferChip,
    chipBalance,
    chipInfo
}

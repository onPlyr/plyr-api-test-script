const { generateHmacSignature } = require("../utils/hmacUtils");
const axios = require("axios");

require("dotenv").config();

const apiEndpoint = process.env.PLYR_API_ENDPOINT;
const apiKey = process.env.PLYR_API_KEY;
const secretKey = process.env.PLYR_API_SECRET;

async function createBadge(name, symbol, description, image) {
    const timestamp = Date.now().toString();

    let body = {
        name: name,
        symbol: symbol,
        description: description,
        chainId: 62831,
        image: image || undefined,
    }

    let hmac = generateHmacSignature(timestamp, body, secretKey);

    try {
        let ret = await axios.post(
            apiEndpoint + "/api/game/badge/create",
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

async function mintBadge(badge, plyrId) {
    const timestamp = Date.now().toString();

    let body = {
        badges: [badge],
        plyrIds: [plyrId],
    }

    let hmac = generateHmacSignature(timestamp, body, secretKey);

    try {
        let ret = await axios.post(
            apiEndpoint + "/api/game/badge/mint",
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
        console.dir(ret.data, { depth: null });
    } catch (error) {
        console.log(error);
    }
}

async function removeBadge(badge) {
    const timestamp = Date.now().toString();

    let body = {
        badge: badge,
    }

    let hmac = generateHmacSignature(timestamp, body, secretKey);

    try {
        let ret = await axios.post(
            apiEndpoint + "/api/game/badge/remove",
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

async function burnBadge(badge, tokenId) {
    const timestamp = Date.now().toString();

    let body = {
        badges: [badge],
        tokenIds: [tokenId],
    }

    let hmac = generateHmacSignature(timestamp, body, secretKey);

    try {
        let ret = await axios.post(
            apiEndpoint + "/api/game/badge/burn",
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

async function badgeBalance(plyrId) {
    const timestamp = Date.now().toString();

    let hmac = generateHmacSignature(timestamp, {}, secretKey);

    try {
        let ret = await axios.get(
            apiEndpoint + "/api/game/badge/balance?plyrId=" + plyrId,
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

async function badgeList(plyrId) {
    const timestamp = Date.now().toString();

    let hmac = generateHmacSignature(timestamp, {}, secretKey);

    try {
        let ret = await axios.get(
            apiEndpoint + "/api/game/badge/list?plyrId=" + plyrId + "&chainId=" + chainId,
            {
                headers: {
                    apikey: apiKey,
                    signature: hmac,
                    timestamp: timestamp,
                },
            }
        );
        console.log("status", ret.status);
        console.dir(ret.data, { depth: null });
    } catch (error) {
        console.log(error);
    }
}

async function badgeCount(plyrId, gameId, badge) {
    const timestamp = Date.now().toString();

    let hmac = generateHmacSignature(timestamp, {}, secretKey);

    try {
        let ret = await axios.get(
            apiEndpoint + "/api/game/badge/count?plyrId=" + plyrId + "&gameId=" + gameId + "&badge=" + badge,
            {
                headers: {
                    apikey: apiKey,
                    signature: hmac,
                    timestamp: timestamp,
                },
            }
        );
        console.log("status", ret.status);
        console.dir(ret.data, { depth: null });
    } catch (error) {
        console.log(error);
    }
}

async function badgeInfo(gameId) {
    const timestamp = Date.now().toString();

    let hmac = generateHmacSignature(timestamp, {}, secretKey);

    try {
        let ret = await axios.get(
            apiEndpoint + "/api/game/badge/info?gameId=" + gameId + "&chainId=" + 62831,
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
    createBadge,
    mintBadge,
    removeBadge,
    burnBadge,
    badgeBalance,
    badgeList,
    badgeCount,
    badgeInfo,

} 
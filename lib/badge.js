const { generateHmacSignature } = require("../utils/hmacUtils");
const axios = require("axios");

require("dotenv").config();

const apiEndpoint = process.env.PLYR_API_ENDPOINT;
const apiKey = process.env.PLYR_API_KEY;
const secretKey = process.env.PLYR_API_SECRET;


// Init Badge Contract - 1 Game = 1 Badge Contract only
async function initBadge() {

    const timestamp = Date.now().toString();

    let hmac = generateHmacSignature(timestamp, {}, secretKey);

    try {
        let ret = await axios.post(
            apiEndpoint + "/api/game/badge/init",
            {},
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

// Create Badge
// Create a badge topic //
async function createBadge(name, description, slug) {
    const timestamp = Date.now().toString();

    const attributes = [
        {
            trait_type: "RARITY",
            value: "Common"
        }
    ]

    let body = {
        name: name,
        description: description,
        slug: slug,
        image: 'https://ipfs.plyr.network/ipfs/bafkreicpjp3343jmz4nbfbfab5hnsy37peny7eq66k5rnz6hcepvlv4ke4', // Must be a full url
        attributes: attributes, // Must be an array of objects
        // Example:
        // attributes: [
        //     {        
        //         trait_type: "RARITY",
        //         value: "Common"
        //     }
        // ]
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

// Mint Badge with Slug to PLYRID
async function mintBadge(slug, plyrId) {
    const timestamp = Date.now().toString();

    let body = {
        slugs: [slug],
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

// async function removeBadge(badge) {
//     const timestamp = Date.now().toString();

//     let body = {
//         badge: badge,
//     }

//     let hmac = generateHmacSignature(timestamp, body, secretKey);

//     try {
//         let ret = await axios.post(
//             apiEndpoint + "/api/game/badge/remove",
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
//         console.log(error);
//     }
// }

async function burnBadge(plyrId, slug, tokenId) {
    const timestamp = Date.now().toString();

    let body = {
        plyrIds: [plyrId],
        slugs: [slug],
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

// Get all Badge List for a PLYRID (BALANCE)
async function badgeList(plyrId, gameId) {
    const timestamp = Date.now().toString();

    let hmac = generateHmacSignature(timestamp, {}, secretKey);

    try {
        let ret = await axios.get(
            apiEndpoint + "/api/game/badge/list?plyrId=" + plyrId + "&gameId=" + gameId,
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

// Get Badge info //
async function badgeInfo(gameId) {
    const timestamp = Date.now().toString();

    let hmac = generateHmacSignature(timestamp, {}, secretKey);

    try {
        let ret = await axios.get(
            apiEndpoint + "/api/game/badge/info?gameId=" + gameId, // Can filter by Slug too
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



module.exports = {
    initBadge,

    createBadge,
    mintBadge,
    //removeBadge,
    burnBadge,
    badgeList,
    badgeInfo,

} 
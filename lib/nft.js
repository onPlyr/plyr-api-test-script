const { generateHmacSignature } = require("../utils/hmacUtils");
const axios = require("axios");

require("dotenv").config();

const apiEndpoint = process.env.PLYR_API_ENDPOINT;
const apiKey = process.env.PLYR_API_KEY;
const secretKey = process.env.PLYR_API_SECRET;

async function createNFT(name, symbol, chainId, image) {
    const timestamp = Date.now().toString();

    let body = {
        name: name,
        symbol: symbol,
        chainId: chainId,
        image: image || undefined
    }

    let hmac = generateHmacSignature(timestamp, body, secretKey);

    try {
        let ret = await axios.post(
            apiEndpoint + "/api/game/nft/create",
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

async function mintNFT(nft, recipientAddress, metaJson, chainId) {
    const timestamp = Date.now().toString();

    // console.log('nft', nft);
    // console.log('recipientAddress', recipientAddress);
    // console.log('metaJson', metaJson);
    // console.log('chainId', chainId);
    // return;

    let body = {
        nfts: [nft],
        addresses: [recipientAddress],
        metaJsons: [metaJson], // or you can use tokenUris: [] instead of metaJsons object
        chainId: chainId
    }

    let hmac = generateHmacSignature(timestamp, body, secretKey);

    try {
        let ret = await axios.post(
            apiEndpoint + "/api/game/nft/mint",
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

async function transferNFT(nft, from, to, tokenId, chainId) {
    const timestamp = Date.now().toString();

    let body = {
        nfts: [nft],
        fromAddresses: [from],
        toAddresses: [to],
        tokenIds: [tokenId],
        chainId: chainId
    }

    let hmac = generateHmacSignature(timestamp, body, secretKey);

    try {
        let ret = await axios.post(
            apiEndpoint + "/api/game/nft/transfer",
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

async function burnNFT(nft, tokenId, chainId) {
    const timestamp = Date.now().toString();

    let body = {
        nfts: [nft],
        tokenIds: [tokenId],
        chainId: chainId
    }

    let hmac = generateHmacSignature(timestamp, body, secretKey);

    try {
        let ret = await axios.post(
            apiEndpoint + "/api/game/nft/burn",
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
async function nftBalance(plyrId, chainId) {
    const timestamp = Date.now().toString();

    let hmac = generateHmacSignature(timestamp, {}, secretKey);

    try {
        let ret = await axios.get(
            apiEndpoint + "/api/game/nft/balance?plyrId=" + plyrId + "&chainId=" + chainId , // you can filter by nft address and gameId too
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

async function nftList(plyrId, chainId) {
    const timestamp = Date.now().toString();

    let hmac = generateHmacSignature(timestamp, {}, secretKey);

    try {
        let ret = await axios.get(
            apiEndpoint + "/api/game/nft/list?plyrId=" + plyrId + "&chainId=" + chainId, // you can filter by nft address and gameId too
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

async function nftIsHolding(plyrId, gameId, nft, chainId) {
    const timestamp = Date.now().toString();

    let hmac = generateHmacSignature(timestamp, {}, secretKey);

    try {
        let ret = await axios.get(
            apiEndpoint + "/api/game/nft/isHolding?plyrId=" + plyrId + "&gameId=" + gameId + "&nft=" + nft + "&chainId=" + chainId, // you can filter by tokenId too
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

async function nftCredit()
{
    const timestamp = Date.now().toString();

    let hmac = generateHmacSignature(timestamp, {}, secretKey);

    try {
        let ret = await axios.get(
            apiEndpoint + "/api/game/nft/credit", // you can filter by tokenId too
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

async function nftInfo(gameId, chainId) {
    const timestamp = Date.now().toString();

    let hmac = generateHmacSignature(timestamp, {}, secretKey);

    try {
        let ret = await axios.get(
            apiEndpoint + "/api/game/nft/info?gameId=" + gameId + "&chainId=" + chainId , // you can filter by gammeId too
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
    createNFT,
    mintNFT,
    burnNFT,
    transferNFT,


    nftBalance,
    nftList,
    nftIsHolding,
    nftInfo,

    nftCredit
}

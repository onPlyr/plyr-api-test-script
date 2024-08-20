const { generateHmacSignature } = require("../utils/hmacUtils");
const axios = require("axios");

require("dotenv").config();

const apiEndpoint = process.env.PLYR_API_ENDPOINT;
const apiKey = process.env.PLYR_API_KEY;
const secretKey = process.env.PLYR_API_SECRET;

/*
[GET] airdropCampaignInfo()
 Airdrop - Campaign Information
*/
async function airdropCampaignInfo()
{
    const timestamp = Date.now().toString();
    let hmac = generateHmacSignature(timestamp, {}, secretKey);

    try {
        let ret = await axios.get(
            apiEndpoint + "/api/airdrop/campaign/info/",
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
        console.log("status", error.response.status);
        console.log(error.response.data);
    }
}

/*
[GET] airdropCampaignClaimableRewards()
 Airdrop - Claimable Rewards with campaign id and address to check
*/
async function airdropCampaignClaimableRewards(campaignId, address) {
    const timestamp = Date.now().toString();

    let hmac = generateHmacSignature(timestamp, {}, secretKey);

    try {
        let ret = await axios.get(
            apiEndpoint + "/api/airdrop/campaign/"+campaignId+"/claimableReward/"+address,
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
        console.log("status", error.response.status);
        console.log(error.response.data);
    }
}

/*
[POST] airdropCampaignClaim()
params:
    campaignId
    address - should be a primary address only not mirror
    playedGame - true or false. True = Fully amount , False 20% penaly
*/
async function airdropCampaignClaim(campaignId, address, playedGame) {
    const timestamp = Date.now().toString();
    let body = {
        campaignId: campaignId,
        address: address,
        playedGame: playedGame,
    }

    let hmac = generateHmacSignature(timestamp, body, secretKey);

    try {
        let ret = await axios.post(
            apiEndpoint + "/api/airdrop/campaign/claim/",
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
        console.log("status", error.response.status);
        console.log(error.response.data);
    }
}

module.exports = { airdropCampaignInfo, airdropCampaignClaimableRewards, airdropCampaignClaim };
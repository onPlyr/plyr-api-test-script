const { generateHmacSignature } = require("../utils/hmacUtils");
const axios = require("axios");

require("dotenv").config();

const apiEndpoint = process.env.PLYR_API_ENDPOINT;
const apiKey = process.env.PLYR_API_KEY;
const secretKey = process.env.PLYR_API_SECRET;

async function getAuth(uid) {
    const timestamp = Date.now().toString();
    console.log("timestamp", timestamp);
    let hmac = generateHmacSignature(timestamp, {}, secretKey);
    console.log("hmac", hmac);
    try {
        let ret = await axios.get(
            apiEndpoint + "/api/auth/read/" + uid + '/',
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
        console.log("stauts", error.response.data);
        //console.dir(error, { depth: null });
    }
}

module.exports = { getAuth };
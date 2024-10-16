const { generateHmacSignature } = require("../utils/hmacUtils");
const axios = require("axios");
const jwt = require('jsonwebtoken');

require("dotenv").config();

const apiEndpoint = process.env.PLYR_API_ENDPOINT;
const apiKey = process.env.PLYR_API_KEY;
const secretKey = process.env.PLYR_API_SECRET;

async function getSessionJwtPublicKey() {
    const timestamp = Date.now().toString();
    let hmac = generateHmacSignature(timestamp, {}, secretKey);

    try {
        let ret = await axios.get(
            apiEndpoint + "/api/jwt/publicKey/",
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


async function verifyJwtLocally(token) {

    //console.log('PWK', Buffer.from('LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUZrd0V3WUhLb1pJemowQ0FRWUlLb1pJemowREFRY0RRZ0FFaHlXaXNtRjc0disxMms4bENLM3lpRWdqVi9xMwpqSW1MNUpodnhIbGJGUVdxZE5BeDZUN2tvNHR3L05HNjVPRW1aeU5tcFUvZ2R6TzBoZUNtaTVhM2xRPT0KLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0tCg==', 'base64').toString('utf-8'));

    try {
        const ret = jwt.verify(token, Buffer.from('LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUZrd0V3WUhLb1pJemowQ0FRWUlLb1pJemowREFRY0RRZ0FFaHlXaXNtRjc0disxMms4bENLM3lpRWdqVi9xMwpqSW1MNUpodnhIbGJGUVdxZE5BeDZUN2tvNHR3L05HNjVPRW1aeU5tcFUvZ2R6TzBoZUNtaTVhM2xRPT0KLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0tCg==', 'base64').toString('utf-8'), { algorithms: ['ES256'] });
        console.log('ret', ret);
    }
    catch (error) {
        console.log('error', error.message);
    }
}

module.exports = { getSessionJwtPublicKey, verifyJwtLocally };
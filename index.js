const { userLogin, userLogout, checkSessionJwt, getUserInfo } = require("./lib/user");

const { airdropCampaignInfo, airdropCampaignClaimableRewards, airdropCampaignClaim } = require("./lib/airdrop");

const { getTaskMessageStatus } = require("./lib/message");

const { getSessionJwtPublicKey, verifyJwtLocally } = require("./lib/jwt");

// CLI //
const args = process.argv.splice(2);
function parseStringNumber(input) {
    if (!input) return null
    // Check if the string ends with 's'
    if (input[input.length - 1] === 's') {
        return parseInt(input.slice(0, -1), 10);
    }
    // Check if the string is a valid number
    else if (!isNaN(input)) {
        return parseInt(input, 10);
    }
    // If it's '1h' or any other string, return it as it is
    return input;
}
// node index.js login fennec2 123456 86400s << dont forget to have "s" to represent seconds. Otherwise, it will be milliseconds
// You can use 1h , 1d , 1w too.
// default is 86400s -- in case, you don't specify it
if (args[0] == 'login') {
    userLogin(args[1], args[2], parseStringNumber(args[3]));

    // node index.js logout eyJhbGciOiJFUzI1N...
} else if (args[0] == 'logout') {
    userLogout(args[1]);

    // node index.js check eyJhbGciOiJFUzI1N...
} else if (args[0] == 'verifyJwt') {
    checkSessionJwt(args[1]);
}

// node index.js getSessionJwtPublicKey
else if (args[0] == 'getSessionJwtPublicKey') {
    getSessionJwtPublicKey();
}
// node index.js verifyJwtLocally eyJhbGciOiJFUzI1N...
// In case, you just want to check validity of jwt / token is expire or not. 
// For a job like, to check if a message is expired or not and then return user back to login page.
// It's just a simple feature to reduce to checking time.
// Anyway, you can use /api/user/session/verify if you want accurate result.
else if (args[0] == 'verifyJwtLocally')
{
    verifyJwtLocally(args[1])
}


// node index.js info fennec2
else if (args[0] == 'info') {
    getUserInfo(args[1]);
}
// node index.js airdropInfo
else if (args[0] == "airdropCampaignInfo") {
    airdropCampaignInfo();
}
// node index.js airdropCheckClaimableRewards 0 0xabc..1234
else if (args[0] == "airdropCheckClaimableRewards") {
    args[1] = Number(args[1]);
    airdropCampaignClaimableRewards(args[1], args[2]);
}

// node index.js airdropClaim 0 0xabc..1234 true/false
else if (args[0] == "airdropClaim") {
    args[1] = Number(args[1]);
    args[3] = args[3] === "true" ? true : false;
    airdropCampaignClaim(args[1], args[2], args[3]);
}
// node index.js airdropClaimedStatus MESSAGE_ID
else if (args[0] == 'airdropClaimedStatus') {
    getTaskMessageStatus(args[1]);
}


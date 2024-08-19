const { userLogin, userLogout, checkSessionJwt, getUserInfo } = require("./lib/user");

const { airdropCampaignInfo, airdropCampaignClaimableRewards, airdropCampaignClaim } = require("./lib/airdrop");

const { getTaskMessageStatus } = require("./lib/message");

// CLI //
const args = process.argv.splice(2);

// node index.js login fennec2 123456 86400s << dont forget to have "s" to represent seconds. Otherwise, it will be milliseconds
// You can use 1h , 1d , 1w too.
// default is 86400s -- in case, you don't specify it
if (args[0] == 'login') {

    userLogin(args[1], args[2], args[3], (args[4] || null));

    // node index.js logout eyJhbGciOiJFUzI1N...
} else if (args[0] == 'logout') {
    userLogout(args[1]);

    // node index.js check eyJhbGciOiJFUzI1N...
} else if (args[0] == 'verifyJwt') {
    checkSessionJwt(args[1]);
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
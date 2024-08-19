const { userLogin, userLogout, checkSessionJwt, getUserInfo } = require("./lib/user");

const { airdropCampaignInfo } = require("./lib/airdrop");

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
else if (args[0] == "airdropInfo") {
    airdropCampaignInfo(args[1]);
}
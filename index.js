const { userLogin, userLogout, checkSessionJwt, getUserInfo } = require("./lib/user");

const { airdropCampaignInfo, airdropCampaignClaimableRewards, airdropCampaignClaim, airdropUserStats } = require("./lib/airdrop");

const { getTaskMessageStatus } = require("./lib/message");

const { getSessionJwtPublicKey, verifyJwtLocally } = require("./lib/jwt");

const { createGameRoom, joinGameRoom, leaveGameRoom, approveGameToken, payGameRoom, earnGameRoom, endGameRoom, getGameAllowance } = require("./lib/game");

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
else if (args[0] == 'verifyJwtLocally') {
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
else if (args[0] == 'getTaskMessageStatus') {
    getTaskMessageStatus(args[1]);
}

// node index.js airdropUserRewards 0 0xabc..1234
else if (args[0] == 'airdropUserStats') {
    airdropUserStats(args[1], args[2]);
}


// Test Game flow //
// 1. Login user first and keep user JWT -- login(plyrid, otp, expiresIn) //
// 2. Create a game room -- createGameRoom(expiresIn) //
// 3. Let user join the room //
// 4. Try to let user approve game token //
// 5. Try to earn //
// 6. Try to end the game room //
// 7. Try to cancel the game room //

// node index.js createGameRoom 86400
else if (args[0] == 'createGameRoom') {
    createGameRoom(args[1]);
}


// node index.js joinGameRoom roomId sessionJwt
// args1 = roomId
// args2 = plyrId
// args3 = sessionJwt
// In the real world, you can bring many users to join the room. (please check at lib/game.js)
else if (args[0] == 'joinGameRoom') {
    joinGameRoom(args[1], args[2], args[3]);
}

// node index.js leaveGameRoom roomId sessionJwt
// args1 = roomId
// args2 = plyrId
// args3 = sessionJwt
// In the real world, you can remove many users from the room. (please check at lib/game.js)
else if (args[0] == 'leaveGameRoom') {
    leaveGameRoom(args[1], args[2], args[3]);
}

// node index.js approveGameToken plyrId gameId plyr 10 3600 123456
// args1 = plyrId
// args2 = gameId / Not a game api key / you can get it with api key, sec key
// args3 = token name plyr or gamr and support token address in the future
// args4 = amount of token to approve
// args5 = expiresIn
// args6 = otp // 2fa token
// Once you approved, it means that it approved to entire game process. Don't need to call it everytime to pay to each room
else if (args[0] == 'approveGameToken') {
    approveGameToken(args[1], args[2], args[3], args[4], args[5], args[6]);
}

// node index.js payGameRoom roomId plyrId sessionJwt tokenName amount
// args1 = roomId
// args2 = plyrId
// args3 = sessionJwt
// args4 = tokenName (now support only 'plyr', 'gamr' and future it will support more and ttoken address too)
// args5 = amount of token to pay but need to <= approved amount
// In the real world, you can spend many users' tokens at the same time (please check at lib/game.js)
else if (args[0] == 'payGameRoom') {
    payGameRoom(args[1], args[2], args[3], args[4], args[5])
}

// node index.js payGameRoom roomId plyrId sessionJwt tokenName amount
// args1 = roomId
// args2 = plyrId
// args3 = tokenName (now support only 'plyr', 'gamr' and future it will support more and ttoken address too)
// args4 = amount of token to approve (Just a number like 0.00001 , 1 , 10 , 1000)
// If you want to broadcast earning. Please should use Multicall function or loop by yourself
else if (args[0] == 'earnGameRoom') {
    earnGameRoom(args[1], args[2], args[3], args[4])
}

// node index.js endGameRoom roomId
else if (args[0] == 'endGameRoom') {
    endGameRoom(args[1])
}

// node index.js getGameAllowan plyrId gameId token
// args1 = plyrid
// args2 = gameid
// args3 = tokenName (now support only 'plyr', 'gamr' and future it will support more and ttoken address too)

else if (args[0] == 'getGameAllowance') {
    getGameAllowance(args[1], args[2, args[3]])
}

else if (args[0] == 'isJoinedGameRoom') {

}

else if (args[0] == 'revokeApproval'){

}
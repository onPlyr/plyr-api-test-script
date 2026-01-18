const { userLogin, userLogout, checkSessionJwt, getUserInfo, getAvatar, getAvatars, userLoginAndApprove, getUserBalance } = require("./lib/user");

const { airdropCampaignInfo, airdropCampaignClaimableRewards, airdropCampaignClaim, airdropUserStats, airdropAllClaimableRewards, airdropAllClaim } = require("./lib/airdrop");

const { getTaskMessageStatus } = require("./lib/message");

const { getSessionJwtPublicKey, verifyJwtLocally } = require("./lib/jwt");

const { createGameRoom, joinGameRoom, isJoinedGameRoom, leaveGameRoom, approveGameToken, payGameRoom, earnGameRoom, endGameRoom, getGameAllowance, revokeApproval, createJoinPay, earnLeaveEnd, joinPay, earnLeave } = require("./lib/game");

const { registerIPP, revealClaimingCode, verifyClaimingCode, revealIPPPrivateKey } = require("./lib/instantplaypass");

const { activityLogs } = require("./lib/log");

const { getAuth } = require("./lib/auth");

const { createChip, mintChip, burnChip, transferChip, chipBalance, chipInfo } = require("./lib/chip");

const { createNFT, mintNFT, transferNFT, burnNFT, nftBalance, nftList, nftInfo, nftCount, nftCredit, getNftByTokenId } = require("./lib/nft");

const { initBadge, isInitedBadge, createBadge, mintBadge, burnBadge, badgeList, badgeInfo } = require("./lib/badge");

const { depositRewardPool, claimableAmounts, claimRewardPool, batchClaimRewardPool } = require("./lib/rewardPool");

const fs = require('fs');

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
// node index.js login fennec2 123456 << this will use a default expiresIn 86400s and gameId is related to API KEY
// node index.js login fennec2 123456 86400s << dont forget to have "s" to represent seconds. Otherwise, it will be milliseconds
// node index.js login fennec2 123456 86400s gameId << this will use a specific gameId
// You can use 1h , 1d , 1w too.
// default is 86400s -- in case, you don't specify it
if (args[0] == 'login') {
    userLogin(args[1], args[2], parseStringNumber(args[3]), args[4]);

    // node index.js logout eyJhbGciOiJFUzI1N...
}

// node index.js loginAndApprove fennec2 gameId plyr 10 86400s 123456
// args1 = plyrId
// args2 = gameId / Not a game api key / you can get it with api key, sec key
// args3 = token name plyr or gamr and support token address in the future
// args4 = amount of token to approve
// args5 = expiresIn
// args6 = otp // 2fa token
// Once you approved, it means that it approved to entire game process. Don't need to call it everytime to pay to each room
else if (args[0] == 'loginAndApprove') {
    userLoginAndApprove(args[1], args[2], args[3], args[4], parseStringNumber(args[5]), args[6]);
}
else if (args[0] == 'logout') {
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

// node index.js getBalance fennec2 plyr
else if (args[0] == 'userBalance') {
    getUserBalance(args[1], args[2]);
}

// node index.js getAvatar fennec2
else if (args[0] == 'getAvatar') {
    getAvatar(args[1]);
}

// node index.js getAvatar fennec2 cryptofennec
else if (args[0] == 'getAvatars') {
    getAvatars(args[1], args[2]);
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

// node index.js airdropCheckAllClaimableRewards 0xabc..1234
else if (args[0] == "airdropCheckAllClaimableRewards") {
    airdropAllClaimableRewards(args[1]);
}

// node index.js airdropClaim 0 0xabc..1234 true/false
else if (args[0] == "airdropClaim") {
    args[1] = Number(args[1]);
    args[3] = args[3] === "true" ? true : false;
    airdropCampaignClaim(args[1], args[2], args[3]);
}

// node index.js airdropClaimAll 0xabc..1234 true/false
else if (args[0] == "airdropClaimAll") {
    args[2] = args[2] === "true" ? true : false;
    airdropAllClaim(args[1], args[2]);
}

// node index.js airdropClaimedStatus MESSAGE_ID
else if (args[0] == 'getTaskStatus') {
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
    // check latency

    createGameRoom(args[1]);

}


// node index.js joinGameRoom roomId sessionJwt
// args1 = roomId
// args2 = sessionJwt
// In the real world, you can bring many users to join the room. (please check at lib/game.js)
else if (args[0] == 'joinGameRoom') {
    joinGameRoom(args[1], args[2]);
}

// node index.js leaveGameRoom roomId sessionJwt
// args1 = roomId
// args2 = sessionJwt
// In the real world, you can remove many users from the room. (please check at lib/game.js)
else if (args[0] == 'leaveGameRoom') {
    leaveGameRoom(args[1], args[2]);
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
// args2 = sessionJwt
// args3 = tokenName (now support only 'plyr', 'gamr' and future it will support more and ttoken address too)
// args4 = amount of token to pay but need to <= approved amount
else if (args[0] == 'payGameRoom') {
    payGameRoom(args[1], args[2], args[3], args[4])
}

// node index.js batchPayGameRoom roomId plyrId sessionJwt tokenName amount
// args1 = roomId
// args2 = sessionJwt - #1
// args3 = sessionJwt - #2
// args4 = tokenName (now support only 'plyr', 'gamr' and future it will support more and ttoken address too)
// args5 = amount of token to pay but need to <= approved amount
// In the real world, you can spend many users' tokens at the same time (please check at lib/game.js)
// else if (args[0] == 'batchPayGameRoom') {
//     batchPayGameRoom(args[1], args[2], args[3], args[4], args[5])
// }

// node index.js payGameRoom roomId plyrId sessionJwt tokenName amount
// args1 = roomId
// args2 = plyrId
// args3 = tokenName (now support only 'plyr', 'gamr' and future it will support more and token address too)
// args4 = amount of token to approve (Just a number like 0.00001 , 1 , 10 , 1000)
else if (args[0] == 'earnGameRoom') {
    earnGameRoom(args[1], args[2], args[3], args[4])
}

// node index.js batchEarnGameRoom roomId plyrId sessionJwt tokenName amount
// args1 = roomId
// args2 = plyrId - #1
// args3 = plyrId - #2
// args4 = tokenName (now support only 'plyr', 'gamr' and future it will support more and ttoken address too)
// args5 = amount of token to pay but need to <= approved amount
// In the real world, you can spend many users' tokens at the same time (please check at lib/game.js)
// else if (args[0] == 'batchEarnGameRoom') {
//     batchEarnGameRoom(args[1], args[2], args[3], args[4], args[5])
// }

// node index.js endGameRoom roomId
else if (args[0] == 'endGameRoom') {
    endGameRoom(args[1])
}

// node index.js getGameAllowan plyrId gameId token
// args1 = plyrid
// args2 = gameid
// args3 = tokenName (now support only 'plyr', 'gamr' and future it will support more and ttoken address too)

else if (args[0] == 'getGameAllowance') {
    getGameAllowance(args[1], args[2], args[3])
}

// node index.js isJoinedGameRoom roomId plyrId
else if (args[0] == 'isJoinedGameRoom') {
    isJoinedGameRoom(args[1], args[2])
}


// node index.js revokeApproval plyrId gameId tokenName
// args1 = plyrId
// args2 = gameId / all is means revoke all game
// args3 = tokenName / all is means revoke all token
// args4 = otp
else if (args[0] == 'revokeApproval') {
    revokeApproval(args[1], args[2], args[3], args[4])
}

// node index.js joinPay gameId roomId sessionJwt token amount
// args1 = gameId
// args2 = roomId
// args3 = sessionJwt
// args4 = token
// args5 = amount
else if (args[0] == 'joinPay') {
    joinPay(args[1], args[2], args[3], args[4], args[5])
}

// node index.js earnLeave roomId plyrId token amount
// arg1 = roomId
// args2 = plyrId
// args3 = token - Token Name or Token Address
// args4 = Reward amount
// Can do multiple users please check at lib/game.js
else if (args[0] == 'earnLeave') {
    earnLeave(args[1], args[2], args[3], args[4])
}

// AKA Start Settlement //
// A classic like Zoo API. Create a room, join users, Pay for the room. at once
// node index.js createJoinPay plyrId token amount sessionJwt

// args1 = sessionJwt
// args2 = token - Token Name or Token Address
// args3 = Token amount

// Can do multiple users please check at lib/game.js
else if (args[0] == 'createJoinPay') {
    createJoinPay(args[1], args[2], args[3])
}

// AKA Over Settlement //
// A classic like Zoo API. Reward a users, let them leave the room and end the room
// node index.js earnLeaveEnd roomId plyrId token amount
// arg1 = roomId
// args2 = plyrId
// args3 = token - Token Name or Token Address
// args4 = Reward amount
// Can do multiple users please check at lib/game.js
else if (args[0] == 'earnLeaveEnd') {
    earnLeaveEnd(args[1], args[2], args[3], args[4])
}


// CHIP //
// node index.js createChip name symbol image
else if (args[0] == 'createChip') {
    createChip(args[1], args[2], args[3]);
}
// node index.js mintChip chip plyrId amount
else if (args[0] == 'mintChip') {
    mintChip(args[1], args[2], args[3]);
}
// node index.js burnChip chip plyrId amount
else if (args[0] == 'burnChip') {
    burnChip(args[1], args[2], args[3]);
}
// node index.js transferChip chip fromPlyrId toPlyrId amount
else if (args[0] == 'transferChip') {
    transferChip(args[1], args[2], args[3], args[4]);
}
// node index.js chipBalance plyrId
else if (args[0] == 'chipBalance') {
    chipBalance(args[1]);
}
// node index.js chipInfo gameId
else if (args[0] == 'chipInfo') {
    chipInfo(args[1]);
}

// NFT //
// node index.js createNFT name symbol chainId image
else if (args[0] == 'createNFT') {
    createNFT(args[1], args[2], args[3], args[4]);
}
// node index.js mintNFT nft recipientAddress metaJsonFilename chainId
else if (args[0] == 'mintNFT') {

    // load metaJsonFilename from ./metajson/filename.json
    const metaJson = fs.readFileSync(`./metajson/${args[3]}.json`, 'utf8');
    //console.log('metaJson', JSON.parse(metaJson));
    mintNFT(args[1], args[2], JSON.parse(metaJson), args[4]);
}

// node index.js transferNFT nft from to tokenId chainId
else if (args[0] == 'transferNFT') {
    transferNFT(args[1], args[2], args[3], args[4], args[5]);
}

// node index.js burnNFT nft tokenId chainId
else if (args[0] == 'burnNFT') {
    burnNFT(args[1], args[2], args[3]);
}

// node index.js nftBalance plyrId chainId
else if (args[0] == 'nftBalance') {
    nftBalance(args[1], args[2]);
}

// node index.js nftList plyrId chainId nft
else if (args[0] == 'nftList') {
    nftList(args[1], args[2], args[3]); // nft is optional
}

// node index.js getNftByTokenId nft tokenId chainId
else if (args[0] == 'getNftByTokenId') {
    getNftByTokenId(args[1], args[2], args[3]);
}

// node index.js nftInfo gameId chainId
else if (args[0] == 'nftInfo') {
    nftInfo(args[1], args[2]);
}

// node index.js nftIsHolding plyrId gameId nft chainId
else if (args[0] == 'nftCount') {
    nftCount(args[1], args[2], args[3], args[4]);
}

else if (args[0] == 'nftCredit') {
    nftCredit();
}

// Badge commands

else if (args[0] == 'initBadge') {
    initBadge();
}

// node index.js isInitedBadge gameId
else if (args[0] == 'isInitedBadge') {
    isInitedBadge(args[1]);
}

// node index.js createBadge name description slug
else if (args[0] == 'createBadge') {
    createBadge(args[1], args[2], args[3]);
}

// node index.js mintBadge slug plyrId
else if (args[0] == 'mintBadge') {
    mintBadge(args[1], args[2]);
}

// node index.js removeBadge badge
// else if (args[0] == 'removeBadge') {
//     removeBadge(args[1]);
// }

// node index.js burnBadge plyrId slug tokenId
else if (args[0] == 'burnBadge') {
    burnBadge(args[1], args[2], args[3]);
}

// node index.js badgeList plyrId
else if (args[0] == 'badgeList') {
    badgeList(args[1]);
}

// node index.js badgeInfo gameId
else if (args[0] == 'badgeInfo') {
    badgeInfo(args[1]);
}


// REWARD POOL //

// node index.js depositRewardPool gameId plyrId sessionJwt token amount expiresIn
else if (args[0] == 'depositRewardPool') {
    depositRewardPool(args[1], args[2], args[3], args[4], args[5], args[6]);
}

// node index.js claimableAmounts gameId tokenId
else if (args[0] == 'claimableAmounts') {
    claimableAmounts(args[1], args[2]);
}

// node index.js claimRewardPool plyrId token amount
else if (args[0] == 'claimRewardPool') {
    claimRewardPool(args[1], args[2], args[3]);
}

// node index.js batchClaimRewardPool plyrId token amount
else if (args[0] == 'batchClaimRewardPool') {
    batchClaimRewardPool(args[1], args[2], args[3]);
}

// REGISTRATION //

// node index.js registerIPP
else if (args[0] == 'registerIPP') {
    registerIPP();
}

// node index.js revealClaimingCode IPPSessionJWT
else if (args[0] == 'revealClaimingCode') {
    revealClaimingCode(args[1]);
}

// node index.js verifyClaimingCode claimingCode
else if (args[0] == 'verifyClaimingCode') {
    verifyClaimingCode(args[1]);
}

// node index.js revealIPPPrivateKey IPPSessionJWT
// else if (args[0] == 'revealIPPPrivateKey') {
//     revealIPPPrivateKey(args[1]);
// }

// node index.js activityLogs plyrId
else if (args[0] == 'activityLogs') {
    activityLogs(args[1]);
}


// node index.js getAuth uid
else if (args[0] == 'getAuth') {
    getAuth(args[1]);
}


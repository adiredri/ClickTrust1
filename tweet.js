
console.log("tweet file activated");
require("dotenv").config({ path: __dirname + "/.env" });
const { twitterClient } = require("./twitterClient.js");

const tweet = async () => {
  try {
    await twitterClient.v2.tweet("Hello world!");
    console.log("activated the tweet function-tweeted the tweet");
  } catch (e) {
    console.log(e)
  }
}
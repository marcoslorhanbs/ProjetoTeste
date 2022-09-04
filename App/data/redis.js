
require('dotenv').config();
const { createClient } = require("redis")

// redis@v4
const redisClient = createClient(
  { legacyMode: true })
redisClient.connect().catch(console.error);

module.exports = redisClient;
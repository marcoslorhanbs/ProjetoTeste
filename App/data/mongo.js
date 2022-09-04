require('dotenv').config();
const mongoose = require('mongoose')

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(`mongodb+srv://rebehk:cIPMikghC5Er2pUa@cluster0.ci7xhlv.mongodb.net/?retryWrites=true&w=majority}`);
}


module.exports = mongoose;
const mongoose = require('mongoose')
async function mongooseconnection(){
    await mongoose.connect(process.env.MONGO_URI)
}
module.exports = mongooseconnection;
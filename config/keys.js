if (process.env.NODE_ENV === 'Development') require('dotenv').config()

module.exports = {
  MongoUri: process.env.MONGO_URI,
}

const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

DB_NAME = "concordia";

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

exports.addUser = async (user) => {
  const client = await MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db(DB_NAME);
  await db.collection("users").insertOne(user);
  client.close();
};

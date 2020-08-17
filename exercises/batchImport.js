const fs = require("file-system")
const { MongoClient } = require("mongodb");
const assert = require("assert");
require("dotenv").config();

const { MONGO_URI } = process.env;

DB_NAME = "concordia";

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const greetings = JSON.parse(fs.readFileSync("data/greetings.json"))

const batchImport = async () => {
    try {
        const client = await MongoClient(MONGO_URI, options);
        await client.connect();
        const db = client.db(DB_NAME);
        const r = await db.collection("greetings").insertMany(greetings);
        assert.equal(greetings.length, r.insertedCount);
        console.log({ status: 201, data: greetings });
        client.close();
      } catch (err) {
        console.log({ status: 500, data: greetings, message: err.message });
        console.log(err.stack);
      }
}

batchImport()
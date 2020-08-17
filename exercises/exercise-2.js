const { MongoClient } = require("mongodb");
const assert = require("assert");
require("dotenv").config();

const { MONGO_URI } = process.env;

DB_NAME = "concordia";

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

exports.createGreeting = async (req, res) => {
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db(DB_NAME);
    const r = await db.collection("greetings").insertOne(req.body);
    assert.equal(1, r.insertedCount);
    res.status(201).json({ status: 201, data: req.body });
    client.close();
  } catch (err) {
    res.status(500).json({ status: 500, data: req.body, message: err.message });
    console.log(err.stack);
  }
};

exports.getGreetings = async (req, res) => {
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db(DB_NAME);
    const r = await db.collection("greetings").find().toArray();
    res.status(200).json({ status: 200, data: r });
    client.close();
  } catch (err) {
    res
      .status(404)
      .json({ status: 404, data: "Not Found", message: err.message });
    console.log(err.stack);
  }
};

exports.getGreeting = async (req, res) => {
  const _id = req.params._id.toUpperCase();
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db(DB_NAME);
    const r = await db.collection("greetings").findOne({ _id });
    client.close();
    r
      ? res.status(200).json({ status: 200, _id, data: r })
      : res.status(404).json({ status: 404, _id, data: "Not Found" });
  } catch (err) {
    res
      .status(404)
      .json({ status: 404, _id, data: "Not Found", message: err.message });
    console.log(err.stack);
  }
};

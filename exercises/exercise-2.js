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
  const { start, limit, all } = req.query;
  let startIndex = start ? Number(start) : 0;
  let numGreetings = limit ? Number(limit) : 25;
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db(DB_NAME);
    const r = await db.collection("greetings").find().toArray();
    if (r.length > 0) {
      // if all = true in query params, display all data
      if (all) {
        startIndex = 0;
        numGreetings = r.length;
      }
      // try user query param specs
      let sample = r.slice(startIndex, startIndex + numGreetings);
      // if not working, display default data
      if (sample.length === 0) {
        startIndex = 0;
        numGreetings = 10;
        sample = r.slice(0, 10);
      }
      res
        .status(200)
        .json({
          status: 200,
          start: startIndex,
          limit: numGreetings,
          data: sample,
        });
    } else {
      // if no data in db send 404
      res.status(404).json({ status: 404, data: "Not Found" });
    }
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

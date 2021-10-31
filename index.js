const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 4000;

// middleware
app.use(cors());
app.use(express.json());

// database info
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hyits.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// console.log(uri)

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// getting requests and sending api
async function run() {
  try {
    await client.connect();
    // console.log("connected to db");

    // database name and collections
    const database = client.db("airrnr-a-11");
    const serviceCollection = database.collection("resorts");
    const userBookings = database.collection("user_bookings");

    // get all data / Read api
    app.get("/services", async (req, res) => {
      const cursor = serviceCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    });

    // get a single data / Read single api
    app.get("/serviceDetails/:id", async (req, res) => {
      const id = req.params.id;
      //   console.log("getting id", id);

      const query = { _id: ObjectId(id) };
      const result = await serviceCollection.findOne(query);
      res.json(result);
    });

    // get user booking api
    app.get("/usersBooking", async (req, res) => {
      const users = userBookings.find({});
      const result = await users.toArray();
      res.json(result);
    });

    // Update single user api / UPDATE
    app.put("/manageUsers/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: ObjectId(id) };
      const update = req.body;
      // console.log(update);
      const updateDoc = {
        $set: {
          status: update.status,
        },
      };
      const result = await userBookings.updateOne(query, updateDoc);
      res.json(result);
    });

    // create User booking related datato database / Create api
    app.post("/usersBooking", async (req, res) => {
      const bookingDetails = req.body;
      const result = await userBookings.insertOne(bookingDetails);
      res.json(result);
    });

    // delete a user booking / Delete api
    app.delete("/usersBooking/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      // console.log(id);
      const result = await userBookings.deleteOne(query);
      res.json(result);
    });
  } finally {
    // await client.close()
  }
}

run().catch(console.dir);

// testing initial server run
app.get("/", (req, res) => {
  res.send("a-11 server is running");
});

// listening if server is running smoothly
app.listen(port, () => {
  console.log("server of a-11 is running", port);
});

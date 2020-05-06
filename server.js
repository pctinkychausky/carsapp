const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3333;
const apiRoot = "/api/";
const version = "v1";
const fullAPIRoot = apiRoot + version;

const { MONGODB_URI } = process.env;

// const MONGODB_URI = process.env.MONGODB_URI

app.use(express.static("public"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// enable cors
app.use(cors());

mongoose.Promise = global.Promise;
const promise = mongoose.connect(
  MONGODB_URI || "mongodb://localhost/cars_jump",
  { useNewUrlParser: true }
);

promise
  .then(function (db) {
    console.log("DATABASE CONNECTED!!");
  })
  .catch(function (err) {
    console.log("CONNECTION ERROR", err);
  });

const Schema = mongoose.Schema;
const carSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  bhp: {
    type: Number,
    required: true,
  },
  avatar_url: {
    type: String,
    default: "https://static.thenounproject.com/png/449586-200.png",
  },
});

const Car = mongoose.model("Car", carSchema);

// GET /cars - get all the cars
// GET /cars/:id //--- /cars/Bugatti%20Veyron

// /cars
// /cars/78asd6f8s6d9

app.get(`${fullAPIRoot}/cars/:id?`, (req, res) => {
  var query = {};
  var id = req.params.id;
  if (id) {
    query._id = id;
  }
  Car.find(query).exec(function (err, cars) {
    if (err) {
      return res.status(500).send(err);
    }
    if (id && !cars.length) return res.sendStatus(404);
    res.status(200).json(cars);
  });
});

app.post(`${fullAPIRoot}/cars`, (req, res) => {
  const { avatar_url, name, bhp } = req.body;
  console.log("newCar", req.body);
  if (!name) {
    return res.status(400).send("NO_NAME");
  }
  if (!bhp) {
    return res.status(400).send("NO_BHP");
  } else if (Number.isNaN(Number(bhp))) {
    return res.status(400).send("BHP_NOT_A_NUMBER");
  }
  if (!avatar_url) {
    delete req.body.avatar_url;
  }
  const car = new Car(req.body);
  car.save(function (err, carModel) {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(201).send(carModel);
  });
});

app.put(`${fullAPIRoot}/cars/:id`, (req, res) => {
  const updateData = req.body;
  console.log(`Updating ${req.params.id}`, updateData);
  // 400s for bad data
  if (updateData.bhp && Number.isNaN(Number(updateData.bhp))) {
    return res.status(400).send("BHP_NOT_A_NUMBER");
  }
  Car.updateOne({ _id: req.params.id }, updateData, function (err, result) {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.nModified === 0) return res.sendStatus(404);
    res.status(200).send(result);
  });
});

app.delete(`${fullAPIRoot}/cars/:id`, (req, res) => {
  console.log("carToBeDeleted", req.params.id);
  Car.deleteOne({ _id: req.params.id }, function (err, result) {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.deletedCount === 0) return res.sendStatus(404);
    console.log(result);
    res.sendStatus(204);
  });
});

// 404 Route
app.all("*", (req, res) => {
  res.sendStatus(404);
});

app.listen(PORT, function () {
  console.log(`Listening on ${PORT}`);
});

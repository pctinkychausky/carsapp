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
  .then(function(db) {
    console.log("DATABASE CONNECTED!!");
  })
  .catch(function(err) {
    console.log("CONNECTION ERROR", err);
  });

const Schema = mongoose.Schema;
const carSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  bhp: {
    type: Number,
    required: true
  },
  avatar_url: {
    type: String,
    default: "https://static.thenounproject.com/png/449586-200.png"
  }
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
  Car.find(query).exec(function(err, cars) {
    if (err) return res.status(500).send(err);
    res.status(200).json(cars);
  });
});

app.post(`${fullAPIRoot}/cars`, (req, res) => {
  var newCar = req.body;
  console.log("newCar", newCar);
  if (!newCar.avatar_url) {
    delete newCar.avatar_url;
  }
  var car = new Car(newCar);
  car.save(function(err, carModel) {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(201).send(carModel);
  });
});

app.put(`${fullAPIRoot}/cars/:id`, (req, res) => {
  console.log(`Updating ${req.params.id}`, req.body);
  Car.updateOne({ _id: req.params.id }, req.body, function(err, result) {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).send(result);
  });
});

app.delete(`${fullAPIRoot}/cars/:id`, (req, res) => {
  console.log("carToBeDeleted", req.params.id);
  Car.deleteOne({ _id: req.params.id }, function(err) {
    if (err) {
      return res.status(500).send(err);
    }
    res.sendStatus(204);
  });
});

app.listen(PORT, function() {
  console.log(`Listening on ${PORT}`);
});

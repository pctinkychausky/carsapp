const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const apiRoot = "/api/";
const version = "v1";
const fullAPIRoot = apiRoot + version;

const {
  PORT = 3333,
  MONGODB_URI = "mongodb://localhost/cars_jump",
} = process.env;

app.use(express.static("public"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// enable cors
app.use(cors());

// TODO! Remove
const cars = [];

// TODO: Connect Database

// TODO: Define a car schema and model

//TODO: Create a read (GET) route

app.get(`${fullAPIRoot}/cars/:id?`, (req, res) => {
  var query = {};
  var id = req.params.id;
  let data = cars;
  if (id) {
    data = cars.find((car) => id === car.id);
  }
  return res.status(200).json(data);
});

// GET /cars - get all the cars
//--- /cars/Bugatti%20Veyron <-- other ways of doing it
// GET /cars/:id

// /cars
// /cars/78asd6f8s6d9

//TODO: Create a create (POST) route
app.post(`${fullAPIRoot}/cars/`, (req, res) => {
  const newCar = {
    id: cars.length,
    ...req.body,
  };
  cars.push(newCar);
  return res.status(201).json(newCar);
});

//TODO: Create a update (PUT) route

//TODO: Create a delete (DELETE) route

// 404 Route
app.all("*", (req, res) => {
  res.sendStatus(404);
});

app.listen(PORT, function () {
  console.log(`Listening on ${PORT}`);
});

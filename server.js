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

// TODO: Connect Database
// mongoose.Promise = global.Promise;
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(function () {
    console.log("DB Connected");
  })
  .catch(function (error) {
    console.log("Error connecting to DB", error);
  });

// TODO: Define a car schema and model
const { Schema } = mongoose;
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

//TODO: Create a read (GET) route

app.get(`${fullAPIRoot}/cars/:id?`, (req, res) => {
  let query = {};
  const { id } = req.params;
  if (id) {
    query._id = id;
  }
  Car.find(query).exec(function (err, cars) {
    if (err) return res.status(500).send(err);
    return res.status(200).send(cars);
  });
});

// GET /cars - get all the cars
//--- /cars/Bugatti%20Veyron <-- other ways of doing it
// GET /cars/:id

// /cars
// /cars/78asd6f8s6d9
app.options('*', function(req, res, next){
  res.set('Allow', 'GET, POST, PUT, DELETE, OPTIONS');
  res.send('Allow: GET, POST, PUT, DELETE, OPTIONS, HEAD');
});

app.head('*', function(req, res, next){
  res.status(200).send(req.headers);
});

//TODO: Create a create (POST) route
app.post(`${fullAPIRoot}/cars/`, (req, res) => {
  const carData = req.body;
  if (carData.avatar_url === "") {
    delete carData.avatar_url;
  }
  if(!carData.name) {
    return res.status(400).send('NO_NAME_PROVIDED');
  }

  if(!carData.bhp) {
    return res.status(400).send('NO_BHP_PROVIDED');
  }
  const car = new Car(carData);
  car.save(function (err, newCar) {
    if (err) return res.status(500).send(err);
    return res.status(201).send(newCar);
  });
});

//TODO: Create a update (PUT) route
app.put(`${fullAPIRoot}/cars/:id`, (req, res) => {
  const updateData = req.body;
  console.log(`Updating ${req.params.id}`, updateData);

  Car.updateOne({ _id: req.params.id }, updateData, function (err, result) {
    if (err) {
      return res.status(500).send(err);
    }
    console.log("result", result);
    if (result.nModified === 0) return res.sendStatus(404);
    res.status(200).send(result);
  });
});

//TODO: Create a delete (DELETE) route
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

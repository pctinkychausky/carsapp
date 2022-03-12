const express = require("express");
const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const apiRoot = "/api/";
const version = "v1";
const fullAPIRoot = apiRoot + version;

const { PORT = 3333, MONGODB_URI = "mongodb://localhost/cars_jump" } =
  process.env;

app.use(express.static("public"));

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// parse application/json
app.use(express.json());

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

const driverSchema = new Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

const Driver = mongoose.model("Driver", driverSchema);

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

app.post(`${fullAPIRoot}/cars/`, (req, res) => {
  const carData = req.body;
  if (carData.avatar_url === "") {
    delete carData.avatar_url;
  }
  if (!carData.name) {
    return res.status(400).send("NO_NAME_PROVIDED");
  }

  if (!carData.bhp) {
    return res.status(400).send("NO_BHP_PROVIDED");
  }
  const car = new Car(carData);
  car.save(function (err, newCar) {
    if (err) return res.status(500).send(err);
    return res.status(201).send(newCar);
  });
});

app.put(`${fullAPIRoot}/cars/:id`, (req, res) => {
  const updateData = req.body;
  console.log(`Updating ${req.params.id}`, updateData);

  if (!req.body) {
    return res.status(400).send("No update data provided");
  }

  Car.updateOne({ _id: req.params.id }, updateData, function (err, result) {
    if (err) {
      return res.status(500).send(err);
    }
    console.log("result", result);
    if (result.n === 0) return res.sendStatus(404);
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

// ******************* DRIVERS **********************//
app.get(`${fullAPIRoot}/drivers/:id?`, (req, res) => {
  let query = {};
  const { id } = req.params;
  if (id) {
    query._id = id;
  }
  Driver.find(query).exec(function (err, drivers) {
    if (err) return res.status(500).send(err);
    return res.status(200).send(drivers);
  });
});

app.post(`${fullAPIRoot}/drivers/`, body("email").isEmail(), (req, res) => {
  const driverData = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (!driverData.firstname) {
    return res.status(400).send("NO_FIRSTNAME_PROVIDED");
  }
  if (!driverData.lastname) {
    return res.status(400).send("NO_LASTNAME_PROVIDED");
  }

  if (!driverData.age) {
    return res.status(400).send("NO_AGE_PROVIDED");
  }
  const driver = new Driver(driverData);
  driver.save(function (err, newDriver) {
    if (err) return res.status(500).send(err);
    return res.status(201).send(newDriver);
  });
});

app.put(
  `${fullAPIRoot}/drivers/:id`,
  body("email").isEmail().optional(),
  (req, res) => {
    const updateData = req.body;
    console.log(`Updating ${req.params.id}`, updateData);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    Driver.updateOne(
      { _id: req.params.id },
      updateData,
      function (err, result) {
        if (err) {
          return res.status(500).send(err);
        }
        console.log("result", result);
        if (result.n === 0) return res.sendStatus(404);
        res.status(200).send(result);
      }
    );
  }
);

app.delete(`${fullAPIRoot}/drivers/:id`, (req, res) => {
  console.log("driverToBeDeleted", req.params.id);
  Driver.deleteOne({ _id: req.params.id }, function (err, result) {
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

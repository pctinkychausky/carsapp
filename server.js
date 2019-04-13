const express = require('express');
const bodyParser = require('body-parser');
var mongoose = require('mongoose');

const app = express();
const PORT = 3333;

const {
    MONGODB_URI
} = process.env;

// const MONGODB_URI = process.env.MONGODB_URI

app.use(express.static('public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

mongoose.Promise = global.Promise;
var promise = mongoose.connect(MONGODB_URI || 'mongodb://localhost/first_servers', { useNewUrlParser: true });

promise.then(function(db) {
    console.log('DATABASE CONNECTED!!');
}).catch(function(err){
    console.log('CONNECTION ERROR', err);
});
    

var Schema = mongoose.Schema;
var carSchema = new Schema({
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
        required: true
    }
});

var Car = mongoose.model('Car', carSchema);

// GET /cars - get all the cars
// GET /cars/:id //--- /cars/Bugatti%20Veyron

// /cars
// /cars/78asd6f8s6d9

app.get('/twitter', function(req, res){
    //
})

app.get('/cars/:id?', (req, res) => {
    var query = {};
    var id = req.params.id;
    if (id) {
        query._id = id
    }
    Car.find(query).exec(function(err, cars){
        if (err) return res.status(500).send(err);
        res.status(200).json(cars);
    });
});

app.post('/cars', (req, res) => {
    var newCar = req.body;
    console.log('newCar', newCar);
    var car = new Car(newCar);
    car.save(function(err, carModel){
        if (err) {
            return res.status(500).send(err);
        }
        res.status(201).send(carModel);
    });
});

app.put('/cars/:id', (req, res) => {
    console.log(`Updating ${req.params.id}`, req.body);
    Car.updateOne({ _id: req.params.id }, req.body, function(err, result){
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).send(result);
    });
});


app.delete('/cars/:id', (req, res) => {
    console.log('carToBeDeleted', req.params.id);
    Car.deleteOne({ _id: req.params.id }, function(err){
        if (err) {
            return res.status(500).send(err);
        }
        res.sendStatus(204);
    });
});

app.listen(PORT, function(){
    console.log(`Listening on ${PORT}`);
});
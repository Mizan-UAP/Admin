const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const bodyParser = require('body-parser')

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.djtwh.mongodb.net/Products?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

client.connect(err => {
    const collection = client.db("AdminUser").collection("Products");

    // send data to db
    app.post("/addItem", (req, res) => {
        const item = req.body;
        collection.insertOne(item)
            .then(result => {
                res.redirect('/')
            })

    })

    //Getting Data from db
    app.get('/items', (req, res) => {
        collection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    //delete one from db
    app.delete('/delete/:id', (req, res) => {
        collection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                res.send(result.deletedCount > 0)
            })
    })

    //updateDatabase
    app.patch('/update/:id', (req, res) => {
        collection.updateOne({ _id: ObjectId(req.params.id) },
            {
                $set: { name: req.body.name, price: req.body.price, date: req.body.date }
            })
            .then(result => {
                res.send(result.modifiedCount > 0)
            })
    })

    //updateUI
    app.get('/update/:id', (req, res) => {
        collection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })

    // client.close();
});

app.listen(process.env.PORT|| 5000);
const express = require('express');
const bodyParser= require('body-parser')
const app = express();
const path = require('path');
const port = 3000


const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId


const connectString = 'mongodb+srv://Xuan:123@cluster0.0u0myb4.mongodb.net/'

MongoClient.connect(connectString, { useUnifiedTopology: true })
  .then(client =>{
    console.log('Connected to DataBase')
    const db = client.db('BikeAccessories')
    const quoteCollection = db.collection('quotes')

    app.set('view engine', 'ejs')
    app.use(bodyParser.urlencoded({Pextended: true}))

    app.use(express.static(path.join(__dirname, 'public')))
    app.use('/public', express.static(path.join(__dirname, 'public')))
    app.use('/img', express.static(path.join(__dirname, 'img')))
    app.use('/js', express.static(path.join(__dirname, 'js')))

    app.use(bodyParser.json())


    app.get('/', (req, res) => {
      db.collection('quotes').find().toArray()
          .then(results => {
              const quotes = results;
              console.log(results)

              res.render('LandingPage.ejs', { quotes })
          })
          .catch(error => {
            console.error(error);
            res.sendStatus(500);
          });
        })


        app.post('/add', (req, res) => {
          quoteCollection
            .insertOne(req.body)
            .then(result => {
              console.log(result);
              res.redirect('/');
            })
            .catch(error => console.error(error));
        });
      
      app.get('/delete/:id', (req, res) => {
          quoteCollection.deleteOne({ _id: new ObjectId(req.params.id) })
              .then(result => {
                  res.redirect('/');
              })
              .catch(error => console.error(error));
      });
      

      app.listen(3000, function() {
        console.log('listening on 3000')
    })
  })


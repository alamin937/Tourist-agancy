const express = require('express')
const cors = require('cors')
var MongoClient = require('mongodb').MongoClient;
const app = express()
require('dotenv').config()

// middleware
app.use(cors())
app.use(express.json())

const port = process.env.PORT || 5000



app.get('/', (req,res) =>{
    res.send('Hello world')
})


var uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-shard-00-00.bzphb.mongodb.net:27017,cluster0-shard-00-01.bzphb.mongodb.net:27017,cluster0-shard-00-02.bzphb.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-rs3vfq-shard-0&authSource=admin&retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      const database = client.db("Travel_Services");
      const collectUser = database.collection("Tourist");
      const collectUserInfo = database.collection("users");

    // post api
    app.post('/tourist', async(req,res) =>{
        const tourist = req.body;
        const result = await collectUser.insertOne(tourist)
        console.log('hitting api', req.body)
        console.log('hitte', result)
        res.json(result)
    })
    // get api
    app.get('/tourist', async(req,res) =>{
        const cursor = collectUser.find({})
        const result = await cursor.toArray()
        res.send(result);
    })
    // user api
    app.post('/users', async(req,res) =>{
        const users = req.body;
        const result = await collectUserInfo.insertOne(users)
        console.log('hitting api', req.body)
        console.log('hitte', result)
        res.json(result)
    })
    // user get
    app.get('/users', async(req,res) =>{
        const cursor = collectUserInfo.find({})
        const result = await cursor.toArray()
        res.send(result);
        })

        // my events
        app.get('/users/:email', async(req,res) =>{
            const result = await collectUserInfo.find({
                email: req.params.email
            }).toArray()
            res.send(result)
        })

      










    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);


app.listen(port, () =>{
    console.log('Running port', port)
})
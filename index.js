const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jegp2c1.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        // database 
        const CoffeeCollection = client.db('coffeeDB').collection('coffee');
        

        // upload to DB
        app.post('/coffee', async(req, res) =>{
            const newCoffee = req.body;
            // console.log('new Coffee');
            const result = await CoffeeCollection.insertOne(newCoffee);
            res.send(result);
        })

        // read DB
        app.get('/coffee', async(req, res) =>{
            const cursor = CoffeeCollection.find()
            // console.log('new Coffee');
            const result = await cursor.toArray()
            res.send(result);
        })
        

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensure that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Coffee Server is Running');
});

app.listen(port, () => {
    console.log(`Coffee Server is Running on Port : ${port}`);
});

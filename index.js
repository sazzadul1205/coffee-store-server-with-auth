const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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
        const UserCollection = client.db('coffeeDB').collection('user');

        // view all coffees
        app.get('/coffee', async (req, res) => {
            const cursor = CoffeeCollection.find()
            const result = await cursor.toArray()
            res.send(result);
        })

        // view a individual coffee
        app.get('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await CoffeeCollection.findOne(query)
            res.send(result);
        })

        // upload a item to DB
        app.post('/coffee', async (req, res) => {
            const newCoffee = req.body;
            const result = await CoffeeCollection.insertOne(newCoffee);
            res.send(result);
        })

        // Update an item from DB
        app.put('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateCoffee = req.body;
            const coffee = {
                $set: {
                    name: updateCoffee.name,
                    quantity: updateCoffee.quantity,
                    supplier: updateCoffee.supplier,
                    taste: updateCoffee.taste,
                    details: updateCoffee.details,
                    photo: updateCoffee.photo,
                    category: updateCoffee.category
                }
            };
            const result = await CoffeeCollection.updateOne(filter, coffee, options);
            res.send(result);
        });

        // Delete a item from DB
        app.delete('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await CoffeeCollection.deleteOne(query);
            res.send(result);
        })

        // user part api

        // view all users
        app.get('/user', async (req, res) => {
            const cursor = UserCollection.find()
            const result = await cursor.toArray()
            res.send(result);
        })

        // view a individual user
        app.get('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await UserCollection.findOne(query);
            res.send(result);
        })


        // create a new user
        app.post('/user', async (req, res) => {
            const newUser = req.body;
            const result = await UserCollection.insertOne(newUser);
            res.send(result);
        })

        // modify/Update a user
        app.patch('/user', async (req, res) => {
            const email = req.body.email; 
            const filter = { email: email };
            const user = req.body;
            const updatedDoc = {
                $set: {
                    lastLoggedAt: user.lastLoggedAt,
                }
            };
            const result = await UserCollection.updateOne(filter, updatedDoc); // Use UserCollection instead of CoffeeCollection
            res.send(result);
        });


        // delete existing user
        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await UserCollection.deleteOne(query);
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

const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ot7tc.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    client.connect()
    const partsCollection = client.db("cycle").collection("parts");
    const orderCollection = client.db("cycle").collection("orders");
    const usersCollection = client.db("cycle").collection("users");
    const reviewsCollection = client.db("cycle").collection("reviews");
    const profileCollection = client.db("cycle").collection("profiles");


    try {
        app.get('/parts', async (req, res) => {
            const query = {}
            const cursor = await partsCollection.find(query).toArray()
            res.send(cursor)
        })
        app.post('/parts', async (req, res) => {
            const query = req.body
            const result = await partsCollection.insertOne(query)
            res.send(result)
        })
        app.get('/parts/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await partsCollection.findOne(query)
            res.send(result)
        })
        app.put('/parts/:id', async (req, res) => {
            const id = req.params.id
            const quantity = req.body
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updatedDoc = {
                $set: quantity
            }
            const result = await partsCollection.updateOne(filter, updatedDoc, options)
            res.send(result)
        })
        app.get('/orders', async (req, res) => {
            const query = {}
            const result = await orderCollection.find(query).toArray()
            res.send(result)
        })
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const result = await orderCollection.deleteOne(filter)
            res.send(result)
        })
        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id
            const payment = req.body
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updatedDoc = {
                $set: payment
            }
            const result = await orderCollection.updateOne(filter, updatedDoc, options)
            res.send(result)
        })
        app.get('/orders/:email', async (req, res) => {
            const email = req.params.email
            const query = { email: email }
            const result = await orderCollection.find(query).toArray()
            res.send(result)
        })
        app.post('/orders', async (req, res) => {
            const query = req.body
            const result = await orderCollection.insertOne(query)
            res.send(result)
        })
        app.get('/users', async (req, res) => {
            const query = {}
            const result = await usersCollection.find(query).toArray()
            res.send(result)
        })
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email
            const query = { userEmail: email }
            const user = await usersCollection.findOne(query)
            const isAdmin = user.role === "admin"
            res.send({ admin: isAdmin })
        })
        app.post('/users', async (req, res) => {
            const query = req.body
            const result = await usersCollection.insertOne(query)
            res.send(result)
        })
        app.put('/users/admin/:email', async (req, res) => {
            const email = req.params.email
            const filter = { userEmail: email }
            const updatedDoc = {
                $set: { role: 'admin' },
            }
            const result = await usersCollection.updateOne(filter, updatedDoc)
            res.send(result)
        })
        app.get('/reviews', async (req, res) => {
            const query = {}
            const result = await reviewsCollection.find(query).toArray()
            res.send(result)
        })
        app.post('/reviews', async (req, res) => {
            const query = req.body
            const result = await reviewsCollection.insertOne(query)
            res.send(result)
        })
        app.get('/profiles/:email', async (req, res) => {
            const email = req.params.email
            const query = { email: email }
            const result = await profileCollection.find(query).toArray()
            res.send(result)
        })
        app.post('/profiles', async (req, res) => {
            const query = req.body
            const result = await profileCollection.insertOne(query)
            res.send(result)
        })
        // app.put('/users/:email', async (req, res) => {
        //     const email = req.params.email
        //     const user = req.body
        //     const filter = { userEmail: email }
        //     const options = { upsert: true }
        //     const updatedDoc = {
        //         $set: user
        //     }
        //     const result = await usersCollection.updateOne(filter, updatedDoc, options)
        //     res.send(result)
        // })

    } finally {

    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
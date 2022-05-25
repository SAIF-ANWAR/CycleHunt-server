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
    try {
        app.get('/parts', async (req, res) => {
            const query = {}
            const cursor = await partsCollection.find(query).toArray()
            res.send(cursor)
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
            console.log(quantity)
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updatedDoc = {
                $set: quantity
            }
            const result = await partsCollection.updateOne(filter, updatedDoc, options)
            res.send(result)
        })
        app.post('/orders', async (req, res) => {
            const query = req.body
            const result = await orderCollection.insertOne(query)
            res.send(result)
        })

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
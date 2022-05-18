const express = require('express');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//use middleware
app.use(cors());
app.use(express.json());

//user: dbusesr1
//pass: 3yMSxnnPf5EMrUZ1



const uri = "mongodb+srv://dbusesr1:3yMSxnnPf5EMrUZ1@cluster0.m12jl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

    try {
        await client.connect();

        const taskCollection = client.db("to-do-app").collection("to-do");

        //get all tasks
        app.get('/tasks', async (req, res) => {
            const query = {};
            const cursor = taskCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);
        })

        // POST task: add a new task 
        app.post('/task', async (req, res) => {
            const newUser = req.body;
            console.log("adding new user", newUser);
            const result = await taskCollection.insertOne(newUser);
            res.send(result)
        });

        //delete a task
        app.delete('/task/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };

            const result = await taskCollection.deleteOne(query);
            res.send(result);
        })

        // update a task 
        app.put('/task/:id', async (req, res) => {
            const id = req.params.id;
            const updatedTask = req.body;
            console.log(id, updatedTask);
            const filter = { _id: ObjectId(id) };
            const ooptions = { upsert: true };

            const updatedDoc = {
                $set: {
                    complete: updatedTask.complete,

                }
            };
            const result = await taskCollection.updateOne(filter, updatedDoc, ooptions);
            res.send(result);
        })

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Running my node CRUD server');
})

app.listen(port, () => {
    console.log('CRUD server is running');
});
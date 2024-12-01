const express = require('express');
const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');
const User = require('./db/user_schema');

const app = express();
const PORT = '3000';

app.use(express.json()); //this is to accept data in json format
app.use(express.urlencoded({extended: true})); // ths is to decode data sent from html form 
app.use(express.static('public'));

//set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', './views');

// DATABASE CONNECTION



const uri = "mongodb+srv://binutiri:bibetos1234@cluster0.a9rq7.mongodb.net/taskdb?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    family: 4,
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
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

// API ROUTES

app.get('/', (req, res)=>{
    res.render(__dirname + '/views/login.ejs');
});

app.get('/login', (req, res)=>{
    res.render(__dirname + '/views/login.ejs');
});

app.get('/signup', (req, res)=>{
    res.render(__dirname + '/views/signup.ejs');
});

app.get('/addtask', (req, res)=>{
  res.render(__dirname + '/views/index.ejs');
});

app.post('/signup', async (req, res)=>{
    try{
        const newUser = new User({
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
        })
        await newUser.save();
        res.redirect("/");
    }catch(err) {
        console.log(err.message);
        res.status(500).json({message: err.mesage});
    }
})
// Handle form submission
// app.post('/signup/register', async (req, res) => {
//     try {
//       const { email, username, password } = req.body;
  
//       // Create a new user instance
//       const newUser = new User({
//         email,
//         username,
//         password, // Password will be hashed if you're using bcrypt
//       });
  
//       // Save user to the database
//       await newUser.save();
//       res.send('User registered successfully!');
//     } catch (error) {
//       console.error('Error saving user:', error.message);
//       res.status(500).send('Error registering user.');
//     }
//   });



app.listen(PORT || 5000, ()=>{
    console.log(`server is running on port ${PORT}`);
})
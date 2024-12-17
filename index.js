const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const User = require('./db/user_schema');
const Task = require('./db/taskSchema');

const app = express();
const PORT = '3000';
const JWT_SECRET = process.env.JWT_SECRET; // Use an environment variable in production


app.use(express.json()); //this is to accept data in json format
app.use(express.urlencoded({extended: true})); // ths is to decode data sent from html form 
app.use(express.static('public'));
app.use(cookieParser());

//set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', './views');

// DATABASE CONNECTION
const uri = process.env.DB_CONNECTION;

// Function to connect to mongodb
const connectWithRetry = ()=>{
  console.log("Mongodb connection with retry");
  mongoose.connect(uri, { family: 4})
  .then(()=>{
    console.log('Mongodb is connected');
  })
  .catch(err =>{
    console.log('Mongodb connection unsuccessful, retry after 5 seconds', err);
    setTimeout(connectWithRetry, 5000);
  });
};
connectWithRetry();

// API Routte to display login page
app.get('/', (req, res)=>{
    res.render(__dirname + '/views/login.ejs');
});
// Route to Render Tasks from mongodb
app.get('/index', async (req, res)=>{
  try {
    const tasks = await Task.find();  // Fetch tasks from the database
    res.render('index.ejs', { tasks });   // Pass tasks to the EJS template
  } catch (error) {
    console.error('Error retrieving tasks:', error);
    res.status(500).send('Error retrieving tasks.');
  }
});

app.get('/signup', (req, res)=>{
    res.render(__dirname + '/views/signup.ejs');
});


app.get('/add', (req, res)=>{
  res.render(__dirname + '/views/add.ejs');
});


//Register new user
app.post('/signup', async (req, res)=>{
  try{
      const data = { 
        email: req.body.email, 
        username: req.body.username,
        password: req.body.password 
      } 
      const email = data.email;
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: 'Email already in use' });

      const saltRound = 10;
      const hashedPassword = await bcrypt.hash(data.password, saltRound);
      data.password = hashedPassword;
      const user = new User(data);
      await user.save();
      console.log(user);      
      
      // res.status(201).send({message: "User registered successfully"});
      res.redirect('/');


  }catch(error) {
      res.status(400).send({error: error.message});
  }
})


// Login Route

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Invalid credentials' });
    // res.json({ message: 'Login successful' });
    res.redirect('/index');
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});

// Protected Route Example
// app.get('/index', (req, res) => {
//   const token = req.cookies.token;
//   if (!token) return res.status(401).json({ message: 'Unauthorized' });

//   jwt.verify(token, JWT_SECRET, (err, user) => {
//     if (err) return res.status(403).json({ message: 'Invalid token' });
//     res.json({ message: 'Welcome to your dashboard!', user });
//   });
// });


//Add new task to mongodb
app.post('/add', async (req, res) => {
  try {
    const { title, description, priority, deadline } = req.body;
    const newTask = new Task({
      title,
      description,
      priority,
      deadline,
    });
    await newTask.save();
    res.redirect('/index');
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).send('Error adding task.');
  }
});

app.post('/delete/:id', async (req, res) => {
  try {
    const id = req.params.id; // Get the ID from the URL and save it as a variable
    console.log(`Deleting item with ID: ${id}`); // Optional: Log the ID for debugging

    const deletedItem = await Task.findByIdAndDelete(id); // Use the variable in the database operation

    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found!' });
    }

    res.redirect('/index');
  } catch (error) {
    res.status(500).json({ message: 'Error deleting item', error: error.message });
  }
});




  


app.listen(PORT || 5000, ()=>{
    console.log(`server is running on port ${PORT}`);
})
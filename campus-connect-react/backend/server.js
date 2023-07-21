if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const port = 3000
const bcrypt = require('bcrypt')
// const axios = require('axios');
const { MongoClient } = require('mongodb');
const url = 'mongodb+srv://fengj5:fHg06pjJ5ltsv0G8@cluster0.nrh8keh.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(url);
app.set("view-engine", "ejs")
app.use(express.json());
app.use(bodyParser.json());
const cors = require('cors'); // Place this with other requires (like 'path' and 'express')

mongoose.connect('mongodb+srv://fengj5:fHg06pjJ5ltsv0G8@cluster0.nrh8keh.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});



app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");

    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, DELETE, OPTIONS, PUT"
    );
    next();
});

// app.use(cors({
//     origin: 'http://localhost:5173',
//     methods: 'GET, POST, PATCH, DELETE, OPTIONS, PUT',
// }));


app.post('/db/login', async (req, res) => {
    try {
        await client.connect();
        const database = client.db('CampusConnect');
        const collection = database.collection('users');
        const { name, password, email } = req.body;
        const user = await collection.findOne({ name, email });

        if (user && await bcrypt.compare(password, user.password)) {
            res.json({ success: true });
        } else {
            res.json({ success: false, message: 'Incorrect username, RPI email, or password' });
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'An error occurred while logging in.' });
    } finally {
        await client.close();
    }
})


app.post('/db/register', async(req, res) => {
  try{
      await client.connect();
      const database = client.db('CampusConnect');
      const collection = database.collection('users');
      const userCount = await collection.countDocuments();
      const { userName, password, rpiEmail } = req.body;

      // Simple check for RPI email domain
      const isRpiEmail = rpiEmail.endsWith('@rpi.edu');
      if (!isRpiEmail) {
        res.json({ success: false, message: 'Please provide a valid RPI email address' });
      }
    
      const existUser = await collection.findOne({ $or: [{ userName }, { rpiEmail }] });
      if (existUser) {
          res.json({ success: false, message: 'Username or RPI email already exists' });
      } else {
          const hashedPassword = await bcrypt.hash(password, 10);

          // Create the new user object with the required fields
          const newUser = {
            user_id: userCount + 1,
            userName,
            rpiEmail,
            password: hashedPassword,
            admin: 0
          };

          // Insert the new user into the database
          await collection.insertOne(newUser);

          // Close the database connection
          client.close();
          res.status(201).json({ message: 'User registered successfully!', user: newUser });
      }
  } catch (err){
      console.error(err);
      res.status(500).json({ error: 'An error occurred while signing up.' });
  }
})


// Create a new post to the database
app.post('/db/posts', async (req, res) => {
    try {
        await client.connect();
        const database = client.db('CampusConnect');
        const collection = database.collection('post');
        const { title, body } = req.body;
        await collection.insertOne({ title, body, likes: [], comments: [], date: new Date(), countLikes: 0, countComments: 0 });
        res.json({ success: true, message: 'User post successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while posting' });
    } finally {
        await client.close();
    }
});


app.get('/db/posts', async (req, res) => {
    try {
        await client.connect();
        const database = client.db('CampusConnect');
        const collection = database.collection('post');
        const posts = await collection.find({}).toArray();
        res.json({ success: true, posts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while getting posts' });
    } finally {
        await client.close();
    }
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
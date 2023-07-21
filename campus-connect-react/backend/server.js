if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const port = 3000
const bcrypt = require('bcrypt')
const { ObjectId } = require('mongodb');
// const axios = require('axios');
const { MongoClient } = require('mongodb');
const url = 'mongodb+srv://fengj5:fHg06pjJ5ltsv0G8@cluster0.nrh8keh.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(url);
app.set("view-engine", "ejs")
app.use(express.json());
const cors = require('cors'); // Place this with other requires (like 'path' and 'express')
app.use(bodyParser.json()); // Middleware to parse incoming JSON data

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

// Endpoint for liking a post
app.post('/db/like', async (req, res) => {
  const { userId, postId } = req.body;
  // console log the userId and postId
  try {
      // Grab the postID from the database collection
      await client.connect();
      const database = client.db('CampusConnect');
      const postsCollection = database.collection('post');

      // Find the post and check if the post exists
      const parsedPostId = parseInt(postId);
      const parsedUserId = parseInt(userId);
      const existPost = await postsCollection.findOne({ "postid": parsedPostId });
      if (!existPost) {
        return res.status(404).json({ error: 'Post not found.' });
      }

      // Check if the user has already liked the post
      if (existPost.likes.includes(parsedUserId)) {
        return res.status(400).json({ error: 'User has already liked this post.' });
      }

      // Step 3: Update the post with the like count and userId
      const updatedPost = await postsCollection.findOneAndUpdate(
        { "postid": parsedPostId },
        {
          $inc: { "countLikes": 1 },
          $push: { likes: parsedUserId },
        },
        { returnOriginal: false }
      );
      res.status(200).json({ message: 'Post liked successfully' });

    } catch (error) {
      console.error('Error occurred:', error);
      res.status(500).json({ error: 'Something went wrong.' });
    } finally {
      await client.close();
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
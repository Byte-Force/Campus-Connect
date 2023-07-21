if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
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

app.post('/db/register', async (req, res) => {
    try {
        await client.connect();
        const database = client.db('CampusConnect');
        const collection = database.collection('users');
        const { name, password, email } = req.body;

        // Regular expression for RPI email
        const rpiEmailRegex = /^[a-zA-Z0-9._%+-]+@rpi.edu$/;

        // Check if email is RPI email
        if (!rpiEmailRegex.test(email)) {
            res.json({ success: false, message: 'Please provide a valid RPI email.' });
            return;
        }
        const currUser = await collection.findOne({ $or: [{ name }, { email }] });

        if (currUser) {
            res.json({ success: false, message: 'Username or RPI email already exists' });
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            await collection.insertOne({ name, password: hashedPassword, email, admin: 0 });
            res.json({ success: true, message: 'User successfully registered' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while signing up.' });
    } finally {
        await client.close();
    }
})

// Define the Post schema
const postSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    likes: { type: Number, default: 0 },
    postId: { type: mongoose.Schema.Types.ObjectId, required: true },
});
const Post = mongoose.model('Post', postSchema);

// Endpoint for liking a post
app.post('/db/like', async (req, res) => {
    const { userId, postId } = req.body;

    try {
        // Find the post in the database
        const post = await Post.findOne({ postId });

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Increment the likes count and save the updated post
        post.likes += 1;
        await post.save();

        return res.status(200).json({ message: 'Post liked successfully' });
    } catch (err) {
        return res.status(500).json({ message: 'An error occurred', error: err });
    }
});


// Create a new post to the database
app.post('/db/posts', async (req, res) => {
    try {
        await client.connect();
        const database = client.db('CampusConnect');
        const collection = database.collection('post');
        const { title, body } = req.body;
        await collection.insertOne({ title, body, likes: [], comments: [], date: new Date() });
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
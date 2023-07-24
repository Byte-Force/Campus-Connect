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
const { json } = require('body-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const SpamClassifier = require('./spam_classifier');





const url = 'mongodb+srv://fengj5:fHg06pjJ5ltsv0G8@cluster0.nrh8keh.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(url);
const spamClassifier = new SpamClassifier(
    "Campus-Connect/campus-connect-react/src/ml/spam/spam-lstm.onnx",
    "Campus-Connect/campus-connect-react/src/ml/spam/tokenizer_config.json",
    "Campus-Connect/campus-connect-react/src/ml/spam/text_vocab.pkl",
    "Campus-Connect/campus-connect-react/src/ml/spam/label_vocab.pkl"
    );

app.set("view-engine", "ejs")
app.use(express.json());

const cors = require('cors'); // Place this with other requires (like 'path' and 'express')
app.use(bodyParser.json()); // Middleware to parse incoming JSON data


// mongoose.connect('mongodb+srv://fengj5:fHg06pjJ5ltsv0G8@cluster0.nrh8keh.mongodb.net/?retryWrites=true&w=majority', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });


const store = new MongoDBStore({
    uri: url,
    collection: 'userSessions',
    autoRemove: 'interval',
    autoRemoveInterval: 10 // In minutes. Default
});

// Listen for errors on the store.
store.on('error', function (error) {
    console.log(error);
});

app.set('view-engine', 'ejs');
app.use(express.json());
app.use(json());
app.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));


app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader("Access-Control-Allow-Credentials", "true");
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

app.get('/db/check_login', async (req, res) => {
    if (req.session && req.session.userId) {
        try {
            // Use the existing client instance to access the database
            const database = client.db('CampusConnect');
            const collection = database.collection('users');
            const user = await collection.findOne({ user_id: req.session.userId });
            if (user) {
                res.json({ loggedIn: true, userName: user.userName, user_id: user_id });
            } else {
                res.json({ loggedIn: false, userName: null, user_id: null });
            }
        } catch (error) {
            console.error('Error while checking login status:', error);
            res.json({ loggedIn: false, userName: null, user_id: null });
        }
    } else {
        res.json({ loggedIn: false, userName: null, user_id: null });
    }
});


app.post('/db/login', async (req, res) => {
    try {
        await client.connect();
        const database = client.db('CampusConnect');
        const collection = database.collection('users');
        const { userName, password } = req.body;
        const user = await collection.findOne({ userName });

        if (user && await bcrypt.compare(password, user.password)) {
            req.session.userName = user.userName;
            console.log("Session after login: ", req.session); // Log session information
            res.json({ success: true, userName: user.userName, user_id: user.user_id });
        } else {
            res.json({ success: false, message: 'Incorrect username or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while logging in.' });
    }
});


app.post('/db/register', async (req, res) => {
    try {
        await client.connect();
        const database = client.db('CampusConnect');
        const collection = database.collection('users');
        const userCount = await collection.countDocuments();
        const { userName, password, rpiEmail } = req.body;

        const isRpiEmail = rpiEmail.endsWith('@rpi.edu');
        if (!isRpiEmail) {
            res.json({ success: false, message: 'Please provide a valid RPI email address' });
        }

        const existUser = await collection.findOne({ $or: [{ userName }, { rpiEmail }] });
        if (existUser) {
            res.json({ success: false, message: 'Username or RPI email already exists' });
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = {
                user_id: userCount + 1,
                userName,
                rpiEmail,
                password: hashedPassword,
                admin: 0
            };

            const result = await collection.insertOne(newUser);
            req.session.userId = result.insertedId;
            //return res.json({ success: true });
            return res.json({ success: true, userName: newUser.userName, user_id: newUser.user_id });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while signing up.' });
    }
});


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


// Endpoint for commenting a post
app.post('/db/comment', async (req, res) => {
    const { commentBody, postId } = req.body;
    // console log the userId and postId
    try {
        // Grab the postID from the database collection
        await client.connect();
        const database = client.db('CampusConnect');
        const postsCollection = database.collection('post');

        // Find the post and check if the post exists
        const parsedPostId = parseInt(postId);
        const existPost = await postsCollection.findOne({ "postid": parsedPostId });
        if (!existPost) {
            return res.status(404).json({ error: 'Post not found.' });
        }

        // Update the post with the comment content and increment the comment count
        console.log("Comment body: ", commentBody);
        const updatedPost = await postsCollection.findOneAndUpdate(
            { "postid": parsedPostId },
            {
                $inc: { countComments: 1 },
                $push: { comments: commentBody },
            },
            { returnOriginal: false }
        );
        res.status(200).json({ message: 'Post commented successfully' });

    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ error: 'Something went wrong.' });
    } finally {
        await client.close();
    }
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
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

const url = 'mongodb+srv://fengj5:fHg06pjJ5ltsv0G8@cluster0.nrh8keh.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(url);

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

    await client.close();

});


app.post('/db/login', async (req, res) => {
    try {
        // Connect to the MongoDB cluster and access the 'users' collection
        await client.connect();
        const database = client.db('CampusConnect');
        const collection = database.collection('users');
        const { userName, password } = req.body;

        // Check if the username exists in the database
        const user = await collection.findOne({ userName });

        // If the username exists, check if the password is correct
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
    await client.close();
});


app.post('/db/register', async (req, res) => {
    try {
        // Connect to the MongoDB cluster and access the 'users' collection
        await client.connect();
        const database = client.db('CampusConnect');
        const collection = database.collection('users');
        const userCount = await collection.countDocuments();

        // Extract the request body which contains the new user information
        const { userName, password, rpiEmail } = req.body;

        // Check if the email is a valid RPI email
        const isRpiEmail = rpiEmail.endsWith('@rpi.edu');
        if (!isRpiEmail) {
            res.json({ success: false, message: 'Please provide a valid RPI email address' });
        }

        // Check if the username or email already exists in the database
        // If so, return an error message
        // If not, create a new user in the database
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
            return res.json({ success: true, userName: newUser.userName, user_id: newUser.user_id });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while signing up.' });
    }
    finally {
        await client.close();
    }
});


// Create a new post to the database
app.post('/db/posts', async (req, res) => {
    try {
        await client.connect();
        const database = client.db('CampusConnect');
        const collection = database.collection('post');
        const { title, body, selectedCategory } = req.body;
        const postCount = await collection.countDocuments();
        await collection.insertOne({ title, body, likes: [], comments: [], date: new Date(), countLikes: 0, countComments: 0, postid: postCount + 1, category: selectedCategory });
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

// Delete a post from the database
app.delete('/db/posts/:postid', async (req, res) => {
    try {
        // Connect to the MongoDB cluster and access the 'post' collection
        await client.connect();
        const database = client.db('CampusConnect');
        const collection = database.collection('post');

        // Get the postId from the request URL
        const postIdToDelete = parseInt(req.params.postid); 

        // Check if the post exists before deleting
        const existingPost = await collection.findOne({ "postid": postIdToDelete });
        if (!existingPost) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Delete the post
        await collection.deleteOne({ "postid": postIdToDelete });
        res.json({ success: true, message: 'Post deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while deleting the post' });
    }
    finally {
        await client.close();
    }
});


app.get('/db/events', async (req, res) => {
    try {
        // Connect to the MongoDB cluster and access the 'events' collection
        await client.connect();
        const database = client.db('CampusConnect');
        const collection = database.collection('events');
        const events = await collection.find({}).toArray();
        res.json({ success: true, events });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while getting events' });
    } finally {
        await client.close();
    }
});


// Endpoint for liking a post
app.post('/db/like', async (req, res) => {
    // Request body should contain the userId and postId
    const { userId, postId } = req.body;
    try {
        // Connect to the MongoDB cluster and access the 'post' collection
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

        // Update the post with the like count and userId
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
    // Request body should contain the commentBody and postId
    const { commentBody, postId } = req.body;
    try {
        // Connect to the MongoDB cluster and access the 'post' collection
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
        // await client.close();
    }
});

// Endpoint for editing a post
// Edit a post in the database
app.put('/db/posts/:postid', async (req, res) => {
    // Get the postId from the request URL
    const postIdToUpdate = parseInt(req.params.postid);
    try {
        // Connect to the MongoDB cluster and access the 'post' collection
        await client.connect();
        const database = client.db('CampusConnect');
        const collection = database.collection('post');

        // Find the post with the specified postId
        const foundPost = await collection.findOne({ postid: postIdToUpdate });
        if (!foundPost) {
            // If the post with the specified postId is not found, return a 404 Not Found response
            return res.status(404).json({ error: 'Post not found' });
        }

        // Get the updated title and body from the request body
        const { title, body } = req.body;

        // Update the post with the new title and body
        await collection.updateOne(
            { postid: postIdToUpdate },
            { $set: { title: title, body: body } }
        );

        res.json({ success: true, message: 'Post updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while updating the post' });
    } finally {
        await client.close();
    }
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
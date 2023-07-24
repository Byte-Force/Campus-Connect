if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express');
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');
const { json } = require('body-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const app = express();
const port = 3000;
const url = 'mongodb+srv://fengj5:fHg06pjJ5ltsv0G8@cluster0.nrh8keh.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(url);

const store = new MongoDBStore({
  uri: url,
  collection: 'userSessions',
  autoRemove: 'interval',
  autoRemoveInterval: 10 // In minutes. Default
});

// Listen for errors on the store.
store.on('error', function(error) {
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
        await client.connect();
        const database = client.db('CampusConnect');
        const collection = database.collection('users');
        const user = await collection.findOne({ user_id: req.session.userId });
        if (user) {
            res.json({ loggedIn: true, userName: user.userName });
        } else {
            res.json({ loggedIn: false, userName: null });
        }
    } else {
        res.json({ loggedIn: false, userName: null });
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
            req.session.userId = user.user_id;
            console.log("Session after login: ", req.session); // Log session information
            res.json({ success: true });
        } else {
            res.json({ success: false, message: 'Incorrect username or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while logging in.' });
    }
});




app.post('/db/register', async(req, res) => {
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
            return res.json({ success: true });
        }
    } catch (err){
        console.error(err);
        res.status(500).json({ error: 'An error occurred while signing up.' });
    }
});



// // Define the Post schema
// const postSchema = new mongoose.Schema({
//     userId: { type: mongoose.Schema.Types.ObjectId, required: true },
//     likes: { type: Number, default: 0 },
//     postId: { type: mongoose.Schema.Types.ObjectId, required: true },
// });
// const Post = mongoose.model('Post', postSchema);

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
        //generate a new post id by counting the number of post in the database and then incrementing by 1 
        const postCount = await collection.countDocuments();
        const postId = postCount + 1;
        await collection.insertOne({ title, body, likes: [], comments: [], date: new Date(), countLikes: 0, countComments: 0, postid: postId });
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

// Endpoint to retrieve a specific post along with its comments
app.get('/db/posts/:postId', async (req, res) => {
    const postId = req.params.postId;
    try {
        console.log('postId:', postId);
        await client.connect();
        const database = client.db('CampusConnect');
        const collection = database.collection('post');
        const post = await collection.findOne({ "postid": parseInt(postId) });


        if (post) {
            res.json({ success: true, post });
        } else {
            res.status(404).json({ success: false, message: 'Post not found' });
        }
    } catch (error) {
        console.error('Error retrieving post:', error);
        res.status(500).json({ success: false, message: 'Error retrieving post' });
    }
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
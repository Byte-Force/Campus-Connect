if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const port = 5000
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const axios = require('axios');
const {MongoClient} = require('mongodb');
const url = 'mongodb+srv://fengj5:fHg06pjJ5ltsv0G8@cluster0.nrh8keh.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(url);

const initializePassport = require('./passport-config')
initializePassport(
    passport, 
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

// const users = []

app.set("view-engine", "ejs")
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({ 
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
app.use(express.json());

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


// The main page to be rendered is index.ejs. 
// This page will be rendered only if the user is authenticated.
app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', {name: req.user.name})
})


// app.get('/login', checkNotAuthenticated, (req, res) => {
//     res.render('login.ejs')
// })

app.post('/db/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}), async(req, res) => {
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


// app.get('/register', checkNotAuthenticated, (req, res) => {
//     res.render('register.ejs')
// })

app.post('/db/register', checkNotAuthenticated, async(req, res) => {
    try{
        await client.connect();
        const database = client.db('CampusConnect');
        const collection = database.collection('users');
        const { name, password, email } = req.body;

        // Regular expression for RPI email
        const rpiEmailRegex = /^[a-zA-Z0-9._%+-]+@rpi.edu$/;

        // Check if email is RPI email
        if (!rpiEmailRegex.test(rpiEmail)) {
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

        // res.redirect('/login')
    } catch (error){
        console.error(error);
        res.status(500).json({ error: 'An error occurred while signing up.' });
        // res.redirect('/register')
    } finally {
        await client.close();
    }
})

app.delete('/logout', (req, res) => {
    req.logOut(function(err){
        if (err){  return next(err)    }
        res.redirect('/login')
    })
})


// These two functions check if the user is authenticated or not.
// Based on that, the user will be redirected to the login page or the main page.
function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return res.redirect('/')
    }
    next()
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
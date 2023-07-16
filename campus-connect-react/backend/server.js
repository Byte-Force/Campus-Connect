const express = require('express');
const app = express();
const port = 3000;
const axios = require('axios');
const {MongoClient} = require('mongodb');
const url = 'mongodb+srv://fengj5:fHg06pjJ5ltsv0G8@cluster0.nrh8keh.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(url);
const bcrypt = require('bcrypt');
app.use(express.json());

// these codes are used for fix the CORS issue, the setHeader is different from development environment and production environment
// PLEASE be sure to change the setHeader when you deploy the backend to the production environment
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

// sign up endpoint
app.post('/db/signup', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('CampusConnect');
    const collection = database.collection('users');
    const { username, password, rpiEmail } = req.body;

    // Regular expression for RPI email
    const rpiEmailRegex = /^[a-zA-Z0-9._%+-]+@rpi.edu$/;

    // Check if email is RPI email
    if (!rpiEmailRegex.test(rpiEmail)) {
      res.json({ success: false, message: 'Please provide a valid RPI email.' });
      return;
    }

    const user = await collection.findOne({ $or: [{ username }, { rpiEmail }] });

    if (user) {
      res.json({ success: false, message: 'Username or RPI email already exists' });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      await collection.insertOne({ username, password: hashedPassword, rpiEmail, admin: 0 });
      res.json({ success: true, message: 'User successfully registered' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while signing up.' });
  } finally {
    await client.close();
  }
});




//login endpoint
app.post('/db/login', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('CampusConnect');
    const collection = database.collection('users');
    const { username, password, rpiEmail } = req.body;

    const user = await collection.findOne({ username, rpiEmail });

    if (user && await bcrypt.compare(password, user.password)) {
      res.json({ success: true });
    } else {
      res.json({ success: false, message: 'Incorrect username, RPI email, or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while logging in.' });
  } finally {
    await client.close();
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
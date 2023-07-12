//set server.js
const express = require('express');
const app = express();
const port = 3000;
const axios = require('axios');
const {MongoClient} = require('mongodb');

const url = 'mongodb+srv://fengj5:fHg06pjJ5ltsv0G8@cluster0.nrh8keh.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(url);

// app.use(express.json());
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "https://fengj5.eastus.cloudapp.azure.com/node");
//     // res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");

//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PATCH, DELETE, OPTIONS, PUT"
//   );

//   next();
// });

app.get('/db', async (req, res) => {
  // connect to database and call news api with axios https://newsapi.org/v2/everything?q=us&apiKey=43940c2d527346fda96ecbbee77ca1bb
    try{
        await client.connect();
        const database = client.db('CampusConnect');
        // console log all collections name in database
        const collections = await database.listCollections().toArray();
        console.log(collections);
        //console log the version of mongodb
        const serverInfo = await database.command({buildInfo: 1});
        console.log(serverInfo.version);
        
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching data.' });
      } finally {
        await client.close();
      }
});
app.listen(port, () => { console.log(`Server listening on port ${port}`); });
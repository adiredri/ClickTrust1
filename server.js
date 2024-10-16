const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
require('./tweet.js');
const cron = require('node-cron');
const Asset = require('./backend/models/asset');

const app = express();

// Connect to MongoDB____________________________________________________________________________
mongoose.connect('mongodb+srv://ClickTrust:1111@clicktrust.4k9ne3a.mongodb.net/ClickTrust', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });
//_______________________________________________________________________________________________

// Parse JSON data

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./views'));

// Set home page
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
  });

// Set Routers
var pages = require('./backend/config/routePages');
app.use('/', pages);

// Start Server
const port = 3300;
app.listen(port, function () {
    console.log("Server started on port", port);
});

//_______________________________________________________________________________________________

// Schedule task to delete expired assets

cron.schedule('00 00 * * *', async () => {
    console.log('Running task to delete expired assets...');
    const today = new Date(); 
    
    try {
        const result = await Asset.deleteMany({ Date: { $lt: today } });
        console.log(`Deleted ${result.deletedCount} expired assets.`);
    } catch (error) {
        console.error('Error deleting expired assets:', error);
    }
});
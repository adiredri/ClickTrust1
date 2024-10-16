const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cron = require('node-cron');
const Asset = require('./backend/models/asset');
const mongoose = require('mongoose');
require('./tweet.js');
const app = express();

// ____________________________________________________________________________
// Connect to MongoDB

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
// Schedule task to mark expired assets as unavailable

cron.schedule('49 13 * * *', async () => {
    console.log('Running task to mark expired assets as unavailable...');
    const today = new Date();
    
    try {
        const result = await Asset.updateMany(
            { Date: { $lt: today }, Available: true }, 
            { $set: { Available: false } } 
        );
        console.log(`Updated ${result.nModified} assets to unavailable.`);
    } catch (error) {
        console.error('Error updating expired assets:', error);
    }
});

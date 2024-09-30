const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
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
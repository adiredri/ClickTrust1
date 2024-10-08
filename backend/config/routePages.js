const express = require('express');
const router = express.Router();
const path = require('path');
const User = require('../models/user');
const Asset = require('../models/asset');
const Trade = require('../models/trades');
const Contact = require('../models/contact');
require("dotenv").config({ path: __dirname + "../../.env" });
const { twitterClient } = require("../../twitterClient");

//  --------------------------------- SIGNUP -------------------------------------------

// --------------- Adding user to the DB ------------------

router.post('/addUser', async (req, res) => {
    try {
  
      // ----------------- Checks -------------------
  
      // Check that the identity card contains exactly 9 digits
  
      if (!/^\d{9}$/.test(req.body.ID)) {
        const errorMessage = 'ID must contain exactly 9 digits.';
         console.error(errorMessage);
         return res.send(`<script>alert('${errorMessage}'); window.location.href='/signup'</script>`);
      }
  
      // Check if the ID already exists in the database
  
      const existingID = await User.findOne({ ID: req.body.ID });
      if (existingID) {
        // If the ID already exists, display an error message
        const errorMessage = 'ID already exists. Please choose a different ID.';
        console.error(errorMessage);
        // Display an alert with the error message
        return res.send(`<script>alert('${errorMessage}'); window.location.href='/signup'</script>`);
      }
  
      // Check if the email already exists in the database
  
      const existingEmail = await User.findOne({ Email: req.body.Email });
      if (existingEmail) {
        // If the email already exists, display an error message
        const errorMessage = 'Email already exists. Please choose a different email.';
        console.error(errorMessage);
        // Display an alert with the error message
        return res.send(`<script>alert('${errorMessage}'); window.location.href='/signup'</script>`);
      }
  
      // Check if the phone number already exists in the database
  
      const existingPhone = await User.findOne({ Phone: req.body.Phone });
      if (existingPhone) {
        // If the phone number already exists, display an error message
        const errorMessage = 'Phone number already exists. Please choose a different phone number.';
        console.error(errorMessage);
        // Display an alert with the error message
        return res.send(`<script>alert('${errorMessage}'); window.location.href='/signup'</script>`);
      }
  
      // Check that the user is over 18 years old
      const today = new Date();
      const minBirthYear = today.getFullYear() - 18;
      const birthday = new Date(req.body.Birthday);
      const userBirthYear = birthday.getFullYear();
  
      if (userBirthYear > minBirthYear) {
        const errorMessage = 'You must be at least 18 years old to register.';
        console.error(errorMessage);
        return res.send(`<script>alert('${errorMessage}'); window.location.href='/signup'</script>`);
      }
  
      // Check if the gender field is provided
      if (!req.body.Gender) {
        const errorMessage = 'You must fill in what your gender is.';
        console.error(errorMessage);
        return res.send(`<script>alert('${errorMessage}'); window.location.href='/signup'</script>`);
  }
  
      // ----------------- Add after hecking and everything is ok -------------------
  
  
      // Save the user to the database 
      const user = new User({
        ID: req.body.ID,
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        Email: req.body.Email,
        Password: req.body.Password,
        Phone: req.body.Phone,
        Birthday: req.body.Birthday,
        Gender: req.body.Gender,
      });
      await user.save();
      console.log('User added successfully');
      res.redirect('/Welcome');
    } catch (error) {
      console.error('Error adding user:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  // ------------- get all users --------------
  
  router.get('/users', async (req, res) => {
    try {
      const users = await User.find({});
      res.json(users);
    } catch (error) {
      console.error('Error fetching available users:', error);
      res.status(500).json({ error: 'Failed to fetch available users' });
    }
  });
  
  // ------------- get user by email sendeing --------------
  
  router.get('/user', async (req, res) => {
    try {
        const Email = req.query.Email; // אימייל המשתמש שנשלח בבקשה
        const user = await User.findOne({ Email: Email }); // מציאת המשתמש במסד הנתונים על פי האימייל
        if (user) {
            res.json(user); // שליחת המשתמש כתשובה בפורמט JSON
        } else {
            res.status(404).send('User not found'); // אם המשתמש לא נמצא, שליחת תשובת שגיאה
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).send('Internal Server Error'); // שליחת תשובת שגיאה פנימית
    }
  });
  // ------------- update user --------------
  
  router.post('/update-user', async (req, res) => {
    const { ID, FirstName, LastName, Email, Password, Phone, Birthday, gender } = req.body;
  
    try {
  
    // Check for age over 18   
  
        const birthDate = new Date(Birthday);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        if (age < 18) {
            let errorMessage = 'You must be at least 18 years old';
            console.error(errorMessage);
            return res.send(`<script>alert('${errorMessage}'); window.location.href='/edit'</script>`);
        }
  
  // Check for a 9-digit ID number
  
          if (ID.toString().length !== 9) {
            let errorMessage = 'ID must be 9 digits';
            console.error(errorMessage);
            return res.send(`<script>alert('${errorMessage}'); window.location.href='/edit'</script>`);
        }
  
  // Check for the existence of a phone number or system ID
  
        const existingUser = await User.findOne({ $or: [{ Phone }, { ID }] });
        if (existingUser && existingUser.Email !== Email) {
            let errorMessage = 'Phone number or ID already exists';
            console.error(errorMessage);
            return res.send(`<script>alert('${errorMessage}'); window.location.href='/edit'</script>`);
        }
  
        const updatedUser = await User.findOneAndUpdate({ Email }, { ID, FirstName, LastName, Password, Phone, Birthday, Gender: gender }, { new: true });
        if (!updatedUser) {
            let errorMessage = 'User not found';
            console.error(errorMessage);
            return res.send(`<script>alert('${errorMessage}'); window.location.href='/edit'</script>`);
        }
        const successMessage = 'The details have been successfully updated.'
        res.send(`<script>alert('${successMessage}'); window.location.href='/edit'</script>`);
    } catch (error) {
        console.error('Error updating user details:', error);
        res.status(400).send(`<script>alert('${error.message}'); window.location.href='/edit'</script>`);
    }
  });
  

//  ----------------- LOGIN --------------------

// Connects users to the site by classification 
router.post('/login', async (req, res) => {
    const Email = req.body.Email;
    const Password = req.body.Password;
    try {
      // Find the user in the database based on the provided email and password
      const loguser = await User.findOne({ Email: Email, Password: Password });
  
      if (loguser) {
  
        // Retrieve user's role based on email and ID
        if (loguser.id === '660360e03bd8ee6951acea72' || loguser.id === '65f5c45d1ade009485b849df') {
          res.redirect('/admin?Email=' + loguser.Email);
        } else {
          // Redirect to the customer index page and pass the first name as a query parameter in the URL
          res.redirect('/customer?Email=' + loguser.Email);
        }
      } else {
        // Display an alert for no such user
        const errorMessage = 'No user found with the provided email and password.';
        console.error(errorMessage);
        res.send(`<script>alert('${errorMessage}'); window.location.href='/loginPage'</script>`);
      }
    } catch (error) {
      console.error('Error during login:', error);
      res.send(error);
    }
  });
  
  // --------- RESET PASSWORD ----------
  
  
  router.post('/reset-password', async (req, res) => {
    const ID = req.body.ID;
    const Email = req.body.Email;
    const newPassword = req.body.newPassword;
  
    try {
      // check if the user exists 
      const user = await User.findOne({ ID: ID, Email: Email });
  
      if (!user) {
     // Display an alert for no such user
      const errorMessage = 'No user found with the provided email and ID.';
      console.error(errorMessage);
      res.send(`<script>alert('${errorMessage}'); window.location.href='/reset'</script>`);
      }
      else
      {
      // update password
      await User.updateOne({ ID: ID, Email: Email }, { Password: newPassword });
      const successMessage = 'The password has been successfully updated.'
      res.send(`<script>alert('${successMessage}'); window.location.href='/reset'</script>`);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

//  ------------------------------------------ CONTACTS -------------------------------------------

// ------------- Add new massege --------------

router.post('/addContact', async (req, res) => {
    const contact = new Contact({
      Name: req.body.Name,
      Email: req.body.Email,
      Phone : req.body.Phone,
      Massege: req.body.Massege,
    });
  
    try {   
        // Save the Contact to the database
        await contact.save();
        console.log('Contact added successfully'); 
        // Send a response back to the client-side to handle the confirmation
        res.status(200).json({ success: true }); // Sending a success response
  
    } catch (error) {
      console.error('An error occurred while adding the contact:', error);
      res.status(500).json({ success: false, error: 'An error occurred while adding the contact' }); // Sending an error response
    }
  });
  
  // ------------- get all masseges --------------
  
  router.get('/contacts', async (req, res) => {
    try {
      const contacts = await Contact.find({});
      res.json(contacts);
    } catch (error) {
      console.error('Error fetching available contacts:', error);
      res.status(500).json({ error: 'Failed to fetch available contacts' });
    }
  });
  
     // --------------- Delete massege from DB ---------------
     
  router.delete('/DeleteContact/:ContactID', async (req, res) => {
    try {
      const ContactID = req.params.ContactID;
      await Contact.findByIdAndDelete(ContactID);
      res.status(200).send('Massege deleted successfully');
      console.log('Massege deleted successfully');
    } catch (error) {
      console.error('Error deleting Massege:', error);
      res.status(500).send('Failed to delete Massege');
    }
  });
  
  
  
  //  ----------------------------------------------- SENDS -------------------------------------------
  

// Sends to customer home page
router.get('/customer', function (req, res) {
    res.sendFile(path.join(__dirname, '../../views', 'indexCustomer.html'));
  });
  
  
  // Sends to index login home page
  router.get('/index', function (req, res) {
    res.sendFile(path.join(__dirname, '../../views', 'index.html'));
  });
  
  // Sends to login page
  router.get('/loginPage', function (req, res) {
    res.sendFile(path.join(__dirname, '../../views', 'LogIn.html'));
  });

// Sends to signup page
router.get('/signup', function (req, res) {
    res.sendFile(path.join(__dirname, '../../views', 'signup.html'));
  });
  
  // Sends to welcome page
  router.get('/welcome', function (req, res) {
    res.sendFile(path.join(__dirname, '../../views', 'Welcome.html'));
  });

// Sends to Reset page
router.get('/reset', function (req, res) {
    res.sendFile(path.join(__dirname, '../../views', 'ForgotPassword.html'));
  });


  
//  ------------------------------------------ ASSETS -----------------------------------------------

// --------- Adds asset to the DB -----------

router.post('/addAsset', async (req, res) => {
  const asset = new Asset({
    Category: req.body.Category,
    NameDigitalAsset: req.body.NameDigitalAsset,
    Place: req.body.Place,
    Date: req.body.Date,
    Time: req.body.Time,
    Quantity: req.body.Quantity,
    Price: req.body.Price,
    Email: req.body.Email,
    Available: req.body.Available,
  });
  const tweetContent = `We are exited to announe that we Just added a new asset\nby the name ${asset.NameDigitalAsset} from Category ${asset.Category} to our trading platform!\nfor the price of just ${asset.Price}$!.\n\nGood Luck Trading!`;

  try {   

    // Save the Asset to the database
    await asset.save();
    console.log('Asset added successfully'); 

    const tweet = async () => {
      try {
        await twitterClient.v2.tweet(tweetContent);
        console.log("activated the tweet function-tweeted the tweet");
      } catch (e) {
        console.log(e)
      }
    }
    tweet();

    res.status(200).json({ success: true }); // Sending a success response

  } catch (error) {
    const errorMessage = 'An error occurred while adding the asset.';
    console.error(errorMessage);
    console.error(error); // Log the error object

  }
});

//  ------------------------------------------ TRADES ----------------------------------------------------




module.exports = router;
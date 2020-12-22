const express = require('express')
const loggedIn = express.Router()



loggedIn.get('/' , (req, res) => {
  res.send('Hello World!');
});



module.exports = loggedIn

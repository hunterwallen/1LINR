const express = require('express')
const loggedIn = express.Router()

const isAuthenticated = (req, res, next) => {
  if(req.session.currentUser) {
    next()
  } else {
    res.redirect('/gatekeeper')
  }
}

loggedIn.get('/' , isAuthenticated, (req, res) => {
  res.send('Hello World!');
});



module.exports = loggedIn

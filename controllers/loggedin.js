const express = require('express')
const loggedIn = express.Router()

const isAuthenticated = (req, res, next) => {
  if(req.session.currentUser) {
    next()
  } else {
    res.redirect('/gatekeeper')
  }
}

loggedIn.get('/' , (req, res) => {
  res.render('homepage.ejs');
});



module.exports = loggedIn
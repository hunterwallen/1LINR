const bcrypt = require('bcrypt')
const express = require('express')
const sessions = express.Router()
const User = require('../models/userinfo.js')

sessions.get('/', (req, res) => {
  res.render('sessions/login.ejs')
})

sessions.post('/', (req, res) => {
  User.findOne({username:req.body.username}, (err, foundUser) => {
    if(err) {
      console.log(err);
    } else if (!foundUser) {
      console.log('username does not exist');
      res.send('<a href="/gatekeeper">Username Not Found</a>')
    } else {
      if(bcrypt.compareSync(req.body.password, foundUser.password)) {
        req.session.currentUser = foundUser
        res.redirect('/')
      } else {
        console.log('We don\'t recognize that password. Try again');
        res.send('<a href="/gatekeeper">We don\'t recognize that password. Please try again.</a>')
      }
    }
  })
})

sessions.delete('/', (req, res) => {
  req.session.destroy(() => {
    console.log('logged out');
    res.redirect('/gatekeeper/')
  })
})


module.exports = sessions

const bcrypt = require('bcrypt')
const express = require('express')
const newusers = express.Router()
const User = require('../models/userinfo.js')


newusers.get('/', (req, res) => {
  User.find({}, (err, allUsers) => {
    if(err) {
      console.log(err);
    }
    res.render('newusers/createaccount.ejs', {
      error: 0,
      allUsers: allUsers,
      location: "City, ST",
      about: "Tell us about yourself in 250 characters or less...",
      username: "username..."
    })
  })
})

newusers.post('/', (req, res) => {
  req.body.location = req.body.city + ', ' + req.body.state
   User.create(req.body, (err, createdUser) => {
     if (err) {
       let message = err.message
       if (err.message.toString().includes('username')) {
         message = 'Username Already Exists. Please Choose a New One'
       } else if (err.message.toString().includes('password')) {
         message = 'Your password is required and must contain at least one of the following: ! @ # $ % ^ & *.'
       } 
       res.render('newusers/createaccount.ejs', {
         error: message,
         location: req.body.location,
         about: req.body.about,
         username: req.body.username
       })
     } else {
       createdUser.password = (bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)))
       createdUser.save((err, data) => {
         console.log('user is created', createdUser);
         res.redirect('/sessions/')
       })
     }
   })
 })




module.exports = newusers

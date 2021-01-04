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
      allUsers: allUsers
    })
  })
})

newusers.post('/', (req, res) => {
   User.create(req.body, (err, createdUser) => {
     if (err) {
       let message = err.message
       if (err.message.toString() === 'E11000 duplicate key error collection: project2.users index: username_1 dup key: { username: "test2" }') {
         message = 'Username Already Exists. Please Choose a New One'
       } else if (err.message.toString() === 'User validation failed: password: Your password must contain at least one of the following: ! @ # $ % ^ & *.') {
         message = 'Your password must contain at least one of the following: ! @ # $ % ^ & *.'
       } else if (err.message.toString() === 'User validation failed: location: Your location must be in the following format: City, ST') {
          message = 'Your location must be in the following format: City, ST'
       }
       res.render('newusers/createaccount.ejs', {
         error: message
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

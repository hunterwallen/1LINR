const bcrypt = require('bcrypt')
const express = require('express')
const multer = require('multer')
const newusers = express.Router()
const User = require('../models/userinfo.js')


newusers.get('/', (req, res) => {
  res.render('newusers/createaccount.ejs')
})

newusers.post('/', (req, res) => {
   req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
   User.create(req.body, (err, createdUser) => {
     if (err) {
       console.log(err.message);
     } else {
     console.log('user is created', createdUser);
     res.redirect('/sessions/')
   }
 })
})



module.exports = newusers

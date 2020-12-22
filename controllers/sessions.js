const bcrypt = require('bcrypt')
const express = require('express')
const sessions = express.Router()


sessions.get('/', (req, res) => {
  res.render('sessions/login.ejs')
})




module.exports = sessions

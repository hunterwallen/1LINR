const express = require('express')
const newusers = express.Router()


newusers.get('/', (req, res) => {
  res.send('new user works')
})




module.exports = newusers

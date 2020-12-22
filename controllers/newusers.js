const express = require('express')
const newusers = express.Router()


newusers.get('/', (req, res) => {
  res.render('newusers/createaccount.ejs')
})




module.exports = newusers

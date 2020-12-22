const express = require('express')
const gatekeeper = express.Router()

gatekeeper.get('/', (req, res) => {
  res.render('gatekeeper.ejs')
})





module.exports = gatekeeper

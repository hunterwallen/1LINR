const express = require('express')
const gatekeeper = express.Router()

gatekeeper.get('/', (req, res) => {
  res.send('gatekeeper function works')
})





module.exports = gatekeeper

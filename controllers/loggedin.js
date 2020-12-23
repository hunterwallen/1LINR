const express = require('express')
const loggedIn = express.Router()
const User = require('../models/userinfo.js')
const Post = require('../models/post.js')

const isAuthenticated = (req, res, next) => {
  if(req.session.currentUser) {
    next()
  } else {
    res.redirect('/gatekeeper')
  }
}

loggedIn.get('/', isAuthenticated, (req, res) => {
  User.find({}, (err, allUsers) => {
    res.render('homepage.ejs', {
      allUsers: allUsers,
      currentUser: req.session.currentUser
    });
  })
});

loggedIn.get('/userpage/:id', isAuthenticated, (req, res) => {
  User.findById( req.params.id, (err, foundUser) => {
    res.render('userpage.ejs', {
      user: foundUser,
      currentUser: req.session.currentUser
    })
  })
})

loggedIn.post('/newpost/:id', (req, res) => {
  let userID = req.params.id
  User.findById(userID, (err, foundUser) => {
    Post.create(req.body, (err, createdPost) => {
      foundUser.post.unshift(createdPost)
      foundUser.save((err, data) => {
        res.redirect('/')
      })
    })
  })
})


module.exports = loggedIn

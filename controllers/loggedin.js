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

loggedIn.get('/userpage/:name', isAuthenticated, (req, res) => {
  User.findOne( {username: req.params.name}, (err, foundUser) => {
    res.render('userpage.ejs', {
      user: foundUser,
      currentUser: req.session.currentUser
    })
  })
})

loggedIn.get('/editlist/', isAuthenticated, (req, res) => {
    res.render('editpostslist.ejs', {
      currentUser: req.session.currentUser
    })
})
loggedIn.get('/editpost/:id/:postIndex', isAuthenticated, (req, res) => {
  let userID = req.params.id
  User.findById( userID, (err, foundUser) => {
    res.render('editpostssingle.ejs', {
      currentUser: req.session.currentUser,
      currentPost: req.session.currentUser.post[req.params.postIndex],
      currentPostIndex: req.params.postIndex
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

loggedIn.put('/editpost/:id/:postindex', (req, res) => {
  let userId = req.params.id
  User.findById( userId, (err, foundUser) => {
    Post.create(req.body, (err, createdPost) => {
      foundUser.post.splice(req.params.postindex, 1, createdPost)
      foundUser.save((err, data) => {
        req.session.currentUser = foundUser
        res.redirect('/editlist/')
      })
    })
  })
})

module.exports = loggedIn

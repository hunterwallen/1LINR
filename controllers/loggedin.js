const bcrypt = require('bcrypt')
const express = require('express')
const loggedIn = express.Router()
const User = require('../models/userinfo.js')
const Post = require('../models/post.js')
const seed = require('../models/userseed.js')
const postseed = require('../models/postseed.js')

const isAuthenticated = (req, res, next) => {
  if(req.session.currentUser) {
    next()
  } else {
    res.redirect('/gatekeeper')
  }
}

loggedIn.get('/createusers/seed', (req, res) => {
  for(i in seed){
  seed[i].password = bcrypt.hashSync(seed[i].password, bcrypt.genSaltSync(10))
  User.create(seed[i], (err, createdUser) => {
    if (err) {
      console.log(err.message);
    } else {
    console.log('user is created', createdUser);
      }
    })
  }
  res.redirect('/')
})

loggedIn.get('/createposts/seed', (req, res) => {
  User.find({}, (err, allUsers) => {
    for(i in allUsers) {
      let thisUserID = allUsers[i]._id
      User.findById( thisUserID, (err, foundUser) => {
        Post.create(postseed, (err, createdPost) => {
          if(err) {
            console.log(err.message);
          } else {
            foundUser.post.unshift(createdPost)
            foundUser.save((err, data) => {
              console.log('post successfully seeded to', foundUser.username);
            })
          }
        })
      })
    }
  })
  res.redirect('/')
})

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

loggedIn.delete('/editpost/:id/:postindex', (req, res) => {
  let userID = req.params.id
  User.findById( userID, (err, foundUser) => {
    foundUser.post.splice(req.params.postindex, 1)
    foundUser.save((err, data) => {
      req.session.currentUser = foundUser
      res.redirect('/editlist/')
    })
  })
})

module.exports = loggedIn

const bcrypt = require('bcrypt')
const express = require('express')
const loggedIn = express.Router()
const fs = require('fs')
const path = require('path')
const multer = require('multer')
const User = require('../models/userinfo.js')
const Post = require('../models/post.js')
const Image = require('../models/img.js')
const seed = require('../models/userseed.js')
const postseed = require('../models/postseed.js')

const storage = multer.memoryStorage()

const upload = multer({storage: storage})

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
      currentUser: req.session.currentUser,
      user: 0
      // profilePic: req.session.currentUser.img[0].img.data
    });
  })
});

loggedIn.get('/userpage/:id', isAuthenticated, (req, res) => {
  const checkWatching = (currentUserWatching, viewedUser) => {
    let viewedId = viewedUser._id
    let isWatching = false
    for(let i = 0; i < currentUserWatching.length; i++) {
      let thisWatching = currentUserWatching[i]._id
      if(thisWatching.toString() === viewedId.toString()) {
        isWatching = true
        break
      }
    }
    return isWatching
  }
  let userId = req.params.id
  User.findById( userId , (err, foundUser) => {
    let following = checkWatching(req.session.currentUser.watching, foundUser)
    res.render('userpage.ejs', {
      user: foundUser,
      currentUser: req.session.currentUser,
      following: following
    })
  })
})

loggedIn.get('/editlist/', isAuthenticated, (req, res) => {
    res.render('editpostslist.ejs', {
      currentUser: req.session.currentUser
    })
})

loggedIn.get('/lookaround/', isAuthenticated, (req, res) => {
  User.find({}, (err, allUsers) => {
    res.render('lookaround.ejs', {
      allUsers: allUsers,
      currentUser: req.session.currentUser
    })
  })
})

loggedIn.get('/watched/:id', isAuthenticated, (req, res) => {
  let userID = req.params.id
  User.findById( userID, (err, foundUser) => {
    res.render('watchers.ejs', {
      currentUser: req.session.currentUser,
      user: foundUser
    })
  })
})

loggedIn.get('/watching/:id', isAuthenticated, (req, res) => {
  User.findById( req.params.id, (err, foundUser) => {
    res.render('watching.ejs', {
      currentUser: req.session.currentUser,
      user: foundUser
    })
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

loggedIn.get('/edituser/:id', isAuthenticated, (req, res) => {
  res.render('editprofile.ejs', {
    currentUser: req.session.currentUser
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

loggedIn.post('/addphoto/:id', upload.single('img'), (req, res) => {
  let userId = req.params.id
  let img = {
    img:{
      data: req.file.img.buffer,
      contentType: 'image/jpeg'
    }
  }
  User.findById ( userId, (err, foundUser) => {
    Image.create(img, (err, uploadedImage) => {
      if(err) {
        console.log(err.message);
      } else {
        foundUser.img = uploadedImage
        foundUser.save((err, data) => {
          req.session.currentUser = foundUser
          res.redirect('/')
        })
      }
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

loggedIn.put('/edituser/:id', (req, res) => {
  let userID = req.params.id
  req.body.post = req.session.currentUser.post
  req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
  User.create(req.body, (err, user) => {
    if(err) {
      console.log(err.message);
    } else {
      console.log(user);
      User.findByIdAndRemove(userID, (err, data) => {
        if(err){
          console.log(err.message);
        } else {
          console.log('old data deleted');
          user._id = userID
          user.save((err, data) => {
            console.log('profile updated');
            res.redirect('/')
          })
        }
      })
    }
  })
})

loggedIn.put('/like/:userID/:postID/:postIndex', (req, res) => {
  let userID = req.params.userID
  let postID = req.params.postID
  User.findById( userID, (err, foundUser) => {
    Post.findByIdAndUpdate ( postID, {$inc: {like: 1}}, {new: true}, (err, foundPost) => {
      foundUser.post.splice(req.params.postIndex, 1, foundPost)
      foundUser.save((err, data) => {
      console.log('likeupdated', foundPost);
      res.redirect('/')
    })
    })
  })
})

loggedIn.put('/dislike/:userID/:postID/:postIndex', (req, res) => {
  let userID = req.params.userID
  let postID = req.params.postID
  User.findById( userID, (err, foundUser) => {
    Post.findByIdAndUpdate ( postID, {$inc: {dislike: 1}}, {new: true}, (err, foundPost) => {
      foundUser.post.splice(req.params.postIndex, 1, foundPost)
      foundUser.save((err, data) => {
      console.log('dislikeupdated', foundPost);
      res.redirect('/')
    })
    })
  })
})

loggedIn.put('/userlike/:userID/:postID/:postIndex', (req, res) => {
  let userID = req.params.userID
  let postID = req.params.postID
  User.findById( userID, (err, foundUser) => {
    Post.findByIdAndUpdate ( postID, {$inc: {like: 1}}, {new: true}, (err, foundPost) => {
      foundUser.post.splice(req.params.postIndex, 1, foundPost)
      foundUser.save((err, data) => {
      console.log('likeupdated', foundPost);
      res.redirect('/userpage/' + foundUser.username)
    })
    })
  })
})

loggedIn.put('/userdislike/:userID/:postID/:postIndex', (req, res) => {
  let userID = req.params.userID
  let postID = req.params.postID
  User.findById( userID, (err, foundUser) => {
    Post.findByIdAndUpdate ( postID, {$inc: {dislike: 1}}, {new: true}, (err, foundPost) => {
      foundUser.post.splice(req.params.postIndex, 1, foundPost)
      foundUser.save((err, data) => {
      console.log('dislikeupdated', foundPost);
      res.redirect('/userpage/' + foundUser.username)
    })
    })
  })
})

loggedIn.put('/watchuser/:userId/:requestId', (req, res) => {
  let userToWatchID = req.params.requestId
  let requestorID = req.params.userId
  User.findById( requestorID, (err, requestor) => {
    User.findById( userToWatchID, (err, userToWatch) => {
      let requestorSpecs = {
        _id: requestor._id,
        username: requestor.username,
        location: requestor.location
      }
      let userToWatchSpecs = {
        _id: userToWatch._id,
        username: userToWatch.username,
        location: userToWatch.location
      }
      userToWatch.watched.push(requestorSpecs)
      requestor.watching.push(userToWatchSpecs)
      userToWatch.save((err, data) => {
        requestor.save((err, data) => {
          req.session.currentUser = requestor
          res.redirect('/userpage/' + userToWatch._id)
        })
      })
    })
  })
})


loggedIn.put('/stopwatching/:userId/:requestId', (req, res) => {
  let userToWatchID = req.params.requestId
  let requestorID = req.params.userId
  User.findById( requestorID, (err, requestor) => {
    User.findById( userToWatchID, (err, userToWatch) => {
      let indexOfRequestor = 0
      let indexOfUser = 0
      for(i in requestor.watching) {
        let thisId = requestor.watching[i]._id
        if (thisId.toString() === (userToWatch._id).toString()) {
          indexOfUser = i
          break
        }
      }
      for(i in userToWatch.watched) {
        let thisId = userToWatch.watched[i]._id
        if (thisId.toString() === (requestor._id).toString()) {
          indexOfRequestor = i
          break
        }
      }
      requestor.watching.splice(indexOfUser, 1)
      userToWatch.watched.splice(indexOfRequestor, 1)
      userToWatch.save((err, data) => {
        requestor.save((err, data) => {
          req.session.currentUser = requestor
          res.redirect('/userpage/' + userToWatch._id)
        })
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

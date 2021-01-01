const bcrypt = require('bcrypt')
const express = require('express')
const cloudinary = require('cloudinary')
const loggedIn = express.Router()
const User = require('../models/userinfo.js')
const Post = require('../models/post.js')
const Image = require('../models/img.js')
const seed = require('../models/userseed.js')
const postseed = require('../models/postseed.js')


cloudinary.config({
  cloud_name: 'onelinrprofilepics',
  api_key: process.env.CLOUDINARYAPIKEY,
  api_secret: process.env.CLOUDINARYSECRET
});


const timeZoneOffset = () => {
  let date = new Date();
  let offSet = (date.getTimezoneOffset())/60
  return offSet
}


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
    let isWatching = false
    if(viewedUser && currentUserWatching[0]) {
      let viewedId = viewedUser._id
      for(let i = 0; i < currentUserWatching.length; i++) {
        let thisWatching = currentUserWatching[i]._id
        if(thisWatching.toString() === viewedId.toString()) {
          isWatching = true
          break
        }
      }
    }
    return isWatching
  }
  const checkShortList = (currentUserWatchList, viewedUser) => {
    let shortListed = false
      if(currentUserWatchList[0] && viewedUser) {
      let viewedId = viewedUser._id
      for(let i = 0; i < currentUserWatchList.length; i++) {
        let thisShortLister = currentUserWatchList[i]._id
        if(thisShortLister.toString() === viewedId.toString()) {
          shortListed = true
          break
        }
      }
    }
    return shortListed
  }
  let userId = req.params.id
  User.findById( userId , (err, foundUser) => {
    let following = checkWatching(req.session.currentUser.watching, foundUser)
    let shortList = checkShortList(req.session.currentUser.watchList, foundUser)
    res.render('userpage.ejs', {
      user: foundUser,
      currentUser: req.session.currentUser,
      following: following,
      shortList: shortList
    })
  })
})

loggedIn.get('/editlist/', isAuthenticated, (req, res) => {
  let currentUserId = req.session.currentUser._id
  User.findById ( currentUserId, (err, foundUser) => {
    res.render('editpostslist.ejs', {
      currentUser: req.session.currentUser,
      user: foundUser
    })
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
    currentUser: req.session.currentUser,
    imgURl: req.session.currentUser.img,
    error: 0
  })
})


loggedIn.post('/newpost/:id', (req, res) => {
  let userID = req.params.id
  User.findById(userID, (err, foundUser) => {
    Post.create(req.body, (err, createdPost) => {
      foundUser.post.unshift(createdPost)
      foundUser.save((err, data) => {
        req.session.currentUser = foundUser
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

loggedIn.put('/edituser/:id', (req, res) => {
  let userID = req.params.id
  console.log(req.body);
  req.body.username = req.body.username + '9'
    User.create(req.body, (err, newuser) => {
      if(err){
          let message = err.message
          if (err.message.toString() === 'E11000 duplicate key error collection: project2.users index: username_1 dup key: { username: "test2" }') {
            message = 'Username Already Exists. Please Choose a New One'
          } else if (err.message.toString() === 'User validation failed: password: Your password must contain at least one of the following: ! @ # $ % ^ & *.') {
            message = 'Your password must contain at least one of the following: ! @ # $ % ^ & *.'
          } else if (err.message.toString() === 'User validation failed: location: Your location must be in the following format: City, ST') {
             message = 'Your location must be in the following format: City, ST'
          }
          res.render('editprofile.ejs', {
            error: message,
            currentUser: req.session.currentUser,
            imgURl: req.session.currentUser.img
          })
      } else {
        User.findById(userID, (err, foundUser) => {
          if(err){
            console.log(err.message);
          } else {
            console.log(foundUser);
            foundUser.img = newuser.img
            foundUser.username = newuser.username.slice(0, newuser.username.length - 1)
            foundUser.password = bcrypt.hashSync(newuser.password, bcrypt.genSaltSync(10))
            foundUser.location = newuser.location
            foundUser.save((err, data) => {
                req.session.currentUser = foundUser
                console.log(req.session.currentUser);
                User.findByIdAndDelete( newuser._id, (err, data) => {
                  if(err) {
                    console.log(err);
                  } else {
                    console.log('duplicate deleted!');
                    res.redirect('/')
                  }
                })
            })
          }
        })
      }
    })
})

loggedIn.put('/like/:userID/:postID/:postIndex/:origin', (req, res) => {
  let userID = req.params.userID
  let postID = req.params.postID
  User.findById( userID, (err, foundUser) => {
    Post.findByIdAndUpdate ( postID, {$inc: {like: 1}}, {new: true}, (err, foundPost) => {
      if(foundPost.liked === undefined) {
        foundPost.likedBy = [req.session.currentUser._id]
      } else {
        foundPost.likedBy.push(req.session.currentUser._id)
      }
      foundUser.post.splice(req.params.postIndex, 1, foundPost)
      foundUser.save((err, data) => {
      console.log('likeupdated', foundPost);
      foundPost.save((err,data) => {
        if(req.params.origin === 'home') {
          res.redirect('/')
        } else {
          res.redirect('/userpage/'+req.params.userID)
        }
      })
    })
    })
  })
})

loggedIn.put('/unlike/:userID/:postID/:postIndex/:origin', (req, res) => {
  let userID = req.params.userID
  let postID = req.params.postID
  User.findById( userID, (err, foundUser) => {
    Post.findByIdAndUpdate ( postID, {$inc: {like: 1}}, {new: true}, (err, foundPost) => {
      let index = foundPost.likedBy.indexOf(req.session.currentUser._id)
      foundPost.likedBy.splice(index, 1)
      foundUser.post.splice(req.params.postIndex, 1, foundPost)
      foundUser.save((err, data) => {
      console.log('likeupdated', foundPost);
      foundPost.save((err,data) => {
        if(req.params.origin === 'home') {
          res.redirect('/')
        } else {
          res.redirect('/userpage/'+req.params.userID)
        }
      })
    })
    })
  })
})

loggedIn.put('/dislike/:userID/:postID/:postIndex/:origin', (req, res) => {
  let userID = req.params.userID
  let postID = req.params.postID
  User.findById( userID, (err, foundUser) => {
    Post.findByIdAndUpdate ( postID, {$inc: {dislike: 1}}, {new: true}, (err, foundPost) => {
      if(foundPost.liked === undefined) {
        foundPost.dislikedBy = [req.session.currentUser._id]
      } else {
        foundPost.dislikedBy.push(req.session.currentUser._id)
      }
      foundUser.post.splice(req.params.postIndex, 1, foundPost)
      foundUser.save((err, data) => {
      console.log('dislikeupdated', foundPost);
      foundPost.save((err, data) => {
        if(req.params.origin === 'home') {
              res.redirect('/')
            } else {
              res.redirect('/userpage/'+req.params.userID)
            }
      })
    })
    })
  })
})

loggedIn.put('/undislike/:userID/:postID/:postIndex/:origin', (req, res) => {
  let userID = req.params.userID
  let postID = req.params.postID
  User.findById( userID, (err, foundUser) => {
    Post.findByIdAndUpdate ( postID, {$inc: {dislike: -1}}, {new: true}, (err, foundPost) => {
      let index = foundPost.dislikedBy.indexOf(req.session.currentUser._id)
      foundPost.dislikedBy.splice(index, 1)
      foundUser.post.splice(req.params.postIndex, 1, foundPost)
      foundUser.save((err, data) => {
      console.log('dislikeupdated', foundPost);
      foundPost.save((err,data) => {
        if(req.params.origin === 'home') {
          res.redirect('/')
        } else {
          res.redirect('/userpage/'+req.params.userID)
        }
      })
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
      res.redirect('/userpage/' + foundUser._id)
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
      res.redirect('/userpage/' + foundUser._id)
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
      for(i in requestor.watchList) {
        let thisId = requestor.watchList[i]._id
        if ((thisId).toString() === (userToWatch._id).toString()) {
          requestor.watchList.splice(i, 1)
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

loggedIn.put('/shortlist/:userId/:requestId', (req, res) => {
  let userToWatchID = req.params.requestId
  let requestorID = req.params.userId
  User.findById( requestorID, (err, requestor) => {
    User.findById( userToWatchID, (err, userToWatch) => {
      let userToWatchSpecs = {
        _id: userToWatch._id,
        username: userToWatch.username,
        location: userToWatch.location
      }
      requestor.watchList.push(userToWatchSpecs)
        requestor.save((err, data) => {
          req.session.currentUser = requestor
          res.redirect('/userpage/' + userToWatch._id)
        })
    })
  })
})

loggedIn.put('/removeshortlist/:userId/:requestId', (req, res) => {
  let userToWatchID = req.params.requestId
  let requestorID = req.params.userId
  User.findById( requestorID, (err, requestor) => {
    User.findById( userToWatchID, (err, userToWatch) => {
      let indexOfUser = 0
      for(i in requestor.watchList) {
        let thisId = requestor.watchList[i]._id
        if (thisId.toString() === (userToWatch._id).toString()) {
          indexOfUser = i
          break
        }
      }
      requestor.watchList.splice(indexOfUser, 1)
        requestor.save((err, data) => {
          req.session.currentUser = requestor
          res.redirect('/userpage/' + userToWatch._id)
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

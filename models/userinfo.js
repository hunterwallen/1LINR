const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Post = require('./post.js')



const userSchema = new Schema ({
  username:{type:String, unique: true, required: true, validate: {
                          validator: (str) => {
                            let length = str.length
                            if(length < 5 || length > 16) {
                              return false
                            } else {
                              return true
                            }}, message: 'Your username must be between 5 and 16 characters long.'}},
  password:{type:String, required:true, validate: {
                          validator: (str) => {
                            let length = str.length
                            if(length < 7 || length > 16) {
                              return false
                            } else {
                              return true
                            }}, message: 'Your password must be between 7 and 16 characters.'}, validate: {
                                                    validator: (str) => {
                                                      for(let i = 0; i < str.length; i++) {
                                                        if (str[i] === '!' || str[i] === '@' || str[i] === '#' || str[i] === '$' || str[i] === '%' || str[i] === '^' || str[i] === '&' || str[i] === '*') {
                                                            return true
                                                          }
                                                        }
                                                        return false
                                                    }, message: 'Your password must contain at least one of the following: ! @ # $ % ^ & *.'}},
  location:{type:String, required: true, validate: {
                          validator: (str) => {
                            let thisLocation = JSON.stringify(str)
                            let thisFormat = thisLocation.slice((thisLocation.length-5), (thisLocation.length-3))
                              if (thisFormat === ', ') {
                                  return true
                                } else {
                              return false
                          }}, message: 'Your location must be in the following format: City, ST'}},
  about:{type:String,validate: {
                          validator: (str) => {
                            let length = str.length
                            if(length > 250) {
                              return false
                            } else {
                              return true
                            }}, message: 'Your about section cannot be longer than 250 characters.'}, validate: {
                                                    validator: (str) => {
                                                      for(let i = 0; i < str.length-4; i++) {
                                                        let thisThree= str.slice(i, (i+4))
                                                        if (thisThree === ('http')) {
                                                          return false
                                                        }
                                                      }
                                                      return true
                                                    }, message: 'Your about me section cannot include links or images.'}},
  img: {type:String, default: 'https://i.imgur.com/GM7Y8x0m.png'},
  post:[Post.schema],
  watching: {type:Array, default: []},
  watched: {type: Array, default: []},
  watchList: {type:Array, default: []}
})


const User = mongoose.model('User', userSchema)



module.exports = User

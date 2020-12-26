const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema ({
  title:{type:String, required: true, validate: {
                          validator: (str) => {
                          let length = str.length
                          if(length > 15) {
                            return false
                          } else {
                            return true
                          }}, message: 'Your title cannot be longer than 15 characters.'}, validate: {
                                  validator: (str) => {
                                    for(let i = 0; i < str.length-4; i++) {
                                      let thisThree= str.slice(i, (i+4))
                                      if (thisThree === ('http')) {
                                            return false
                                        }
                                      }
                                    return true
                                  }, message: 'Your post cannot include links or images.'}},
  body:{type:String,validate: {
                          validator: (str) => {
                            let length = str.length
                            if(length > 50) {
                                return false
                              } else {
                              return true
                            }}, message: 'Your post cannot be longer than 50 characters.'}, validate: {
                                    validator: (str) => {
                                      for(let i = 0; i < str.length-4; i++) {
                                        let thisThree= str.slice(i, (i+4))
                                        if (thisThree === ('http')) {
                                              return false
                                          }
                                        }
                                      return true
                                    }, message: 'Your post cannot include links or images.'}},
    like:{type:Number, default: 0},
    dislike:{type:Number, default: 0}
    }, {timestamps: true})


const Post = mongoose.model('Post', postSchema)

module.exports = Post

const mongoose = require('mongoose')


const postSchema = new Schema ({
  name:{type:String, required: true, validate: {
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
                            if(length > 25) {
                                return false
                              } else {
                              return true
                            }}, message: 'Your post cannot be longer than 25 characters.'}, validate: {
                                    validator: (str) => {
                                      for(let i = 0; i < str.length-4; i++) {
                                        let thisThree= str.slice(i, (i+4))
                                        if (thisThree === ('http')) {
                                              return false
                                          }
                                        }
                                      return true
                                    }, message: 'Your post cannot include links or images.'}}
    })


const User = mongoose.model('User', userSchema)

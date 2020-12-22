const mongoose = require('mongoose')


const userSchema = new Schema ({
  name:{type:String, unique: true, required: true},
  location:{type:String, required: true},
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
                                                    }, message: 'You must provide a valid image URL'}}
})


const User = mongoose.model('User', userSchema)

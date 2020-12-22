const mongoose = require('mongoose')


const userSchema = new Schema ({
  username:{type:String, unique: true, required: true},
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
                                                        if (str[i] === ('!' || '@' || '#' || '$' || '%' || '^' || '&' || '*') {
                                                            return true
                                                          }
                                                        }
                                                        return false
                                                    }, message: 'Your password must contain at least one of the following: ! @ # $ % ^ & *.'}},
  location:{type:String, required: true, validate: {
                          validator: (str) => {
                            let thisFormat = str.slice(str.length-4, str.lengt-2)
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
                                                    }, message: 'Your about me section cannot include links or images.'}}
})


const User = mongoose.model('User', userSchema)

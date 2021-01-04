

const liveUsernameVer = () => {
    let usernameError = document.querySelector('#usernameError')
    let usernameField = document.querySelector('#username').value.length
    // let thisUsername = allUsers[i].username
    if(usernameField > 0 && (usernameField < 5 || usernameField > 16)) {
      usernameError.style.display = 'flex'
    } else if(usernameField === 5 || usernameField === 16 ) {
      usernameError.style.display = 'none'
    }

}

document.querySelector('#username').addEventListener('keyup', liveUsernameVer)


const livePasswordVer = () => {
    let passwordError = document.querySelector('#passwordError1')
    let passwordError2 = document.querySelector('#passwordError2')
    let passwordFieldLength = document.querySelector('#password').value.length
    let password = document.querySelector('#password').value
        let contains = false
    if(passwordFieldLength > 0 && (passwordFieldLength < 7 || passwordFieldLength > 16)) {
      passwordError.style.display = 'flex'
    } else if(passwordFieldLength === 7 ||  passwordFieldLength === 16 ) {
      passwordError.style.display = 'none'
    }
    for(i in password) {
      if (password[i] === ('!' || '@' || '#' || '$' || '%' || '^' || '&' || '*')) {
        contains = true
        break
      }
    }
    if(!contains) {
      passwordError2.style.display = 'flex'
    } else {
      passwordError2.style.display = 'none'

    }
}

document.querySelector('#password').addEventListener('keyup', livePasswordVer)

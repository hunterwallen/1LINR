let userFeedButton = document.querySelector('#userFeedButton')
let watchingButton = document.querySelector('#watchingButton')
let watchedButton = document.querySelector('#watchedButton')
let currentFocus = '#userFeedButton'
let currentShow = '1'


const changeDiv = (nextFocus, nextShow) => {
  console.log(nextFocus);
  console.log(nextShow);
  document.querySelector('#userDiv' + currentShow).classList.remove('focus')
  document.querySelector('#userDiv' + nextShow).classList.add('focus')
  document.querySelector(currentFocus).classList.remove('focus')
  document.querySelector(nextFocus).classList.add('focus')
  currentFocus = nextFocus
  currentShow = nextShow
}


userFeedButton.addEventListener("click", (event) => {
  let nextFocus = '#'+event.currentTarget.id
  let nextShow = event.currentTarget.getAttribute('divNum')
  changeDiv(nextFocus, nextShow)
})

watchingButton.addEventListener("click", (event) => {
  let nextFocus = '#'+event.currentTarget.id
  let nextShow = event.currentTarget.getAttribute('divNum')
  changeDiv(nextFocus, nextShow)
})

watchedButton.addEventListener("click", (event) => {
  let nextFocus = '#'+event.currentTarget.id
  let nextShow = event.currentTarget.getAttribute('divNum')
  changeDiv(nextFocus, nextShow)
})

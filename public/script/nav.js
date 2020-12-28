const navImg = document.querySelector(".navImg")
const navUL = document.querySelector(".topNavUL")
const dropDown = document.querySelector(".navDropDown")

const showNav = () => {
  navImg.removeEventListener("click", showNav)
  navUL.style.display = 'flex'
  navUL.addEventListener("mouseleave", hideNav)
  navImg.addEventListener("click", hideNav)
}

const hideNav = () => {
    navImg.removeEventListener("click", hideNav)
    navUL.style.display = 'none'
    navImg.addEventListener("click", showNav)
}

navImg.addEventListener("click", showNav)

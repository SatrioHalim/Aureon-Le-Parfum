// Toggle class active
const navbarNav = document.querySelector(".navbar-nav");

// Hamburger menu clicked
document.querySelector('#hamburger-menu').onclick = () => {
    navbarNav.classList.toggle("active");
} 

// Klik diluar hamburger menu untuk menghilangkan navbar
const hamburger = document.querySelector('#hamburger-menu');
document.addEventListener('click', function(e){
    // selama yang di klik bukan hamburger dan bukan navbar
    if(!hamburger.contains(e.target) && !navbarNav.contains(e.target)){
        navbarNav.classList.remove('active');
    }
})
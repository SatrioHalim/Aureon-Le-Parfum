// Toggle class active hamburger menu
const navbarNav = document.querySelector(".navbar-nav");

// Hamburger menu clicked
document.querySelector('#hamburger-menu').onclick = () => {
    navbarNav.classList.toggle("active");
} 

// Toggle class active search form
const searchForm = document.querySelector(".search-form");
const searchBox = document.querySelector('#search-box'); 

document.querySelector('#search-button').onclick = (e) => {
    // toggle untuk menambahkan atau menghilangkan class active
    searchForm.classList.toggle('active');
    searchBox.focus();
    // e untuk menghilangkan fungsi default dari sebuah elemen
    // disini casenya agar ketika tombol search di klik tidak langsung menuju ke link # ato scroll keatas
    e.preventDefault();
}

// Klik diluar elemen
const hm = document.querySelector('#hamburger-menu');
const sb = document.querySelector('#search-button');

document.addEventListener('click', function(e){
    // selama yang di klik bukan hamburger dan bukan navbar
    if(!hm.contains(e.target) && !navbarNav.contains(e.target)){
        navbarNav.classList.remove('active');
    }
    if(!sb.contains(e.target) && !searchForm.contains(e.target)){
        searchForm.classList.remove('active');
    }
})
const menuToggle = document.getElementById("menuToggle");
const nav = document.querySelector("nav");

menuToggle.addEventListener("click", () => {
  nav.classList.toggle("active");
});


nav.addEventListener('click', ()=>{
  aleart('HII')
})

nav.style.alignItems='center'
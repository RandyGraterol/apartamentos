const svg = document.querySelectorAll('.svg');
const menu = document.querySelector('.liBox');
svg.forEach(element =>{
	element.addEventListener('click', click)
})

function click() {
	menu.classList.toggle('active')
}
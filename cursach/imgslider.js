const viewimg = document.querySelector('.viewimg');
const images = viewimg.querySelectorAll('img');
let currentIndex = 0;

images[currentIndex].classList.add('active');

viewimg.addEventListener('click', () => {
  images[currentIndex].classList.remove('active');
  currentIndex = (currentIndex + 1) % images.length;
  images[currentIndex].classList.add('active');
});
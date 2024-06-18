const slider = document.querySelector('.slider');
const slidesContainer = slider.querySelector('.slides-container');
const prevButton = slider.querySelector('.prev');
const nextButton = slider.querySelector('.next');
const currentSlide = slider.querySelector('.current-slide');
const totalSlides = slider.querySelector('.total-slides');

let slidesData; 
let currentIndex1 = 0;

fetch('slides.json')
  .then(response => response.json())
  .then(data => {
    slidesData = data.slides;
    totalSlides.textContent = slidesData.length;

    prevButton.addEventListener('click', () => {
      changeSlide(currentIndex1 - 1);
    });

    nextButton.addEventListener('click', () => {
      changeSlide(currentIndex1 + 1);
    });

    function changeSlide(index) {
      if (index < 0) {
        index = slidesData.length - 1;
      } else if (index >= slidesData.length) {
        index = 0; 
      }

      currentIndex1 = index;
      showSlide(currentIndex1);
      updatePagination();
    }

    function showSlide(index) {
      const slide = slidesData[index];
      slidesContainer.innerHTML = `
        <img src="${slide.src}" alt="${slide.alt}">
      `;
    }

    function updatePagination() {
      currentSlide.textContent = currentIndex1 + 1;
    }

    showSlide(currentIndex1);
    updatePagination();
  })
  .catch(error => {
    console.error('Ошибка загрузки JSON-файла:', error);
  });
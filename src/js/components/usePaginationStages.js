/* eslint-disable no-console */
export default function usePaginationStages() {
  const sliderWrap = document.querySelector('.stages__slider-wrap');
  const stages = document.querySelector('.stages__container');
  const btnPrev = document.querySelector('.pagination__btn--prev');
  const btnNext = document.querySelector('.pagination__btn--next');
  const paginationList = document.querySelectorAll('.pagination__item');

  const numberSlides = 5;
  let currentSlide = 1;
  let slidWidth = sliderWrap.offsetWidth;

  function disableBtn() {
    btnPrev.disabled = currentSlide === 1;
    btnNext.disabled = currentSlide === numberSlides;
  }

  function togglePagination() {
    paginationList.forEach((item) => {
      item.classList.remove('pagination__item-active');
    });
    paginationList[currentSlide - 1].classList.add('pagination__item-active');
  }

  togglePagination();

  function updateStageAndPagination() {
    stages.style.transform = `translateX(-${slidWidth * (currentSlide - 1)}px)`;
    togglePagination();
    disableBtn();
  }

  btnPrev.addEventListener('click', () => {
    if (currentSlide > 1) {
      currentSlide -= 1;
      updateStageAndPagination();
    }
  });

  btnNext.addEventListener('click', () => {
    if (currentSlide <= numberSlides) {
      currentSlide += 1;
      updateStageAndPagination();
    }
  });

  window.addEventListener('resize', () => {
    const screenWidth = window.innerWidth;
    const isMobile = screenWidth < 849;
    slidWidth = sliderWrap.offsetWidth;
    if (!isMobile) {
      stages.style.transform = `translateX(0px)`;
      currentSlide = 1;
      updateStageAndPagination();
    } else {
      stages.style.transform = `translateX(-${slidWidth * (currentSlide - 1)}px)`;
    }
  });
}

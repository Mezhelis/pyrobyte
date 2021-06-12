function allInclus() {
  // настройки слайдер в преимуществ
  const allInclusiveSliderBtnPrev = document.querySelector('.all-inclusive-slider__btn--prev');
  const allInclusiveSliderBtnNext = document.querySelector('.all-inclusive-slider__btn--next');
  const allInclusiveSlides = document.querySelectorAll('.all-inclusive-slide');

  let numSlideAllIncl = 0;

  function showSlideAllIncl(i) { // отображение активного слайда
    document.querySelector('.all-inclusive-slide--active').classList.remove('all-inclusive-slide--active');

    allInclusiveSlides[i].classList.add('all-inclusive-slide--active');
  }

  function switchNextSlideAllIncl() { // переключение на следующий слайд
    numSlideAllIncl = (numSlideAllIncl + 1) % allInclusiveSlides.length;
    showSlideAllIncl(numSlideAllIncl);
  }

  function switchPrevSlideAllIncl() { // переключение на предыдущий слайд
    numSlideAllIncl = numSlideAllIncl > 0 ? (numSlideAllIncl - 1) % allInclusiveSlides.length : allInclusiveSlides.length - 1;

    showSlideAllIncl(numSlideAllIncl);
  }

  // установка событий на стрелки слайдера
  allInclusiveSliderBtnPrev.addEventListener('click', switchPrevSlideAllIncl)
  allInclusiveSliderBtnNext.addEventListener('click', switchNextSlideAllIncl);
}

allInclus()
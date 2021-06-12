function choiceJs() {
  // настройки слайдер в блоке формы
  const btnPrev = document.querySelector('.tabs-controls__btn--prev');
  const btnNext = document.querySelector('.tabs-controls__btn--next');
  let choicePad = document.querySelector('.choice-tab--active .choice-tab__pad');
  let specialOffers = document.querySelectorAll('.choice-tab--active .special-offer');

  let posPad = 0;
  let widthOffer = 400;
  let visibleCount = 3;

  function movePad(pos) { // установка значения для перемещения слайдера
    choicePad.style.left = `${pos}px`;
  }

  function switchPrevSpecialOffers() { // переход на предыдущий слайд
    posPad += widthOffer * visibleCount;
    posPad = Math.min(posPad, 0)
    movePad(posPad);
  }

  function switchNextSpecialOffers() { // переход на следующий слайд
    posPad -= widthOffer * visibleCount;
    posPad = Math.max(posPad, -widthOffer * (specialOffers.length - visibleCount));
    movePad(posPad);
  }

  // переключение табов
  const choiceTabsItem = document.querySelectorAll('.choice-tabs__item');
  const choiceTab = document.querySelectorAll('.choice-tab');

  function showChoiceTab(id) { // отображение таба по id
    document.querySelector('.choice-tab--active').classList.remove('choice-tab--active');

    choiceTab.forEach((item) => {
      if (item.dataset.id === id) {
        item.classList.add('choice-tab--active');
      }
    })

    choicePad = document.querySelector('.choice-tab--active .choice-tab__pad');
    specialOffers = document.querySelectorAll('.choice-tab--active .special-offer');

    if (specialOffers.length > visibleCount) { // события устанавливаются, только если слайдов достаточно для пролистывания
      btnPrev.addEventListener('click', switchPrevSpecialOffers)
      btnNext.addEventListener('click', switchNextSpecialOffers)
    } else {
      btnPrev.removeEventListener('click', switchPrevSpecialOffers)
      btnNext.removeEventListener('click', switchNextSpecialOffers)
    }
  }

  function switchChoiceTabsItem(elem) { // переключение активного таба
    document.querySelector('.choice-tabs__item--active').classList.remove('choice-tabs__item--active');

    elem.classList.add('choice-tabs__item--active');
  }

  choiceTabsItem.forEach((item) => { // установка событий на таб
    let id = item.dataset.for;

    item.addEventListener('click', () => {
      switchChoiceTabsItem(item);
      showChoiceTab(id);
    });
  })
}

choiceJs()
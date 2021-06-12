function headerJs() {

  // настройки слайдер в меню сайта
  const menuSlides = document.querySelectorAll('.menu-slider .menu-slide');
  const menuDots = document.querySelector('.menu-slider__dots');
  let dots = [];
  let numSlide = 0;
  let slideInterval = setInterval(switchNextSlide, 3000);

  function switchNextSlide() { // переход на следующий слайд
    numSlide = (numSlide + 1) % menuSlides.length;
    showSlide(numSlide);
  }

  function showSlide(i) { // отображение слайда по номеру
    document.querySelector('.menu-slide--active').classList.remove('menu-slide--active');
    document.querySelector('.menu-slider__dot--active').classList.remove('menu-slider__dot--active');

    menuSlides[i].classList.add('menu-slide--active');
    dots[i].classList.add('menu-slider__dot--active');
  }

  function clickDot(i) { // обработка клика по точке, переключение слайда, сброс таймера
    showSlide(i);
    numSlide = i;
    clearInterval(slideInterval);
    slideInterval = setInterval(switchNextSlide, 3000);
  }

  menuSlides.forEach((item, i) => { // создание и установка точек слайдера
    let dot = document.createElement('li');

    dot.classList.add('menu-slider__dot');

    if (item.classList.contains('menu-slide--active')) {
      dot.classList.add('menu-slider__dot--active');
    }

    dot.addEventListener('click', () => { clickDot(i) });
    dots[i] = dot;
    menuDots.append(dot);
  })

  // настройка открытия блока информации пунктов меню сайта
  const categorysMenu = document.querySelectorAll('.categorys-menu__link');
  const categorysInfo = document.querySelectorAll('.category-info');

  function showCategoryInfo(id) { // показ блока информации по id категории
    document.querySelector('.category-info--active').classList.remove('category-info--active');

    categorysInfo.forEach((item) => {
      if (item.dataset.id === id) {
        item.classList.add('category-info--active');
      }
    })
  }

  function switchActiveCategory(elem) { // переключение активной категории
    document.querySelector('.categorys-menu__link--active').classList.remove('categorys-menu__link--active');

    elem.classList.add('categorys-menu__link--active');
  }

  function openActiveCategory(elem) { // открытие активной категории мобильной версии
    const categorysMenuLinkActive = document.querySelector('.categorys-menu__link--active');

    if (categorysMenuLinkActive) {
      categorysMenuLinkActive.classList.remove('categorys-menu__link--active');
    }

    const categorysMenuSubmenu = elem.parentNode.querySelector('.categorys-menu__submenu');

    document.querySelectorAll('.categorys-menu__submenu').forEach((elem) => {
      elem.style.height = `${0}px`;
    })

    elem.classList.add('categorys-menu__link--active');
    categorysMenuSubmenu.style.height = `${categorysMenuSubmenu.scrollHeight}px`;
  }

  categorysMenu.forEach((item) => { // установка событий на пункты меню
    item.addEventListener('click', (e) => {
      e.preventDefault();

      if (window.innerWidth <= 320) {
        openActiveCategory(item);
      }
    });

    let id = item.dataset.for;

    item.addEventListener('mouseover', () => {
      switchActiveCategory(item);
      showCategoryInfo(id);
    });
  })

  // открытие закрытие меню, блокировка скролла
  const closeOpenMenuBtn = document.querySelector('.site-menu__btn');
  const siteMenu = document.querySelector('.site-menu');

  closeOpenMenuBtn.addEventListener('click', () => {
    closeOpenMenuBtn.classList.toggle('site-menu__btn--close');
    siteMenu.classList.toggle('site-menu--active');
    document.body.classList.toggle('lock');
  })
}

headerJs();
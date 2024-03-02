/* eslint-disable no-use-before-define */

import players from './players';

export default function useCarouselPlayers() {
  const CAROUSEL = document.querySelector('#carousel');
  const PAGINATION = document.querySelector('#pagination');
  const BTN_PREV = document.querySelector('#prev');
  const BTN_NEXT = document.querySelector('#next');
  const SHOWN_NUMBER = document.querySelector('#shown-number');
  const QUANTITY = document.querySelector('#quantity');

  const playersLength = players.length;
  let countCards = getCountCards(window.innerWidth);
  let showCard = countCards;

  let cards = createCardList(countCards, playersLength, players);
  cards.forEach((element) => CAROUSEL.append(element));

  QUANTITY.innerHTML = `&#47;${players.length}`;
  SHOWN_NUMBER.innerHTML = `${showCard}`;

  function getCountCards(screenWidth) {
    if (screenWidth > 1200) {
      return 3;
    }
    if (screenWidth < 789) {
      return 1;
    }
    return 2;
  }

  function handleResize() {
    const newCountCards = getCountCards(window.innerWidth);

    if (newCountCards !== countCards) {
      countCards = newCountCards;
      showCard = newCountCards;
      cards = createCardList(countCards, playersLength, players);

      CAROUSEL.innerHTML = '';
      cards.forEach((element) => CAROUSEL.append(element));

      SHOWN_NUMBER.innerHTML = `${showCard}`;
    }
  }

  // Добавляем обработчик события resize
  window.addEventListener('resize', handleResize);

  function createCard(card) {
    const cardElem = document.createElement('div');
    cardElem.classList.add('cards__item');
    cardElem.innerHTML = `
    <img src="${card.photo}" alt="Игрок" />
    <div class="cards__info">
      <p class="cards__name">${card.name}</p>
      <p class="cards__description">${card.description}</p>
    </div>
    <button class="cards__btn">Подробнее</button>
    `;
    return cardElem;
  }

  function createCardList(number, quantity, arr) {
    const elements = [];
    const step = Math.floor(quantity / number);

    for (let i = 0; i < step; i += 1) {
      const cardsList = document.createElement('li');
      cardsList.classList.add('cards__list');
      if (i === 0) cardsList.classList.add('is-selected');

      for (let j = 0; j < number; j += 1) {
        cardsList.append(createCard(arr[i * number + j]));
      }

      if (i === step - 1) {
        elements.unshift(cardsList);
      } else {
        elements.push(cardsList);
      }
    }

    if (step < countCards) {
      elements.push(elements[0].cloneNode(true));
    }

    return elements;
  }

  function counterShowcard(isNext) {
    showCard += isNext ? countCards : -countCards;
    if (showCard > players.length) showCard = isNext ? countCards : players.length;
    if (showCard === 0) showCard = players.length;
    SHOWN_NUMBER.innerHTML = `${showCard}`;
  }

  function handleButtonClick(isNext) {
    cards = [...CAROUSEL.children];
    const currSlide = CAROUSEL.querySelector('.is-selected');
    currSlide.classList.remove('is-selected');
    let targetSlide;

    if (isNext) {
      targetSlide = currSlide.nextElementSibling;

      if (countCards === 3) {
        CAROUSEL.append(cards[1]);
      } else {
        CAROUSEL.append(cards[0]);
      }
    } else {
      targetSlide = currSlide.previousElementSibling;

      if (countCards === 3) {
        CAROUSEL.prepend(cards[cards.length - 2]);
      } else {
        CAROUSEL.prepend(cards[cards.length - 1]);
      }
    }

    targetSlide.classList.add('is-selected');

    counterShowcard(isNext);
  }

  BTN_NEXT.addEventListener('click', () => {
    handleButtonClick(true);
  });

  BTN_PREV.addEventListener('click', () => {
    handleButtonClick(false);
  });

  // Auto sliding
  const slideTiming = 4000;
  let interval;

  const slideNext = () => {
    BTN_NEXT.dispatchEvent(new Event('click'));
  };

  const startSlideInterval = () => {
    interval = setTimeout(() => {
      slideNext();
      startSlideInterval();
    }, slideTiming);
  };

  const stopSlideInterval = () => {
    clearTimeout(interval);
  };

  CAROUSEL.addEventListener('mouseover', stopSlideInterval);
  PAGINATION.addEventListener('mouseover', stopSlideInterval);

  CAROUSEL.addEventListener('mouseleave', startSlideInterval);
  PAGINATION.addEventListener('mouseleave', startSlideInterval);

  startSlideInterval();
}

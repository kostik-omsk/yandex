/* eslint-disable no-nested-ternary */
/* eslint-disable no-use-before-define */

import players from '../players';

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

  function createCard(card) {
    const cardElem = document.createElement('div');
    cardElem.classList.add('cards__item');
    cardElem.innerHTML = `
    <img src="${card.photo}" alt="Игрок">
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
    const step = Math.ceil(quantity / number);

    for (let i = 0; i < step; i += 1) {
      const cardsList = document.createElement('li');
      cardsList.classList.add('cards__list');
      if (i === 0) cardsList.classList.add('is-selected');

      for (let j = 0; j < number; j += 1) {
        const index = i * number + j;
        if (index < quantity) {
          cardsList.append(createCard(arr[index]));
        }
      }

      if (i === step - 1) {
        elements.unshift(cardsList);
      } else {
        elements.push(cardsList);
      }
    }

    if (step < countCards) {
      elements.push(elements[0].cloneNode(true));
      const last = elements[1].cloneNode(true);
      last.classList.remove('is-selected');
      elements.push(last);
    }

    return elements;
  }

  function counterShowcard(isNext) {
    const totalCards = players.length;

    if (isNext) {
      const cardsRemaining = totalCards - showCard;
      showCard += Math.min(cardsRemaining || countCards, countCards);

      if (showCard > totalCards) {
        showCard = countCards;
      }
    } else {
      const cardsRemaining = totalCards % countCards;

      if (showCard === countCards) {
        showCard = totalCards;
      } else if (showCard === totalCards) {
        showCard -= cardsRemaining || countCards;
      } else {
        showCard -= countCards;
      }
    }

    SHOWN_NUMBER.innerHTML = `${showCard}`;
  }

  function handleButtonClick(isNext) {
    cards = [...CAROUSEL.children];
    const currSlide = CAROUSEL.querySelector('.is-selected');
    const currentIndex = cards.indexOf(currSlide);
    currSlide.classList.remove('is-selected');

    let targetIndex;

    if (isNext) {
      targetIndex = currentIndex < cards.length - 1 ? currentIndex + 1 : 0;
    } else {
      targetIndex = currentIndex > 0 ? currentIndex - 1 : cards.length - 1;
    }

    const targetSlide = cards[targetIndex];

    targetSlide.classList.add('is-selected');

    if (isNext) {
      CAROUSEL.appendChild(cards.shift());
    } else {
      CAROUSEL.insertBefore(cards.pop(), cards[0]);
    }

    counterShowcard(isNext);
  }

  BTN_NEXT.addEventListener('click', () => {
    handleButtonClick(true);
  });

  BTN_PREV.addEventListener('click', () => {
    handleButtonClick(false);
  });

  window.addEventListener('resize', handleResize);

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

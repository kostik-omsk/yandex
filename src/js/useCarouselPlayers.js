/* eslint-disable no-plusplus */
/* eslint-disable no-use-before-define */

import players from './players';

export default function useCarouselPlayers() {
  const CAROUSEL = document.querySelector('#carousel');
  const LIST_RIGHT = document.querySelector('#cards__list-right');
  const LIST_ACTIVE = document.querySelector('#cards__list-active');
  const LIST_LEFT = document.querySelector('#cards__list-left');
  const BTN_PREV = document.querySelector('#prev');
  const BTN_NEXT = document.querySelector('#next');
  const SHOWN_NUMBER = document.querySelector('#shown-number');
  const QUANTITY = document.querySelector('#quantity');

  const startWidth = window.innerWidth;
  const countCards = getCountCards(startWidth);
  let order = 1;
  let showcard = countCards;

  QUANTITY.innerHTML = `&#47;${players.length}`;
  SHOWN_NUMBER.innerHTML = `${showcard}`;
  let startCards = generatorCardsSet(players, countCards, order);

  let prevSlide = startCards[0];
  let activSlide = startCards[1];
  let nextSlide = startCards[2];

  function getCountCards(screenWidth) {
    if (screenWidth > 1200) {
      return 3;
    }
    if (screenWidth < 740) {
      return 1;
    }
    return 2;
  }

  function createCard(card) {
    const cardElem = document.createElement('div');
    cardElem.classList.add('cards__item');
    cardElem.dataset.showcard = `${card.name}`;
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

  function generatorCardsSet(arr, count, activSlideOrder) {
    const totalPlayers = arr.length;
    const activIndex = activSlideOrder - 1;

    const prevIndex = (activIndex - count + totalPlayers) % totalPlayers;
    const nextIndex = (activIndex + count) % totalPlayers;

    const prevSlideSet = [];
    const activSlideSet = [];
    const nextSlideSet = [];

    for (let i = 0; i < count; i++) {
      prevSlideSet.push(players[(prevIndex + i) % totalPlayers]);
      activSlideSet.push(players[(activIndex + i) % totalPlayers]);
      nextSlideSet.push(players[(nextIndex + i) % totalPlayers]);
    }

    return [prevSlideSet, activSlideSet, nextSlideSet];
  }

  function renderCardsList(cards) {
    LIST_LEFT.innerHTML = '';
    LIST_ACTIVE.innerHTML = '';
    LIST_RIGHT.innerHTML = '';

    cards[0].forEach((card) => LIST_LEFT.append(createCard(card)));
    cards[1].forEach((card) => LIST_ACTIVE.append(createCard(card)));
    cards[2].forEach((card) => LIST_RIGHT.append(createCard(card)));
  }
  function handleAnimationEnd(animationName) {
    CAROUSEL.classList.remove(`transition-${animationName}`);
    [prevSlide, activSlide, nextSlide] = startCards;
    renderCardsList([prevSlide, activSlide, nextSlide]);
  }

  function handleButtonClick(isNext) {
    BTN_PREV.disabled = true;
    BTN_NEXT.disabled = true;
    CAROUSEL.classList.add(`transition-${isNext ? 'right' : 'left'}`);
    order = (order + (isNext ? countCards : -countCards) + players.length) % players.length;
    showcard += isNext ? countCards : -countCards;
    if (showcard > players.length) showcard = isNext ? countCards : players.length;
    if (showcard === 0) showcard = players.length;
    SHOWN_NUMBER.innerHTML = `${showcard}`;
  }

  function handleNextClick() {
    handleButtonClick(true);
  }

  function handlePrevClick() {
    handleButtonClick(false);
  }

  BTN_NEXT.addEventListener('click', handleNextClick);
  BTN_PREV.addEventListener('click', handlePrevClick);

  CAROUSEL.addEventListener('animationend', (animationEvent) => {
    startCards = generatorCardsSet(players, countCards, order);
    if (
      animationEvent.animationName === 'move-right' ||
      animationEvent.animationName === 'move-left'
    ) {
      const animationDirection = animationEvent.animationName.replace('move-', '');
      handleAnimationEnd(animationDirection);
      BTN_PREV.disabled = false;
      BTN_NEXT.disabled = false;
    }
  });

  renderCardsList(startCards);
  // setInterval(() => {
  //   handleButtonClick(true);
  // }, 4000);
}

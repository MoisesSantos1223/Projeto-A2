import { getCharacters, getImageUrl } from "./characters.js";
import { startTimer, stopTimer, resetTimer } from "./timer.js";
import { registerMatch } from "./history.js";

const difficultyPairs = { easy: 4, normal: 6, hard: 8 };
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;
let moves = 0;
let pairCount = 6;
let mismatchTimeout = null;
let onVictory = () => {};

const board = document.querySelector("#game-board");
const timerDisplay = document.querySelector("#timer-display");
const movesDisplay = document.querySelector("#moves-display");
const pairsDisplay = document.querySelector("#pairs-display");

const shuffle = (items) => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

const createCard = (character, index) => {
  const card = document.createElement("button");
  card.className = "memory-card";
  card.type = "button";
  card.dataset.character = character.id;
  card.dataset.index = index;
  card.setAttribute("aria-label", "Carta virada para baixo");

  const inner = document.createElement("span");
  inner.className = "card-inner";
  const back = document.createElement("span");
  back.className = "card-face card-back";
  const front = document.createElement("span");
  front.className = "card-face card-front";

  const image = document.createElement("img");
  image.src = getImageUrl(character);
  image.alt = character.name;
  image.onerror = () => {
    image.remove();
    const fallback = document.createElement("span");
    fallback.className = "fallback";
    fallback.textContent = character.fallback;
    front.append(fallback);
  };

  front.append(image);
  inner.append(back, front);
  card.append(inner);
  card.addEventListener("click", () => flipCard(card));
  return card;
};

const updateStats = () => {
  movesDisplay.textContent = moves;
  pairsDisplay.textContent = `${matchedPairs} / ${pairCount}`;
};

const flipCard = (card) => {
  if (
    lockBoard ||
    card.classList.contains("flipped") ||
    card.classList.contains("matched")
  )
    return;

  card.classList.add("flipped");
  card.setAttribute("aria-label", `Personagem: ${card.dataset.character}`);

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  moves += 1;
  updateStats();
  lockBoard = true;

  if (firstCard.dataset.character === secondCard.dataset.character) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    firstCard.disabled = true;
    secondCard.disabled = true;
    matchedPairs += 1;
    resetTurn();
    updateStats();

    if (matchedPairs === pairCount) finishGame();
  } else {
    mismatchTimeout = setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      firstCard.setAttribute("aria-label", "Carta virada para baixo");
      secondCard.setAttribute("aria-label", "Carta virada para baixo");
      resetTurn();
    }, 850);
  }
};

const resetTurn = () => {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  if (mismatchTimeout) {
    clearTimeout(mismatchTimeout);
    mismatchTimeout = null;
  }
};

const finishGame = () => {
  const finalTime = stopTimer();
  const match = registerMatch({ tempo: finalTime, movimentos: moves });
  onVictory({ tempo: finalTime, movimentos: moves, partida: match });
};

export const startGame = ({
  difficulty = "normal",
  onComplete = () => {},
} = {}) => {
  if (mismatchTimeout) clearTimeout(mismatchTimeout);
  resetTurn();
  pairCount = difficultyPairs[difficulty] || difficultyPairs.normal;
  matchedPairs = 0;
  moves = 0;
  onVictory = onComplete;
  timerDisplay.textContent = resetTimer();
  updateStats();

  const deck = getCharacters(pairCount).flatMap((character) => [
    character,
    character,
  ]);
  board.replaceChildren(...shuffle(deck).map(createCard));
  startTimer((value) => {
    timerDisplay.textContent = value;
  });
};

export const stopGame = () => {
  if (mismatchTimeout) clearTimeout(mismatchTimeout);
  resetTurn();
  stopTimer();
};

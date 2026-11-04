import { startGame } from "../game.js";
import { loadSettings } from "../settings.js";

const gameScreen = document.querySelector("#game-screen");
const victoryScreen = document.querySelector("#victory-screen");

const showScreen = (screenToShow) => {
  [gameScreen, victoryScreen].forEach((screen) =>
    screen.classList.toggle("active", screen === screenToShow),
  );
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const beginAdventure = () => {
  showScreen(gameScreen);
  startGame({
    difficulty: loadSettings().difficulty,
    onComplete: ({ tempo, movimentos }) => {
      document.querySelector("#final-time").textContent = tempo;
      document.querySelector("#final-moves").textContent = movimentos;
      showScreen(victoryScreen);
    },
  });
};

document
  .querySelector("[data-action='restart']")
  .addEventListener("click", beginAdventure);

beginAdventure();

import { characters } from "./characters.js";
import { startGame, stopGame } from "./game.js";

const screens = [...document.querySelectorAll(".screen")];
const difficultySelect = document.querySelector("#difficulty-select");
const soundToggle = document.querySelector("#sound-toggle");
let currentScreen = "menu";

const showScreen = (screenName) => {
  screens.forEach((screen) =>
    screen.classList.toggle("active", screen.id === `${screenName}-screen`),
  );
  currentScreen = screenName;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const renderCharacterList = () => {
  const list = document.querySelector("#character-list");
  list.replaceChildren(
    ...characters.map((character) => {
      const entry = document.createElement("article");
      entry.className = "character-entry";
      const image = document.createElement("img");
      image.src = character.image;
      image.alt = character.name;
      image.onerror = () => {
        image.remove();
        const fallback = document.createElement("span");
        fallback.className = "fallback";
        fallback.textContent = character.fallback;
        fallback.style.cssText =
          "width:55px;height:55px;display:grid;place-items:center;background:#17130f;font-size:28px";
        entry.prepend(fallback);
      };
      const details = document.createElement("div");
      const name = document.createElement("b");
      name.textContent = character.name;
      const role = document.createElement("small");
      role.textContent = character.className;
      details.append(name, role);
      entry.append(image, details);
      return entry;
    }),
  );
};

const beginAdventure = () => {
  showScreen("game");
  startGame({
    difficulty: difficultySelect.value,
    onComplete: ({ tempo, movimentos }) => {
      document.querySelector("#final-time").textContent = tempo;
      document.querySelector("#final-moves").textContent = movimentos;
      showScreen("victory");
    },
  });
};

document.addEventListener("click", (event) => {
  const screenButton = event.target.closest("[data-screen]");
  const actionButton = event.target.closest("[data-action]");

  if (screenButton) {
    const target = screenButton.dataset.screen;
    if (currentScreen === "game" && target !== "game") stopGame();
    showScreen(target);
  }

  if (!actionButton) return;
  switch (actionButton.dataset.action) {
    case "start":
    case "restart":
      beginAdventure();
      break;
    case "quit":
      stopGame();
      showScreen("menu");
      break;
  }
});

renderCharacterList();
showScreen("menu");

soundToggle.addEventListener("change", () => {
  soundToggle.setAttribute(
    "aria-label",
    soundToggle.checked
      ? "Efeitos sonoros ativados"
      : "Efeitos sonoros desativados",
  );
});

import { loadSettings, saveSettings } from "../settings.js";

const difficultySelect = document.querySelector("#difficulty-select");
const soundToggle = document.querySelector("#sound-toggle");

const updateSoundLabel = () => {
  soundToggle.setAttribute(
    "aria-label",
    soundToggle.checked
      ? "Efeitos sonoros ativados"
      : "Efeitos sonoros desativados",
  );
};

const persist = () => {
  saveSettings({
    difficulty: difficultySelect.value,
    sound: soundToggle.checked,
  });
};

const settings = loadSettings();
difficultySelect.value = settings.difficulty;
soundToggle.checked = settings.sound;
updateSoundLabel();

difficultySelect.addEventListener("change", persist);
soundToggle.addEventListener("change", () => {
  updateSoundLabel();
  persist();
});

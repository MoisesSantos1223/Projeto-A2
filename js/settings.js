const STORAGE_KEY = "eldoria:settings";
const defaultSettings = { difficulty: "normal", sound: true };

export const loadSettings = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return { ...defaultSettings, ...saved };
  } catch {
    return { ...defaultSettings };
  }
};

export const saveSettings = (settings) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {}
};

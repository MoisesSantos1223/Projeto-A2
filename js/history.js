const STORAGE_KEY = "eldoria:history";

export const getHistory = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
};

const saveHistory = (history) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {}
};

export const registerMatch = ({ tempo, movimentos, resultado = "Vitoria" }) => {
  const history = getHistory();
  const lastId = history.reduce((max, match) => Math.max(max, match.id), 0);
  const partida = {
    id: lastId + 1,
    data: new Date().toISOString(),
    tempo,
    movimentos,
    resultado,
  };
  saveHistory([...history, partida]);
  return partida;
};

export const clearHistory = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
};

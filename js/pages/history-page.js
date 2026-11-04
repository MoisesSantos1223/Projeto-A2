import { getHistory, clearHistory } from "../history.js";

const tableBody = document.querySelector("#history-body");
const table = document.querySelector("#history-table");
const emptyMessage = document.querySelector("#history-empty");
const summary = document.querySelector("#history-summary");
const clearButton = document.querySelector("#clear-history");
const confirmDialog = document.querySelector("#confirm-dialog");

const formatDate = (isoDate) =>
  new Date(isoDate).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });

const createRow = (match) => {
  const row = document.createElement("tr");
  const cells = [
    `#${match.id}`,
    match.tempo,
    match.movimentos,
    formatDate(match.data),
  ];
  cells.forEach((value) => {
    const cell = document.createElement("td");
    cell.textContent = value;
    row.append(cell);
  });
  return row;
};

const renderHistory = () => {
  const history = getHistory().reverse();
  const hasMatches = history.length > 0;

  tableBody.replaceChildren(...history.map(createRow));
  table.hidden = !hasMatches;
  emptyMessage.hidden = hasMatches;
  clearButton.disabled = !hasMatches;
  summary.textContent = hasMatches
    ? `${history.length} ${history.length === 1 ? "partida concluída" : "partidas concluídas"}`
    : "";
};

clearButton.addEventListener("click", () => {
  confirmDialog.returnValue = "";
  confirmDialog.showModal();
});

confirmDialog.addEventListener("close", () => {
  if (confirmDialog.returnValue !== "confirm") return;
  clearHistory();
  renderHistory();
});

renderHistory();

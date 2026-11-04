let intervalId = null;
let startTimestamp = 0;
let elapsedSeconds = 0;

const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

export const startTimer = (onTick) => {
  stopTimer();
  startTimestamp = Date.now();
  elapsedSeconds = 0;
  onTick(formatTime(elapsedSeconds));
  intervalId = setInterval(() => {
    elapsedSeconds = Math.floor((Date.now() - startTimestamp) / 1000);
    onTick(formatTime(elapsedSeconds));
  }, 250);
};

export const stopTimer = () => {
  if (intervalId !== null) clearInterval(intervalId);
  intervalId = null;
  if (startTimestamp)
    elapsedSeconds = Math.floor((Date.now() - startTimestamp) / 1000);
  return formatTime(elapsedSeconds);
};

export const resetTimer = () => {
  stopTimer();
  startTimestamp = 0;
  elapsedSeconds = 0;
  return formatTime(0);
};

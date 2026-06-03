function shouldLoopSingleVideo(type, totalItems) {
  return type === "video" && totalItems === 1;
}

function getNextIndex(currentIndex, totalItems) {
  if (totalItems <= 1) {
    return 0;
  }

  return currentIndex + 1 >= totalItems ? 0 : currentIndex + 1;
}

function getSyncDelay(startAt, now) {
  return Math.max(0, startAt - now);
}

module.exports = {
  getNextIndex,
  getSyncDelay,
  shouldLoopSingleVideo,
};

const test = require("node:test");
const assert = require("node:assert/strict");

const {
  getNextIndex,
  getSyncDelay,
  shouldLoopSingleVideo,
} = require("./display-runtime");

test("shouldLoopSingleVideo returns true only for a single video item", () => {
  assert.equal(shouldLoopSingleVideo("video", 1), true);
  assert.equal(shouldLoopSingleVideo("image", 1), false);
  assert.equal(shouldLoopSingleVideo("video", 2), false);
});

test("getNextIndex wraps to zero at the end of the playlist", () => {
  assert.equal(getNextIndex(0, 1), 0);
  assert.equal(getNextIndex(1, 2), 0);
  assert.equal(getNextIndex(0, 3), 1);
});

test("getSyncDelay never returns a negative delay", () => {
  assert.equal(getSyncDelay(3_000, 1_000), 2_000);
  assert.equal(getSyncDelay(1_000, 3_000), 0);
});

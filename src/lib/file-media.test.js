const test = require("node:test");
const assert = require("node:assert/strict");

const { getContentTypeForPath } = require("./file-media");

test("getContentTypeForPath maps supported media extensions", () => {
  assert.equal(getContentTypeForPath("/uploads/a.mp4"), "video/mp4");
  assert.equal(getContentTypeForPath("/uploads/a.webm"), "video/webm");
  assert.equal(getContentTypeForPath("/uploads/a.mov"), "video/quicktime");
  assert.equal(getContentTypeForPath("/uploads/a.jpg"), "image/jpeg");
  assert.equal(getContentTypeForPath("/uploads/a.jpeg"), "image/jpeg");
  assert.equal(getContentTypeForPath("/uploads/a.png"), "image/png");
  assert.equal(getContentTypeForPath("/uploads/a.pdf"), "application/pdf");
});

test("getContentTypeForPath falls back to octet-stream", () => {
  assert.equal(
    getContentTypeForPath("/uploads/a.unknown"),
    "application/octet-stream"
  );
});

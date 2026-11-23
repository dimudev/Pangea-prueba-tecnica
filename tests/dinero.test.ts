import { test } from "node:test";
import assert from "node:assert/strict";
import { parsePesos, formatoCOP } from "../src/dinero.ts";

test("parsePesos lee enteros simples", () => {
  assert.equal(parsePesos("250000"), 250000);
});
test("parsePesos ignora espacios", () => {
  assert.equal(parsePesos("  90000 "), 90000);
});
test("parsePesos rechaza texto", () => {
  assert.throws(() => parsePesos("abc"));
});
test("formatoCOP agrega símbolo", () => {
  assert.match(formatoCOP(1000), /^\$ /);
});

import test from "node:test";
import assert from "node:assert/strict";
import { getCountdownParts } from "./countdown.ts";

test("getCountdownParts returns whole day and clock parts before the event", () => {
  const parts = getCountdownParts(
    new Date("2027-07-17T17:00:00-07:00"),
    new Date("2027-07-16T15:29:30-07:00")
  );

  assert.deepEqual(parts, {
    days: 1,
    hours: 1,
    minutes: 30,
    seconds: 30,
  });
});

test("getCountdownParts never returns negative values after the event", () => {
  const parts = getCountdownParts(
    new Date("2027-07-17T17:00:00-07:00"),
    new Date("2027-07-18T17:00:00-07:00")
  );

  assert.deepEqual(parts, {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
});

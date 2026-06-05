import { describe, expect, it } from "vitest";
import { activeLyricIndex, parseLrc, serializeLrc } from "@/lib/lyrics/lrc";

describe("LRC utilities", () => {
  it("parses, sorts, and serializes lyric timestamps", () => {
    const lines = parseLrc("[00:10.50]Second\n[00:02.00]First");
    expect(lines.map((line) => line.text)).toEqual(["First", "Second"]);
    expect(serializeLrc(lines)).toContain("[00:10.50]Second");
  });

  it("selects the active lyric with an offset", () => {
    const lines = parseLrc("[00:02.00]First\n[00:04.00]Second");
    expect(activeLyricIndex(lines, 3.6, 500)).toBe(1);
  });
});

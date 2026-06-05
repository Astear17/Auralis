import type { LyricLine } from "@/lib/types";

const timestampPattern = /\[(\d{1,2}):(\d{2})(?:[.:](\d{1,3}))?\]/g;

export function parseLrc(input: string): LyricLine[] {
  const lines: LyricLine[] = [];

  input.split(/\r?\n/).forEach((rawLine, row) => {
    const text = rawLine.replace(timestampPattern, "").trim();
    const matches = [...rawLine.matchAll(timestampPattern)];
    matches.forEach((match, index) => {
      const minutes = Number(match[1]);
      const seconds = Number(match[2]);
      const fraction = match[3] ? Number(`0.${match[3].padEnd(3, "0")}`) : 0;
      lines.push({
        id: `line-${row}-${index}`,
        time: minutes * 60 + seconds + fraction,
        text: text || "♪",
      });
    });
  });

  return lines.sort((a, b) => a.time - b.time);
}

export function serializeLrc(lines: LyricLine[]) {
  return lines
    .sort((a, b) => a.time - b.time)
    .map((line) => {
      const minutes = Math.floor(line.time / 60);
      const seconds = Math.floor(line.time % 60);
      const hundredths = Math.floor((line.time % 1) * 100);
      return `[${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${hundredths.toString().padStart(2, "0")}]${line.text}`;
    })
    .join("\n");
}

export function activeLyricIndex(
  lines: LyricLine[],
  time: number,
  offsetMs = 0,
) {
  const adjusted = time + offsetMs / 1000;
  let active = -1;
  for (let index = 0; index < lines.length; index += 1) {
    if (lines[index].time <= adjusted) active = index;
    else break;
  }
  return active;
}

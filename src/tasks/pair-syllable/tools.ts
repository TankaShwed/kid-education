import { PairSyllableLetter } from "./pairSyllableSlice";

export function flyPosition(
    letter: PairSyllableLetter,
    selectLetterId: string | null,
    customPosition: { xs: number; ys: number, xe: number, ye: number } | null,
    clientWidth: number,
    clientHeight: number,
  ): { x: number; y: number } {
  if (!customPosition || letter.id !== selectLetterId || selectLetterId === null)
    return letter.position;

  const dx = customPosition.xe - customPosition.xs;
  const dy = customPosition.ye - customPosition.ys;
  const x = letter.position.x + dx * 100 / clientWidth;
  const y = letter.position.y + dy * 100 / clientHeight;
  return { x, y };
}

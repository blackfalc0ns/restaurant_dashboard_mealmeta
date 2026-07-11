/** Deterministic QR-like matrix for mock invoice scanning UI (no external lib). */
export function buildQrMatrix(payload: string, size = 21): boolean[][] {
  const matrix = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => false),
  );

  const paintFinder = (row: number, col: number): void => {
    for (let r = 0; r < 7; r += 1) {
      for (let c = 0; c < 7; c += 1) {
        const edge = r === 0 || r === 6 || c === 0 || c === 6;
        const core = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        matrix[row + r][col + c] = edge || core;
      }
    }
  };

  paintFinder(0, 0);
  paintFinder(0, size - 7);
  paintFinder(size - 7, 0);

  for (let i = 8; i < size - 8; i += 1) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  let hash = 2166136261;
  for (let i = 0; i < payload.length; i += 1) {
    hash ^= payload.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  for (let r = 0; r < size; r += 1) {
    for (let c = 0; c < size; c += 1) {
      const inFinder =
        (r < 9 && c < 9) ||
        (r < 9 && c >= size - 8) ||
        (r >= size - 8 && c < 9) ||
        r === 6 ||
        c === 6;
      if (inFinder) continue;
      hash = Math.imul(hash ^ (r * 31 + c), 16777619);
      matrix[r][c] = (hash >>> 0) % 3 !== 0;
    }
  }

  return matrix;
}

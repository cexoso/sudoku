import { define } from '@cexoso/react-singleton'
import { useRandom } from './random'

// 81 个格子，null 表示空格
export type Board = (number | null)[]

export const useBoard = define<Board>(() => Array.from({ length: 81 }, () => null))

// Fisher-Yates shuffle
function shuffle<T>(arr: T[], random: () => number): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

// 基础合法数独（确定性，保证有解）
// 使用公式：cell[r][c] = ((r * 3 + Math.floor(r / 3) + c) % 9) + 1
function baseBoard(): number[] {
  return Array.from({ length: 81 }, (_, i) => {
    const r = Math.floor(i / 9)
    const c = i % 9
    return ((r * 3 + Math.floor(r / 3) + c) % 9) + 1
  })
}

// 对基础数独做随机变换：打乱数字映射、打乱行组、打乱列组、组内行打乱、组内列打乱
function generateFullBoard(random: () => number): Board {
  const base = baseBoard()

  // 数字映射：1-9 随机重新映射
  const numMap = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9], random)

  // 行组（3组各3行）和列组内打乱
  const rowGroups = shuffle([0, 1, 2], random).map((g) => {
    const rows = shuffle([0, 1, 2], random).map((r) => g * 3 + r)
    return rows
  })
  const colGroups = shuffle([0, 1, 2], random).map((g) => {
    const cols = shuffle([0, 1, 2], random).map((c) => g * 3 + c)
    return cols
  })

  const rowOrder = rowGroups.flat()
  const colOrder = colGroups.flat()

  const board: Board = Array.from({ length: 81 }, () => null)
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const srcRow = rowOrder[r]
      const srcCol = colOrder[c]
      const srcVal = base[srcRow * 9 + srcCol]
      board[r * 9 + c] = numMap[srcVal - 1]
    }
  }
  return board
}

// 从完整棋盘中随机挖去格子，保留 givens 个初始数字
function digHoles(board: Board, givens: number, random: () => number): Board {
  const result = [...board]
  const indices = shuffle(
    Array.from({ length: 81 }, (_, i) => i),
    random,
  )
  let kept = 81
  for (const idx of indices) {
    if (kept <= givens) break
    result[idx] = null
    kept--
  }
  return result
}

export const usePlay = () => {
  const random = useRandom()
  const [, setBoard] = useBoard()

  return (givens = 30) => {
    const full = generateFullBoard(random)
    const puzzle = digHoles(full, givens, random)
    setBoard(puzzle)
  }
}

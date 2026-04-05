import { define } from '@cexoso/react-singleton'
import { useRandom } from './random'
import { Board, useAnswers, useBoard, useSetAnswers, useSetBoard } from './state'

export const difficulties = [
  {
    level: 0,
    label: '简单',
    value: 50,
  },
  {
    level: 1,
    label: '普通',
    value: 30,
  },
  {
    level: 2,
    label: '困难',
    value: 15,
  },
]

export const useInitialCount = define(() => difficulties.find((item) => item.level === 1)!.value)

// 当前选中的格子索引，null 表示未选中
export const useSelectedIndex = define<number | null>(() => null)

// 检测所有冲突格子的索引集合
export function getConflicts(board: Board, answers: Board): Set<number> {
  // 合并题目和用户答案为当前棋盘状态
  const current = board.map((v, i) => (v !== null ? v : answers[i]))
  const conflicts = new Set<number>()

  for (let i = 0; i < 81; i++) {
    if (current[i] === null) continue
    const row = Math.floor(i / 9)
    const col = i % 9
    const boxRow = Math.floor(row / 3) * 3
    const boxCol = Math.floor(col / 3) * 3

    for (let j = 0; j < 81; j++) {
      if (i === j || current[j] === null || current[i] !== current[j]) continue
      const rj = Math.floor(j / 9)
      const cj = j % 9
      const sameRow = rj === row
      const sameCol = cj === col
      const sameBox = Math.floor(rj / 3) * 3 === boxRow && Math.floor(cj / 3) * 3 === boxCol
      if (sameRow || sameCol || sameBox) {
        conflicts.add(i)
        conflicts.add(j)
      }
    }
  }
  return conflicts
}

// 判断游戏是否完成（无空格且无冲突）
export function isGameComplete(board: Board, answers: Board): boolean {
  const current = board.map((v, i) => (v !== null ? v : answers[i]))
  if (current.some((v) => v === null)) return false
  return getConflicts(board, answers).size === 0
}

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
    random
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
  const setBoard = useSetBoard()
  const setAnswers = useSetAnswers()
  const [, setSelected] = useSelectedIndex()
  const [initCount, setInitCount] = useInitialCount()
  return (givens: number = initCount) => {
    setInitCount(givens)
    const full = generateFullBoard(random)
    const puzzle = digHoles(full, givens, random)
    setBoard(puzzle)
    setAnswers(Array.from({ length: 81 }, () => null))
    setSelected(null)
  }
}

export const useFillCell = () => {
  const [selectedIndex] = useSelectedIndex()
  const setAnswers = useSetAnswers()

  return (value: number | '') => {
    if (selectedIndex === null) return false
    setAnswers((answers) => {
      const next = [...answers]
      next[selectedIndex] = value === '' ? null : value
      return next
    })
    return true
  }
}

export const useIsStarted = () => {
  const board = useBoard()
  return board.some((v) => v !== null)
}

export const useGameState = () => {
  const board = useBoard()
  const answers = useAnswers()
  const conflicts = getConflicts(board, answers)
  const completed = isGameComplete(board, answers)
  return { conflicts, completed }
}

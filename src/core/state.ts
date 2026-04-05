import { define } from '@cexoso/react-singleton'
export type Board = (number | null)[]

const innerUseBoard = define<Board>(() => Array.from({ length: 81 }, () => null))
export const useBoard = () => innerUseBoard()[0]
export const useSetBoard = () => {
  const [pre, set] = innerUseBoard()
  return (nextBoard: Board | ((pre: Board) => Board)) => {
    if (typeof nextBoard === 'function') {
      return set(nextBoard(pre))
    }
    return set(nextBoard)
  }
}

const innerUseAnswers = define<Board>(() => Array.from({ length: 81 }, () => null))

export const useAnswers = () => innerUseAnswers()[0]

export const useSetAnswers = () => {
  const [pre, set] = innerUseAnswers()
  return (nextBoard: Board | ((pre: Board) => Board)) => {
    if (typeof nextBoard === 'function') {
      return set(nextBoard(pre))
    }
    return set(nextBoard)
  }
}

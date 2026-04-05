import { define } from '@cexoso/react-singleton'
import { useEffect } from 'react'
import { useStorageHumbleObject } from './random'
export type Board = (number | null)[]

export const useSetItem = () => {
  const storage = useStorageHumbleObject()[0]
  return <T>(key: string, nextBoard: T) => {
    try {
      storage.setItem(key, JSON.stringify(nextBoard))
    } catch (_e) {}
  }
}
export const useGetItem = () => {
  const storage = useStorageHumbleObject()[0]
  return <T>(key: string): T | null => {
    const value = storage.getItem(key)
    if (value === null) {
      return value
    }
    try {
      return JSON.parse(value)
    } catch (_e) {
      return null
    }
  }
}

// 将最近玩的棋存到 localstorage 中
// 要依赖 effect 来进行持久化是一个非常不好的方式，但是现在我们没有办法在设置后立即获取到新值
// 所以拦截 set 后进行持久化目前还不可行，这也暴露了 react 函数式的一个缺点
export const usePersistence = () => {
  const board = useBoard()
  const answers = useAnswers()
  useEffect(() => {
    localStorage.setItem
  }, [board, answers])
}

const innerUseBoard = define<Board>(() => Array.from({ length: 81 }, () => null))
export const useBoard = () => innerUseBoard()[0]
export const useSetBoard = () => {
  const setItem = useSetItem()
  const [pre, set] = innerUseBoard()
  return (nextBoard: Board | ((pre: Board) => Board)) => {
    const finalBoard = typeof nextBoard === 'function' ? nextBoard(pre) : nextBoard
    setItem('board', finalBoard)
    return set(finalBoard)
  }
}

const innerUseAnswers = define<Board>(() => Array.from({ length: 81 }, () => null))

export const useAnswers = () => innerUseAnswers()[0]

export const useSetAnswers = () => {
  const [pre, set] = innerUseAnswers()
  const setItem = useSetItem()
  return (nextBoard: Board | ((pre: Board) => Board)) => {
    const finalBoard = typeof nextBoard === 'function' ? nextBoard(pre) : nextBoard
    setItem('answers', finalBoard)
    return set(finalBoard)
  }
}

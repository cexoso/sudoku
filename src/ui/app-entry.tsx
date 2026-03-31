import Board from './sudoku-board'
import NumberPad from './number-pad'
import WinDialog from './win-dialog'
import { usePlay, useGameState, useIsStarted } from '@/core/game'
import { useEffect } from 'react'

const difficulties = ['简单', '中等', '困难'] as const

export default function App() {
  const play = usePlay()
  const { completed } = useGameState()
  const isStarted = useIsStarted()

  useEffect(() => {
    if (!isStarted) {
      play()
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 tracking-widest">数独</h1>

      <div className="flex gap-2 mb-6">
        {difficulties.map((d) => (
          <button
            key={d}
            className="px-4 py-1.5 rounded-full border-2 border-gray-300 text-sm font-medium text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
          >
            {d}
          </button>
        ))}
      </div>

      <Board />

      <NumberPad />

      <div className="mt-6">
        <button
          onClick={() => play()}
          className="px-8 py-2.5 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 active:bg-blue-700 transition-colors shadow-sm"
        >
          新游戏
        </button>
      </div>

      {completed && <WinDialog />}
    </div>
  )
}

import Board from './sudoku-board'
import NumberPad from './number-pad'
import WinDialog from './win-dialog'
import { usePlay, useGameState, useIsStarted, useInitialCount, difficulties } from '@/core/game'
import { useEffect } from 'react'

export default function App() {
  const play = usePlay()
  const { completed } = useGameState()
  const isStarted = useIsStarted()
  const [count, setCount] = useInitialCount()

  useEffect(() => {
    if (!isStarted) {
      play()
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4">
      <div className="flex gap-2 mb-6">
        {difficulties.map((d) => (
          <button
            onClick={() => {
              setCount(d.value)
              play()
            }}
            key={d.value}
            style={{
              backgroundColor: count === d.value ? '#2b7fff' : undefined,
              color: count === d.value ? '#fff' : undefined,
            }}
            className="px-4 py-1.5 rounded-full border-2 border-gray-300 text-sm font-medium text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
          >
            {d.label}
          </button>
        ))}
      </div>

      <Board />

      <NumberPad />

      {completed && <WinDialog />}
    </div>
  )
}

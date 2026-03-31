import { useBoard, useSelectedIndex, useAnswers, useGameState } from '@/core/game'

export default function Board() {
  const [board] = useBoard()
  const [answers] = useAnswers()
  const [selectedIndex, setSelectedIndex] = useSelectedIndex()
  const { conflicts } = useGameState()

  return (
    <div
      role="grid"
      aria-label="数独棋盘"
      className="grid grid-cols-9 border-2 border-gray-800 w-fit mx-auto"
    >
      {board.map((puzzleValue, index) => {
        const row = Math.floor(index / 9)
        const col = index % 9
        const borderRight =
          (col + 1) % 3 === 0 && col !== 8
            ? 'border-r-2 border-r-gray-800'
            : 'border-r border-r-gray-300'
        const borderBottom =
          (row + 1) % 3 === 0 && row !== 8
            ? 'border-b-2 border-b-gray-800'
            : 'border-b border-b-gray-300'

        const isSelected = selectedIndex === index
        const isConflict = conflicts.has(index)
        const isFixed = puzzleValue !== null
        const displayValue = puzzleValue ?? answers[index]

        let bgClass = 'hover:bg-blue-50'
        if (isConflict) bgClass = 'bg-red-100'
        else if (isSelected) bgClass = 'bg-blue-200'

        let textClass = 'text-gray-800'
        if (!isFixed && displayValue !== null) textClass = 'text-blue-600'

        return (
          <div
            key={index}
            role="gridcell"
            aria-invalid={isConflict ? 'true' : undefined}
            onClick={() => !isFixed && setSelectedIndex(index)}
            className={`w-12 h-12 flex items-center justify-center text-lg font-medium cursor-pointer ${bgClass} ${textClass} ${borderRight} ${borderBottom}`}
          >
            {displayValue ?? ''}
          </div>
        )
      })}
    </div>
  )
}

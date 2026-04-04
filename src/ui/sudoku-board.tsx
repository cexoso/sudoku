import { useBoard, useSelectedIndex, useAnswers, useGameState } from '@/core/game'

export default function Board() {
  const [board] = useBoard()
  const [answers] = useAnswers()
  const [selectedIndex, setSelectedIndex] = useSelectedIndex()
  const { conflicts } = useGameState()

  return (
    <div className="w-full px-2 mt-2 flex justify-center">
      {/* 外层容器：控制整体大小 + 正确9宫格 */}
      <div
        role="grid"
        aria-label="数独棋盘"
        className="grid grid-cols-9 border-2 border-gray-800 bg-white"
        style={{
          // 基础大小 + 小屏自动缩
          width: 'min(90vw, 360px)',
          aspectRatio: '1 / 1',
        }}
      >
        {board.map((puzzleValue, index) => {
          const row = Math.floor(index / 9)
          const col = index % 9

          // 正确3×3粗线（只在宫边界加粗）
          const isRightBold = (col + 1) % 3 === 0 && col < 8
          const isBottomBold = (row + 1) % 3 === 0 && row < 8

          const isSelected = selectedIndex === index
          const isConflict = conflicts.has(index)
          const isFixed = puzzleValue !== null
          const displayValue = puzzleValue ?? answers[index]

          // 背景
          let bgClass = 'hover:bg-blue-50'
          if (isConflict) bgClass = 'bg-red-100'
          else if (isSelected) bgClass = 'bg-blue-200'

          // 文字颜色：题目黑色 / 填写蓝色
          let textClass = 'text-gray-800 font-semibold'
          if (!isFixed && displayValue != null) textClass = 'text-blue-600'

          return (
            <div
              key={index}
              role="gridcell"
              aria-invalid={isConflict}
              onClick={() => !isFixed && setSelectedIndex(index)}
              className={`
                flex items-center justify-center
                text-[clamp(1rem,4vw,1.25rem)]
                cursor-pointer select-none
                ${bgClass} ${textClass}
                ${isRightBold ? 'border-r-2 border-r-gray-800' : 'border-r border-r-gray-300'}
                ${isBottomBold ? 'border-b-2 border-b-gray-800' : 'border-b border-b-gray-300'}
              `}
            >
              {displayValue ?? ''}
            </div>
          )
        })}
      </div>
    </div>
  )
}

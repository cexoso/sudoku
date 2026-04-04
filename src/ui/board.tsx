import { useBoard, useSelectedIndex, useAnswers, useGameState } from '@/core/game'
import { useEffect, useState } from 'react'

export default function Board() {
  const [board] = useBoard()
  const [answers] = useAnswers()
  const [selectedIndex, setSelectedIndex] = useSelectedIndex()
  const { conflicts } = useGameState()

  // 动画状态：记录正在播放动画的格子索引
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null)

  // 监听 answers 变化 → 播放填入动画
  useEffect(() => {
    if (selectedIndex !== null) {
      setAnimatingIndex(selectedIndex)
      // 动画结束后重置
      setTimeout(() => setAnimatingIndex(null), 600)
    }
  }, [answers, selectedIndex])

  return (
    <div className="w-full px-2 mt-2 flex justify-center">
      <div
        role="grid"
        aria-label="数独棋盘"
        className="grid grid-cols-9 border-2 border-gray-800 bg-white"
        style={{
          width: 'min(90vw, 360px)',
          aspectRatio: '1 / 1',
        }}
      >
        {board.map((puzzleValue, index) => {
          const row = Math.floor(index / 9)
          const col = index % 9

          const isRightBold = (col + 1) % 3 === 0 && col < 8
          const isBottomBold = (row + 1) % 3 === 0 && row < 8

          const isSelected = selectedIndex === index
          const isConflict = conflicts.has(index)
          const isFixed = puzzleValue !== null
          const displayValue = puzzleValue ?? answers[index]

          // 是否正在播放填入动画
          const isAnimating = animatingIndex === index && displayValue !== null

          // 背景
          let bgClass = 'hover:bg-blue-50'
          if (isConflict) bgClass = 'bg-red-100'
          else if (isSelected) bgClass = 'bg-blue-200'

          // 文字颜色
          let textClass = 'text-gray-800 font-semibold'
          if (!isFixed && displayValue != null) textClass = 'text-blue-600'
          function handleClick() {
            !isFixed && setSelectedIndex(index)
          }
          return (
            <div
              key={index}
              role="gridcell"
              aria-invalid={isConflict}
              onTouchEnd={(e) => {
                e.preventDefault()
                handleClick()
              }}
              onClick={() => handleClick()}
              className={`
                w-[40px] h-[40px]
                flex items-center justify-center
                text-[clamp(1rem,4vw,1.25rem)]
                cursor-pointer select-none
                ${bgClass} ${textClass}
                ${isRightBold ? 'border-r-2 border-r-gray-800' : 'border-r border-r-gray-300'}
                ${isBottomBold ? 'border-b-2 border-b-gray-800' : 'border-b border-b-gray-300'}

                /* 填入动画核心 */
                transition-all duration-300
                ${isAnimating ? 'animate-fill-cell' : ''}
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

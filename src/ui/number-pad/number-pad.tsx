import { useFillCell } from '@/core/game'
import { play } from './audio'
const numberBar = ['', 1, 2, 3, 4, 5, 6, 7, 8, 9] as const

export default function NumberPad() {
  const fillCell = useFillCell()

  // 点击：震动 + 声音 + 填数字
  const handleTrigger = async (n: number | '') => {
    await play()
    fillCell(n)
  }

  return (
    <div className="mt-5 px-2">
      <div className="flex flex-wrap justify-center gap-2 max-w-[440px] mx-auto">
        {numberBar.map((n) => (
          <button
            key={n}
            onTouchEnd={(e) => {
              e.preventDefault() // 禁止浏览器默认行为
              handleTrigger(n)
            }}
            // 保留 click 兼容桌面端
            onClick={() => handleTrigger(n)}
            className="
              w-[40px] h-[40px]
              rounded-lg
              border-2 border-gray-300 bg-white
              text-lg font-semibold text-gray-700
              hover:bg-blue-100 hover:border-blue-400
              active:scale-95 active:bg-blue-200
              transition-all
              shadow-sm
            "
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  )
}

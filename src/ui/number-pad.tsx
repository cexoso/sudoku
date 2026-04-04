import { useFillCell } from '@/core/game'

export default function NumberPad() {
  const fillCell = useFillCell()

  return (
    <div className="mt-4 px-2">
      {/* 大屏：一行；小屏（≤375px）：分两行网格 */}
      <div
        className="
        grid grid-cols-9 gap-2 justify-center max-w-[320px] mx-auto
        [@media(max-width:375px)]:grid-cols-5
      "
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <button
            key={n}
            onClick={() => fillCell(n)}
            className="
              w-[30px] h-[34px] sm:w-12 sm:h-12
              rounded-lg border-2 border-gray-300 bg-white text-base font-semibold text-gray-700
              hover:bg-blue-100 hover:border-blue-400 active:bg-blue-200 transition-colors
            "
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  )
}

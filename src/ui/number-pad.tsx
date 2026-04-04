import { useFillCell } from '@/core/game'

export default function NumberPad() {
  const fillCell = useFillCell()

  return (
    <div className="mt-4 px-2">
      {/* 核心：大屏一行9个，小屏两行，按钮大小自适应，间距均匀 */}
      <div
        className="
        grid grid-cols-9 gap-3 justify-center
        max-w-[min(90vw, 400px)] mx-auto
        [@media(max-width:375px)]:grid-cols-5
        [@media(max-width:375px)]:gap-2
      "
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <button
            key={n}
            onClick={() => fillCell(n)}
            className="
              aspect-square w-full rounded-lg
              border-2 border-gray-300 bg-white
              text-[clamp(1rem,3vw,1.25rem)] font-semibold text-gray-700
              hover:bg-blue-100 hover:border-blue-400
              active:bg-blue-200 transition-colors
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

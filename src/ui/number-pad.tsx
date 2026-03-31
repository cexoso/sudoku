import { useFillCell } from '@/core/game'

export default function NumberPad() {
  const fillCell = useFillCell()

  return (
    <div className="flex gap-2 justify-center mt-4">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
        <button
          key={n}
          onClick={() => fillCell(n)}
          className="w-12 h-12 rounded-lg bg-white border-2 border-gray-300 text-lg font-semibold text-gray-700 hover:bg-blue-100 hover:border-blue-400 active:bg-blue-200 transition-colors"
        >
          {n}
        </button>
      ))}
    </div>
  )
}

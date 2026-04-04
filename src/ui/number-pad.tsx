import { useFillCell } from '@/core/game'

export default function NumberPad() {
  const fillCell = useFillCell()

  return (
    <div className="mt-5 px-2">
      {/* 普通 flex 流式布局：自动换行，按钮固定大小，间距均匀 */}
      <div className="flex flex-wrap justify-center gap-2 max-w-[440px] mx-auto">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <button
            key={n}
            onClick={() => fillCell(n)}
            // 固定 40*40 + 点击动画 + 美观样式
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

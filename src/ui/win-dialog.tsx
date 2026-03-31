import { usePlay } from '@/core/game'

export default function WinDialog() {
  const play = usePlay()

  return (
    <div
      role="dialog"
      aria-label="游戏完成"
      className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
    >
      <div className="bg-white rounded-2xl shadow-xl px-10 py-8 flex flex-col items-center gap-4">
        <div className="text-5xl">🎉</div>
        <h2 className="text-2xl font-bold text-gray-800">恭喜完成！</h2>
        <p className="text-gray-500">你成功解开了这道数独谜题</p>
        <button
          onClick={() => play()}
          className="mt-2 px-8 py-2.5 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 active:bg-blue-700 transition-colors shadow-sm"
        >
          再来一局
        </button>
      </div>
    </div>
  )
}

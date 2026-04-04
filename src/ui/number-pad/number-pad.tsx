import { useFillCell } from '@/core/game'
import { useEffect, useRef } from 'react'
import click from './click.mp3'

export default function NumberPad() {
  const fillCell = useFillCell()
  const clickSoundRef = useRef<HTMLAudioElement | null>(null)

  // 初始化点击音效（超短 50ms 左右）
  useEffect(() => {
    clickSoundRef.current = new Audio(click)
  }, [])

  // 点击：震动 + 声音 + 填数字
  const handleTrigger = (n: number) => {
    const result = fillCell(n)
    if (!result) {
      // 这里可以添加错误的声音
      return
    }
    // 1. 振动（Web Vibrate API，10ms 短震）
    if (navigator.vibrate) {
      navigator.vibrate(10)
    }

    // 2. 播放点击声（从头播，避免延迟）
    if (clickSoundRef.current) {
      clickSoundRef.current.currentTime = 0
      clickSoundRef.current.play().catch(() => {})
    }
  }

  return (
    <div className="mt-5 px-2">
      <div className="flex flex-wrap justify-center gap-2 max-w-[440px] mx-auto">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
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

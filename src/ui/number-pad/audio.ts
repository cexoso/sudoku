import clickAudio from './click.mp3'

// 初始化音频上下文（兼容 Safari / 所有浏览器）
let audioContext: any
let soundBuffer: any

// 预加载音频（启动就加载，保证点击时零延迟）
async function loadSound() {
  try {
    // @ts-ignore
    const AudioContext = window.AudioContext || window.webkitAudioContext
    audioContext = new AudioContext()

    // 加载并解码 MP3 → 原始音频数据（关键：低延迟核心）
    const response = await fetch(clickAudio)
    const arrayBuffer = await response.arrayBuffer()
    soundBuffer = await audioContext.decodeAudioData(arrayBuffer)
  } catch (err) {
    console.warn('音频加载失败', err)
  }
}

// 预加载！
loadSound()

// 对外暴露的 play 方法 —— 调用方式和你原来完全一样
export async function play() {
  if (!soundBuffer || !audioContext) return

  // 👇 解决 Safari 最严限制：必须用户交互时 resume
  if (audioContext.state === 'suspended') {
    await audioContext.resume()
  }

  // 👇 真正零延迟播放（直接送给声卡）
  const source = audioContext.createBufferSource()
  source.buffer = soundBuffer
  source.connect(audioContext.destination)
  source.start(0) // 立即播放
}

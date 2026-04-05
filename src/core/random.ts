import { define } from '@cexoso/react-singleton'

export const useRandomHumbleObject = define(() => ({ random: Math.random.bind(Math) }))
export const useRandom = () => useRandomHumbleObject()[0]['random']

export const useStorageHumbleObject = define(() => ({
  setItem: localStorage.setItem.bind(localStorage),
  getItem: localStorage.getItem.bind(localStorage),
}))

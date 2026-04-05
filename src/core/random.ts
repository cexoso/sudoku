import { define } from '@cexoso/react-singleton'

export const useRandomHumbleObject = define(() => ({ random: Math.random.bind(Math) }))
export const useRandom = () => useRandomHumbleObject()[0]['random']

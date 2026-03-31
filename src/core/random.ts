import { define } from '@cexoso/react-singleton'

// humble object, do not use in production, use 'useRandom' instead
export const useRandomHumbleObject = define(() => ({ random: Math.random.bind(Math) }))
export const useRandom = () => useRandomHumbleObject()[0]['random']

// export const useRandom = () => {
//   const [impl, setImpl] = useRandomImpl()
//   return [impl.fn, (fn: () => number) => setImpl({ fn })] as const
// }

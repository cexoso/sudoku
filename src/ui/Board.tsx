export default function Board() {
  const cells = Array.from({ length: 81 })

  return (
    <div
      role="grid"
      aria-label="数独棋盘"
      className="grid grid-cols-9 border-2 border-gray-800 w-fit mx-auto"
    >
      {cells.map((_, index) => {
        const row = Math.floor(index / 9)
        const col = index % 9
        const borderRight = (col + 1) % 3 === 0 && col !== 8 ? 'border-r-2 border-r-gray-800' : 'border-r border-r-gray-300'
        const borderBottom = (row + 1) % 3 === 0 && row !== 8 ? 'border-b-2 border-b-gray-800' : 'border-b border-b-gray-300'
        return (
          <div
            key={index}
            role="gridcell"
            className={`w-12 h-12 flex items-center justify-center text-lg font-medium cursor-pointer hover:bg-blue-50 ${borderRight} ${borderBottom}`}
          />
        )
      })}
    </div>
  )
}

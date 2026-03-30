export default function Board() {
  const cells = Array.from({ length: 81 })

  return (
    <div role="grid" aria-label="数独棋盘">
      {cells.map((_, index) => (
        <div key={index} role="gridcell" />
      ))}
    </div>
  )
}

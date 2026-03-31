import { describe, it, expect } from 'vitest'
import { render } from '../test/render'
import { screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { useRandomHumbleObject } from '@/core/random'
import { getOrCreateStub } from '@cexoso/test-utils'

function mockRandom(value: number) {
  return () => {
    const random = getOrCreateStub(useRandomHumbleObject()[0], 'random')
    random.returns(value)
  }
}

describe('新游戏', () => {
  it('点击新游戏后，棋盘应该出现初始数字', async () => {
    render(undefined, { init: mockRandom(0.5) })

    await userEvent.click(screen.getByRole('button', { name: '新游戏' }))

    const cells = screen.getAllByRole('gridcell')
    const filledCells = cells.filter((cell) => cell.textContent !== '')
    expect(filledCells.length).toBeGreaterThan(0)
    filledCells.forEach((cell) => {
      const num = Number(cell.textContent)
      expect(num).toBeGreaterThanOrEqual(1)
      expect(num).toBeLessThanOrEqual(9)
    })
  })

  it('不同随机种子产生不同的棋盘', async () => {
    render(undefined, { init: mockRandom(0.1) })
    await userEvent.click(screen.getByRole('button', { name: '新游戏' }))
    const cells1 = screen.getAllByRole('gridcell').map((c) => c.textContent)

    render(undefined, { init: mockRandom(0.9) })
    await userEvent.click(screen.getByRole('button', { name: '新游戏' }))
    const cells2 = screen.getAllByRole('gridcell').map((c) => c.textContent)

    expect(cells1).not.toEqual(cells2)
  })
})

import { describe, it, expect } from 'vitest'
import { render } from '../test/render'
import { screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { useRandomHumbleObject, useStorageHumbleObject } from '@/core/random'
import { getOrCreateStub } from '@cexoso/test-utils'
import { useSetBoard } from '@/core/state'

// 一个合法的完整数独棋盘
// prettier-ignore
const FULL_BOARD = [
  5,3,4, 6,7,8, 9,1,2,
  6,7,2, 1,9,5, 3,4,8,
  1,9,8, 3,4,2, 5,6,7,

  8,5,9, 7,6,1, 4,2,3,
  4,2,6, 8,5,3, 7,9,1,
  7,1,3, 9,2,4, 8,5,6,

  9,6,1, 5,3,7, 2,8,4,
  2,8,7, 4,1,9, 6,3,5,
  3,4,5, 2,8,6, 1,7,9,
]

// 只挖掉最后一格（索引 80，值为 9）
const ALMOST_COMPLETE = FULL_BOARD.map((v, i) => (i === 80 ? null : v)) as (number | null)[]

function loadFixedBoard() {
  const setBoard = useSetBoard()
  setBoard(ALMOST_COMPLETE)
}

function mockRandom(value: number) {
  return () => {
    const random = getOrCreateStub(useRandomHumbleObject()[0], 'random')
    random.returns(value)
  }
}

describe('游戏交互', () => {
  // 使用固定随机值 0，开局后 givens=30 会留下空格
  // 通过 useBoard 直接设置棋盘状态来构造确定性测试场景

  describe('冲突检测', () => {
    it('用户填入与同行数字相同的数字时，冲突的格子应显示为无效', async () => {
      // 使用硬编码棋盘：只有最后一格（索引80）为空
      // 第 9 行已有数字：3,4,5,2,8,6,1,7，填入 3（同行冲突）
      render(undefined, { init: loadFixedBoard })

      const cells = screen.getAllByRole('gridcell')
      // 点击最后一格选中
      await userEvent.click(cells[80])
      // 填入 3，与同行索引 72 的 3 冲突
      await userEvent.click(screen.getByRole('button', { name: '3' }))

      const invalidCells = screen
        .getAllByRole('gridcell')
        .filter((c) => c.getAttribute('aria-invalid') === 'true')
      expect(invalidCells.length).toBeGreaterThan(0)
    })
  })

  describe('胜利判定', () => {
    it('填满所有空格且没有冲突时，应该显示游戏完成提示', async () => {
      // 使用硬编码棋盘：只有最后一格（索引80）为空，正确答案是 9
      render(undefined, { init: loadFixedBoard })

      const cells = screen.getAllByRole('gridcell')
      // 点击最后一格选中
      await userEvent.click(cells[80])
      // 填入正确答案 9
      await userEvent.click(screen.getByRole('button', { name: '9' }))

      expect(screen.getByRole('dialog', { name: '游戏完成' })).toBeDefined()
    })
  })
})

describe('新游戏', () => {
  it('点击新游戏后，棋盘应该出现初始数字', async () => {
    render(undefined, { init: mockRandom(0.5) })

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
    const init = (key: number) => {
      const storage = useStorageHumbleObject()[0]
      getOrCreateStub(storage, 'getItem').resolves(null)
      getOrCreateStub(storage, 'setItem')
      mockRandom(key)()
    }
    render(undefined, {
      init: () => init(0.1),
    })
    const cells1 = screen.getAllByRole('gridcell').map((c) => c.textContent)

    render(undefined, {
      init: () => init(0.9),
    })
    const cells2 = screen.getAllByRole('gridcell').map((c) => c.textContent)

    expect(cells1).not.toEqual(cells2)
  })

  it.todo('应该有一个用例来描述持久化，打开页面前总是尝试恢复上一局游戏', async () => {})
})

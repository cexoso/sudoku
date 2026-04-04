import { describe, it, expect } from 'vitest'
import { render } from '../test/render'
import { screen } from '@testing-library/react'

describe('数独游戏', () => {
  describe('初始化界面', () => {
    it('应该显示 9x9 的数独棋盘', () => {
      render()
      const board = screen.getByRole('grid', { name: '数独棋盘' })
      expect(board).toBeDefined()
    })

    it('棋盘应该有 81 个格子', () => {
      render()
      const cells = screen.getAllByRole('gridcell')
      expect(cells).toHaveLength(81)
    })

    it('应该显示数字输入面板', () => {
      render()
      for (let i = 1; i <= 9; i++) {
        expect(screen.getByRole('button', { name: String(i) })).toBeDefined()
      }
    })

    it('应该显示难度选择按钮', () => {
      render()
      expect(screen.getByRole('button', { name: '简单' })).toBeDefined()
      expect(screen.getByRole('button', { name: '普通' })).toBeDefined()
      expect(screen.getByRole('button', { name: '困难' })).toBeDefined()
    })

    it('页面加载后棋盘应该自动开始一局，显示初始数字', () => {
      render()
      const cells = screen.getAllByRole('gridcell')
      const filledCells = cells.filter((cell) => cell.textContent !== '')
      expect(filledCells.length).toBeGreaterThan(0)
    })
  })
})

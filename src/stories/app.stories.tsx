import type { Meta, StoryObj } from '@storybook/react-vite'

import { expect, userEvent, within } from 'storybook/test'

import { Story } from '@storybook/addon-docs/blocks'

import { App } from '../app'

const meta = {
  title: 'sudoku/APP',
  component: App,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof App>

export default meta
type Story = StoryObj<typeof meta>

export const case1: Story = {}
export const normal: Story = {
  parameters: {},
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: /简单/i })
    await expect(button).toBeInTheDocument()
    await userEvent.click(button)
  },
}

import type { Meta, StoryObj } from '@storybook/react'
import { DifficultyPicker } from './DifficultyPicker'

const meta: Meta<typeof DifficultyPicker> = {
  component: DifficultyPicker,
  title: 'DifficultyPicker',
}
export default meta

type Story = StoryObj<typeof DifficultyPicker>

export const Default: Story = {
  args: {
    value: 4,
    onChange: () => {},
  },
}

export const ThreeOptions: Story = {
  args: { value: 3, onChange: () => {} },
}

export const SixOptions: Story = {
  args: { value: 6, onChange: () => {} },
}

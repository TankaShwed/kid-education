import type { DifficultyLevel } from '@/domain/types'

const OPTIONS: { value: DifficultyLevel; label: string }[] = [
  { value: 3, label: '3 варианта' },
  { value: 4, label: '4 варианта' },
  { value: 5, label: '5 вариантов' },
  { value: 6, label: '6 вариантов' },
]

interface DifficultyPickerProps {
  value: DifficultyLevel
  onChange: (value: DifficultyLevel) => void
}

export function DifficultyPicker({ value, onChange }: DifficultyPickerProps) {
  return (
    <div className="difficulty-picker" role="group" aria-label="Сложность">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={opt.value === value ? 'active' : ''}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

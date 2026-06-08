import { useEffect, useMemo, useRef, useState } from 'react'
import './DatePicker.scss'

interface DatePickerProps {
  value: string
  placeholder?: string
  onChange: (value: string) => void
  id?: string
}

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const

function toIsoDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function parseIsoDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) {
    return null
  }

  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
  return Number.isNaN(date.getTime()) ? null : date
}

function formatDisplayDate(value: string) {
  const date = parseIsoDate(value)
  if (!date) {
    return ''
  }

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M5.333 1.333v2.334M10.667 1.333v2.334M2.667 6h10.666"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M3.333 2.667h9.334c.736 0 1.333.597 1.333 1.333v10c0 .736-.597 1.333-1.333 1.333H3.333A1.333 1.333 0 0 1 2 14V4c0-.736.597-1.333 1.333-1.333Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M5.333 8.667h.007M8 8.667h.007M10.667 8.667h.006M5.333 11.333h.007M8 11.333h.007M10.667 11.333h.006"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function DatePicker({
  value,
  placeholder = 'Date',
  onChange,
  id,
}: DatePickerProps) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const selectedDate = parseIsoDate(value)
  const [isOpen, setIsOpen] = useState(false)
  const [viewDate, setViewDate] = useState(() => selectedDate ?? new Date())

  useEffect(() => {
    if (selectedDate) {
      setViewDate(selectedDate)
    }
  }, [value])

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const monthLabel = viewDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear()
    const month = viewDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const startOffset = (firstDay.getDay() + 6) % 7
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const cells: Array<{ iso: string; day: number; inMonth: boolean } | null> =
      []

    for (let i = 0; i < startOffset; i += 1) {
      cells.push(null)
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push({
        iso: toIsoDate(new Date(year, month, day)),
        day,
        inMonth: true,
      })
    }

    return cells
  }, [viewDate])

  const handleSelect = (iso: string) => {
    onChange(iso)
    setIsOpen(false)
  }

  const shiftMonth = (offset: number) => {
    setViewDate(
      (current) => new Date(current.getFullYear(), current.getMonth() + offset, 1),
    )
  }

  return (
    <div className="date-picker" ref={rootRef}>
      <div className="date-picker__input-wrap">
        <input
          id={id}
          type="text"
          readOnly
          value={formatDisplayDate(value)}
          placeholder={placeholder}
          className="date-picker__input"
          onClick={() => setIsOpen((open) => !open)}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
        />
        <button
          type="button"
          className="date-picker__toggle"
          aria-label="Toggle calendar"
          onClick={() => setIsOpen((open) => !open)}
        >
          <CalendarIcon />
        </button>
      </div>

      {isOpen && (
        <div className="date-picker__calendar" role="dialog" aria-label="Choose date">
          <div className="date-picker__calendar-header">
            <span className="date-picker__month">{monthLabel}</span>
            <div className="date-picker__nav">
              <button
                type="button"
                className="date-picker__nav-btn"
                aria-label="Previous month"
                onClick={() => shiftMonth(-1)}
              >
                ▲
              </button>
              <button
                type="button"
                className="date-picker__nav-btn"
                aria-label="Next month"
                onClick={() => shiftMonth(1)}
              >
                ▼
              </button>
            </div>
          </div>

          <div className="date-picker__weekdays">
            {WEEKDAYS.map((day, index) => (
              <span key={`${day}-${index}`} className="date-picker__weekday">
                {day}
              </span>
            ))}
          </div>

          <div className="date-picker__days">
            {calendarDays.map((cell, index) =>
              cell ? (
                <button
                  key={cell.iso}
                  type="button"
                  className={`date-picker__day ${
                    cell.iso === value ? 'date-picker__day--selected' : ''
                  }`}
                  onClick={() => handleSelect(cell.iso)}
                >
                  {cell.day}
                </button>
              ) : (
                <span key={`empty-${index}`} className="date-picker__day-spacer" />
              ),
            )}
          </div>

          <div className="date-picker__footer">
            <button
              type="button"
              className="date-picker__footer-btn"
              onClick={() => {
                onChange('')
                setIsOpen(false)
              }}
            >
              Clear
            </button>
            <button
              type="button"
              className="date-picker__footer-btn"
              onClick={() => handleSelect(toIsoDate(new Date()))}
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

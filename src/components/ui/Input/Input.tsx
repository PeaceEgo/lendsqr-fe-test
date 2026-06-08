import type { InputHTMLAttributes, ReactNode } from 'react'
import './Input.scss'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  endAdornment?: ReactNode
  wrapperClassName?: string
}

export function Input({
  label,
  error,
  endAdornment,
  wrapperClassName = '',
  className = '',
  id,
  'aria-describedby': ariaDescribedBy,
  ...props
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  const errorId = error ? `${inputId}-error` : undefined

  return (
    <div className="input">
      {label && (
        <label className="input__label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <div className={`input__wrapper ${wrapperClassName}`.trim()}>
        <input
          id={inputId}
          className={`input__field ${endAdornment ? 'input__field--with-adornment' : ''} ${error ? 'input__field--error' : ''} ${className}`.trim()}
          aria-invalid={error ? true : undefined}
          aria-describedby={[ariaDescribedBy, errorId].filter(Boolean).join(' ') || undefined}
          {...props}
        />
        {endAdornment && (
          <span className="input__adornment">{endAdornment}</span>
        )}
      </div>
      {error && (
        <p id={errorId} className="input__error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

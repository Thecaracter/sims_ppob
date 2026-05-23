import { useState, memo, forwardRef } from 'react'
import { MdOutlineVisibility, MdOutlineVisibilityOff } from 'react-icons/md'
import type React from 'react'

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

const InputFieldComponent = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, icon, type = 'text', className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const isPasswordField = type === 'password'
    const inputType = isPasswordField && showPassword ? 'text' : type

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword)
    }

    const inputClassName = [
      error ? 'input-error' : '',
      className || ''
    ].filter(Boolean).join(' ')

    return (
      <div className="input-group">
        {label && <label htmlFor={props.id}>{label}</label>}
        <div className="input-wrapper">
          {icon && <span className="input-icon">{icon}</span>}
          <input
            ref={ref}
            type={inputType}
            className={inputClassName}
            {...props}
          />
          {isPasswordField && (
            <span
              role="button"
              tabIndex={0}
              className="password-toggle"
              onClick={togglePasswordVisibility}
              onKeyDown={(e) => e.key === 'Enter' && togglePasswordVisibility()}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <MdOutlineVisibilityOff /> : <MdOutlineVisibility />}
            </span>
          )}
        </div>
        {error && <span className="error-message">{error}</span>}
      </div>
    )
  }
)

InputFieldComponent.displayName = 'InputField'

export const InputField = memo(InputFieldComponent) as typeof InputFieldComponent

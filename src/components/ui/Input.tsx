import { forwardRef, InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  required?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  required,
  className = '',
  ...props
}, ref) => {
  const baseClasses = 'w-full px-4 py-3 border rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#3182ce] focus:border-transparent'
  const errorClasses = error ? 'border-[#e53e3e] focus:ring-[#e53e3e]' : 'border-gray-300'
  
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-[#1a202c]">
          {label}
          {required && <span className="text-[#e53e3e] ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        className={`${baseClasses} ${errorClasses} ${className}`}
        {...props}
      />
      {error && (
        <p className="text-sm text-[#e53e3e]">{error}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
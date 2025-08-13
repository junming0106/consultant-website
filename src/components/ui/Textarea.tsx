import { forwardRef, TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  required?: boolean
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  required,
  className = '',
  ...props
}, ref) => {
  const baseClasses = 'w-full px-4 py-3 border rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#3182ce] focus:border-transparent resize-vertical min-h-[120px]'
  const errorClasses = error ? 'border-[#e53e3e] focus:ring-[#e53e3e]' : 'border-gray-300'
  
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-[#1a202c]">
          {label}
          {required && <span className="text-[#e53e3e] ml-1">*</span>}
        </label>
      )}
      <textarea
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

Textarea.displayName = 'Textarea'

export default Textarea
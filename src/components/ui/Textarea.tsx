import { forwardRef, TextareaHTMLAttributes } from 'react'
import styles from './Textarea.module.css'

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
  const textareaClass = `${styles.textarea} ${error ? styles.textareaError : ''} text-gray-900 ${className}`
  
  return (
    <div className={styles.container}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        className={textareaClass}
        {...props}
      />
      {error && (
        <p className={styles.error}>{error}</p>
      )}
    </div>
  )
})

Textarea.displayName = 'Textarea'

export default Textarea
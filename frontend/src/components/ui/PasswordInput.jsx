import { useState } from 'react'
import Icon from './Icon'

export default function PasswordInput({
  value,
  onChange,
  placeholder,
  autoComplete,
  required,
  minLength,
  maxLength,
  ...rest
}) {
  const [show, setShow] = useState(false)

  return (
    <div style={{ position: 'relative' }}>
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        style={{ paddingRight: 44 }}
        {...rest}
      />
      <button
        type="button"
        onClick={() => setShow(s => !s)}
        aria-label={show ? 'Ocultar contrasena' : 'Mostrar contrasena'}
        aria-pressed={show}
        title={show ? 'Ocultar contrasena' : 'Mostrar contrasena'}
        style={{
          position: 'absolute',
          right: 6,
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 6,
          borderRadius: 'var(--radius-sm)',
          color: 'var(--text-muted)'
        }}
      >
        <Icon name={show ? 'eyeOff' : 'eye'} size={18} />
      </button>
    </div>
  )
}

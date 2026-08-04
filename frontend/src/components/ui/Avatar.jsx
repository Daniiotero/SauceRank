export default function Avatar({ username, size = 40, style, className }) {
  const initial = username ? username.charAt(0).toUpperCase() : '?'
  return (
    <div
      className={`avatar${className ? ` ${className}` : ''}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.42), ...style }}
      aria-hidden="true"
    >
      {initial}
    </div>
  )
}

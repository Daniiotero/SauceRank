import { Link } from 'react-router-dom'
import Icon from './Icon'

function BaseButton({ to, className, disabled, children, ...rest }) {
  if (to) {
    return (
      <Link to={to} className={className} {...rest}>
        {children}
      </Link>
    )
  }
  return (
    <button type="button" className={className} disabled={disabled} {...rest}>
      {children}
    </button>
  )
}

function makeVariant(baseClass) {
  return function Variant({ to, size = 'md', icon, iconSize, children, className = '', ...rest }) {
    const classes = [baseClass, size !== 'md' && `btn-${size}`, className].filter(Boolean).join(' ')
    return (
      <BaseButton to={to} className={classes} {...rest}>
        {icon && <Icon name={icon} size={iconSize || 14} />}
        {children}
      </BaseButton>
    )
  }
}

export const PrimaryButton = makeVariant('btn btn-primary')
export const SecondaryButton = makeVariant('btn btn-secondary')
export const GhostButton = makeVariant('btn btn-ghost')
export const DangerButton = makeVariant('btn btn-danger')

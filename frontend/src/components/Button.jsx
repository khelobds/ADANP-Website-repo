import './Button.css';

function Button({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  onClick,
  type = 'button',
  href,
  disabled = false,
  className = ''
}) {
  const buttonClasses = `btn btn-${variant} btn-${size} ${className}`.trim();

  if (href) {
    return (
      <a href={href} className={buttonClasses}>
        {children}
      </a>
    );
  }

  return (
    <button 
      type={type} 
      className={buttonClasses}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;

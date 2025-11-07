import './Input.scss';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className = '',
  ...props
}) => {
  return (
    <div className={`input-wrapper ${className}`}>
      {label && <label className="input-label">{label}</label>}
      <div className="input-container">
        {icon && <span className="input-icon">{icon}</span>}
        <input
          className={`input ${error ? 'input--error' : ''} ${icon ? 'input--with-icon' : ''}`}
          {...props}
        />
      </div>
      {error && <span className="input-error">{error}</span>}
    </div>
  );
};

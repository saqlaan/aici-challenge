import React from 'react';

interface InputProps {
  label: string;
  type: string;
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  type,
  id,
  name,
  value,
  onChange,
  required = false,
  placeholder,
  className = "input-field",
}) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={className}
        required={required}
        placeholder={placeholder}
      />
    </div>
  );
};

export default Input;

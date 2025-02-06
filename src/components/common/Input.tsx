interface Input {
  type: string;
  name?: string;
  value: string;
  placeholder?: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
  maxLength?: number;
}

export default function Input({
  type = 'text',
  name = 'name',
  value,
  placeholder = value,
  handleInputChange,
  handleBlur = () => {},
  className = '',
  maxLength,
}: Input) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!maxLength || e.target.value.length <= maxLength) {
      handleInputChange(e);
    }
  };

  return (
    <input
      type={type}
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={handleChange}
      onBlur={handleBlur}
      className={`w-full rounded-[10px] px-5 py-6 text-[1rem] outline outline-1 outline-dark-400 bg-dark-300 focus:outline-1 placeholder:text-dark-700 focus:outline-[#FF7487] ${className}`}
    />
  );
}

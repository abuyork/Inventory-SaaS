interface CheckboxProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function Checkbox({
  checked = false,
  onCheckedChange,
  disabled = false,
  className = '',
}: CheckboxProps) {
  return (
    <div className="relative">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        disabled={disabled}
        className={`
          h-4 w-4 rounded border border-gray-300
          text-blue-600 focus:ring-blue-500
          disabled:cursor-not-allowed disabled:opacity-50
          ${className}
        `}
      />
    </div>
  );
} 
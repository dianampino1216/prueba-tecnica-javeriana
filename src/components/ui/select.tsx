import { type SelectHTMLAttributes, forwardRef } from 'react';
import { ChevronDownIcon } from '../../assets/icons';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Option[];
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, className = '', id, ...props }, ref) => {
    const selectId = id || label.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={`flex flex-col gap-1.5 ${className}`}>
        <label htmlFor={selectId} className="text-sm font-medium text-muted-foreground">
          {label}
        </label>

        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={`
                appearance-none w-full pl-4 pr-10 py-2.5 bg-background border border-border rounded-lg text-foreground cursor-pointer
                focus:outline-none focus:ring-1 focus:ring-ring focus:border-primary 
                transition-all shadow-sm
                ${error ? 'border-red-500' : 'hover:border-primary/50'}
                ${className}
            `}
            {...props}
          >
            <option value="" disabled>Selecciona una opción</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground">
            <ChevronDownIcon className="w-5 h-5" />
          </div>
        </div>

        {error && <span className="text-xs text-red-500 font-medium mt-1">{error}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';
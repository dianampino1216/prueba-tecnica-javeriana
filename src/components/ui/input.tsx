import { type InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className = '', id, ...props }, ref) => {
        const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

        return (
            <div className={`flex flex-col gap-1.5 ${className}`}>
                <label htmlFor={inputId} className="text-sm font-medium text-muted-foreground">
                    {label}
                </label>
                <input
                    id={inputId}
                    ref={ref}
                    className={`
                        w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground
                        focus:outline-none focus:ring-1 focus:ring-ring focus:border-primary 
                        transition-all shadow-sm
                        ${error ? 'border-red-500' : 'hover:border-primary/50'}
                        ${className}
                    `}
                    {...props}
                />
                {error && <span className="text-xs text-red-500 font-medium mt-1">{error}</span>}
            </div>
        );
    }
);

Input.displayName = 'Input';
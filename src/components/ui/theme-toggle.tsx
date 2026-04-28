import { useUI } from '../../hooks/use-ui';
import { SunIcon, MoonIcon } from '../../assets/icons';

export const ThemeToggle = () => {
    const { theme, toggleTheme } = useUI();

    return (
        <button
            onClick={toggleTheme}
            className="fixed bottom-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full 
             bg-card/80 backdrop-blur-md border border-border
             shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 group"
            aria-label="Cambiar modo"
        >
            <div className="relative h-4 w-4">
                <SunIcon className={`absolute inset-0 transform transition-all duration-500 ${theme === 'dark' ? 'rotate-0 opacity-100' : 'rotate-90 opacity-0'} text-puj-gold`} />
                <MoonIcon className={`absolute inset-0 transform transition-all duration-500 ${theme === 'light' ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'} text-puj-blue`} />
            </div>
        </button>
    );
};
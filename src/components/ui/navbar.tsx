import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import logoJaveriana from "../../assets/logo-javeriana.png";
import { ChevronDownIcon } from '../../assets/icons';
import { facultades } from '../../constants';

interface NavbarProps {
    isSecondMenu?: boolean;
}

export const Navbar = ({ isSecondMenu = false }: NavbarProps) => {
    const navigate = useNavigate();
    const location = useLocation(); 
    const [isFacultadesOpen, setIsFacultadesOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const isAspiranteActive = 
        location.pathname === '/' || 
        location.pathname.startsWith('/programas') || 
        location.pathname.startsWith('/programa/');

    const isAdminActive = location.pathname.startsWith('/admin');

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsFacultadesOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const activeClass = "text-puj-gold border-b-2 border-puj-gold pb-1";
    const inactiveClass = "text-white/80 hover:text-puj-gold transition-colors";

    return (
        <div className="w-full sticky top-0 z-50 flex flex-col">
            <header className="bg-puj-blue shadow-xl w-full mb-3">
                <div className="w-full max-w-360 mx-auto px-6 h-20 flex justify-between items-center">
                    <div className="bg-white p-3 rounded-b-lg shadow-md transform -translate-y-1 hover:translate-y-0 transition-transform duration-300">
                        <Link to="/">
                            <img src={logoJaveriana} alt="Javeriana Logo" className="h-16 w-60 object-contain" />
                        </Link>
                    </div>

                    <nav className="flex gap-8 items-center">
                        <Link 
                            to="/" 
                            className={`font-bold uppercase text-sm tracking-widest ${isAspiranteActive ? activeClass : inactiveClass}`}
                        >
                            Aspirante
                        </Link>
                        
                        <span className="text-white/30">|</span>
                        
                        <Link 
                            to="/admin" 
                            className={`font-bold uppercase text-sm tracking-widest ${isAdminActive ? activeClass : inactiveClass}`}
                        >
                            Administrativo
                        </Link>
                    </nav>
                </div>
            </header>

            {isSecondMenu && isAspiranteActive && (
                <nav className="bg-muted border-b border-border w-full relative z-40 shadow-sm">
                    <div className="w-full mx-auto px-6 h-14 flex items-center justify-center gap-6">
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsFacultadesOpen(!isFacultadesOpen)}
                                className={`flex items-center gap-2 text-base font-bold transition-colors ${isFacultadesOpen ? 'text-puj-gold' : 'text-primary hover:text-puj-gold'}`}
                            >
                                Facultades
                                <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isFacultadesOpen ? '-rotate-180' : 'rotate-0'}`} />
                            </button>

                            {isFacultadesOpen && (
                                <div className="absolute top-full left-0 mt-4 w-72 bg-card shadow-2xl border border-border rounded-b-xl py-3 z-50">
                                    {facultades.map((facu) => (
                                        <button
                                            key={facu}
                                            className="w-full text-left px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-muted hover:text-puj-gold hover:pl-6 transition-all"
                                            onClick={() => {
                                                setIsFacultadesOpen(false);
                                                navigate(`/programas?facultad=${encodeURIComponent('Facultad de ' + facu)}`);
                                            }}
                                        >
                                            {facu}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <span className="text-primary font-black text-lg">|</span>
                        <Link to="/programas?tipo=Pregrado" className="text-base font-bold text-primary hover:text-puj-gold transition-colors">Pregrado</Link>

                        <span className="text-primary font-black text-lg">|</span>
                        <Link to="/programas?tipo=Posgrado" className="text-base font-bold text-primary hover:text-puj-gold transition-colors">Posgrados</Link>

                        <span className="text-primary font-black text-lg">|</span>
                        <Link to="/programas?tipo=Educación+Continua" className="text-base font-bold text-primary hover:text-puj-gold transition-colors">Educación continua</Link>
                    </div>
                </nav>
            )}
        </div >
    );
};
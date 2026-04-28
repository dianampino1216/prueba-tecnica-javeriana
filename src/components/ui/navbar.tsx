import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import logoJaveriana from "../../assets/logo-javeriana.png";
import { ChevronDownIcon, CloseIcon } from '../../assets/icons';
import { facultades } from '../../constants';

interface NavbarProps {
    isSecondMenu?: boolean;
}

export const Navbar = ({ isSecondMenu = false }: NavbarProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isFacultadesOpen, setIsFacultadesOpen] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isMobileFacultadesOpen, setIsMobileFacultadesOpen] = useState(false);
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

    const closeMenu = () => {
        setIsMobileOpen(false);
        setIsMobileFacultadesOpen(false);
    };

    const activeClass = "text-puj-gold border-b-2 border-puj-gold pb-1";
    const inactiveClass = "text-white/80 hover:text-white transition-colors";

    return (
        <div className="w-full sticky top-0 z-50 flex flex-col">
            <header className="bg-puj-blue shadow-lg w-full">
                <div className="w-full max-w-360 mx-auto px-4 sm:px-6 h-16 md:h-20 flex justify-between items-center gap-4">

                    {/* Logo */}
                    <div className="bg-white px-2.5 py-1.5 md:px-3 md:py-2 rounded-b-lg shadow-md transform -translate-y-0.5 md:-translate-y-1 hover:translate-y-0 transition-transform duration-300 shrink-0">
                        <Link to="/" onClick={closeMenu}>
                            <img
                                src={logoJaveriana}
                                alt="Pontificia Universidad Javeriana"
                                className="h-8 sm:h-10 md:h-14 w-auto max-w-30 sm:max-w-40 md:max-w-55 object-contain"
                            />
                        </Link>
                    </div>

                    {/* Desktop nav */}
                    <nav className="hidden md:flex gap-8 items-center">
                        <Link
                            to="/"
                            className={`font-bold uppercase text-sm tracking-widest ${isAspiranteActive ? activeClass : inactiveClass}`}
                        >
                            Aspirante
                        </Link>
                        <span className="text-white/30 select-none">|</span>
                        <Link
                            to="/admin"
                            className={`font-bold uppercase text-sm tracking-widest ${isAdminActive ? activeClass : inactiveClass}`}
                        >
                            Administrativo
                        </Link>
                    </nav>

                    {/* Mobile hamburger */}
                    <button
                        className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 active:bg-white/20 transition-colors"
                        onClick={() => setIsMobileOpen(!isMobileOpen)}
                        aria-label={isMobileOpen ? "Cerrar menú" : "Abrir menú"}
                        aria-expanded={isMobileOpen}
                    >
                        {isMobileOpen ? (
                            <CloseIcon className="w-6 h-6" />
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Mobile menu */}
                {isMobileOpen && (
                    <div className="md:hidden border-t border-white/15 bg-puj-blue/95 backdrop-blur-sm">
                        <nav className="px-3 py-3 space-y-0.5">
                            <Link
                                to="/"
                                onClick={closeMenu}
                                className={`flex items-center px-4 py-3 rounded-xl font-bold uppercase text-sm tracking-wider transition-all ${
                                    isAspiranteActive
                                        ? 'bg-white/15 text-puj-gold'
                                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                Aspirante
                            </Link>
                            <Link
                                to="/admin"
                                onClick={closeMenu}
                                className={`flex items-center px-4 py-3 rounded-xl font-bold uppercase text-sm tracking-wider transition-all ${
                                    isAdminActive
                                        ? 'bg-white/15 text-puj-gold'
                                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                Administrativo
                            </Link>

                            {isSecondMenu && isAspiranteActive && (
                                <div className="mt-2 pt-3 border-t border-white/15 space-y-0.5">
                                    <p className="px-4 pb-1 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                                        Oferta Académica
                                    </p>

                                    <button
                                        onClick={() => setIsMobileFacultadesOpen(!isMobileFacultadesOpen)}
                                        className="flex items-center justify-between w-full px-4 py-3 rounded-xl font-semibold text-sm text-white/80 hover:bg-white/10 hover:text-white transition-all"
                                    >
                                        Facultades
                                        <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isMobileFacultadesOpen ? '-rotate-180' : ''}`} />
                                    </button>

                                    {isMobileFacultadesOpen && (
                                        <div className="mx-3 rounded-xl overflow-hidden bg-white/5 mb-1">
                                            {facultades.map((facu) => (
                                                <button
                                                    key={facu}
                                                    className="w-full text-left px-4 py-2.5 text-sm text-white/65 hover:text-puj-gold hover:bg-white/10 transition-colors border-b border-white/5 last:border-0"
                                                    onClick={() => {
                                                        closeMenu();
                                                        navigate(`/programas?facultad=${encodeURIComponent('Facultad de ' + facu)}`);
                                                    }}
                                                >
                                                    {facu}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    <Link
                                        to="/programas?tipo=Pregrado"
                                        onClick={closeMenu}
                                        className="flex items-center px-4 py-3 rounded-xl font-semibold text-sm text-white/80 hover:bg-white/10 hover:text-white transition-all"
                                    >
                                        Pregrado
                                    </Link>
                                    <Link
                                        to="/programas?tipo=Posgrado"
                                        onClick={closeMenu}
                                        className="flex items-center px-4 py-3 rounded-xl font-semibold text-sm text-white/80 hover:bg-white/10 hover:text-white transition-all"
                                    >
                                        Posgrados
                                    </Link>
                                    <Link
                                        to="/programas?tipo=Educación+Continua"
                                        onClick={closeMenu}
                                        className="flex items-center px-4 py-3 rounded-xl font-semibold text-sm text-white/80 hover:bg-white/10 hover:text-white transition-all"
                                    >
                                        Educación Continua
                                    </Link>
                                </div>
                            )}
                        </nav>
                    </div>
                )}
            </header>

            {/* Desktop second menu */}
            {isSecondMenu && isAspiranteActive && (
                <nav className="hidden md:block bg-muted border-b border-border w-full relative z-40 shadow-sm">
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

                        <span className="text-primary font-black text-lg select-none">|</span>
                        <Link to="/programas?tipo=Pregrado" className="text-base font-bold text-primary hover:text-puj-gold transition-colors">Pregrado</Link>

                        <span className="text-primary font-black text-lg select-none">|</span>
                        <Link to="/programas?tipo=Posgrado" className="text-base font-bold text-primary hover:text-puj-gold transition-colors">Posgrados</Link>

                        <span className="text-primary font-black text-lg select-none">|</span>
                        <Link to="/programas?tipo=Educación+Continua" className="text-base font-bold text-primary hover:text-puj-gold transition-colors">Educación continua</Link>
                    </div>
                </nav>
            )}
        </div>
    );
};

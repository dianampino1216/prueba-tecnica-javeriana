import { Link } from 'react-router';
import logoJaveriana from '../../assets/logo-javeriana.png';

export const Footer = () => {
    return (
        <footer className="bg-puj-blue text-white w-full mt-auto">
            <div className="max-w-360 mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">

                <div className="space-y-4 sm:col-span-2 md:col-span-1">
                    <div className="bg-white px-3 py-2 rounded-lg inline-block shadow-md">
                        <img src={logoJaveriana} alt="Pontificia Universidad Javeriana" className="h-11 w-auto object-contain" />
                    </div>
                    <p className="text-white/65 text-sm leading-relaxed max-w-xs">
                        Formando personas íntegras al servicio de la sociedad.
                    </p>
                    <p className="text-white/40 text-xs">Carrera 7 N.° 40-62 · Bogotá, Colombia</p>
                </div>

                <div className="space-y-4">
                    <h4 className="text-puj-gold font-bold uppercase text-xs tracking-widest">Oferta Académica</h4>
                    <ul className="space-y-2.5">
                        {[
                            { to: '/programas?tipo=Pregrado', label: 'Pregrado' },
                            { to: '/programas?tipo=Posgrado', label: 'Posgrado' },
                            { to: '/programas?tipo=Educación+Continua', label: 'Educación Continua' },
                            { to: '/programas', label: 'Todos los Programas' },
                        ].map(({ to, label }) => (
                            <li key={to}>
                                <Link
                                    to={to}
                                    className="text-white/65 hover:text-puj-gold text-sm transition-colors"
                                >
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="space-y-4">
                    <h4 className="text-puj-gold font-bold uppercase text-xs tracking-widest">Portal</h4>
                    <ul className="space-y-2.5">
                        {[
                            { to: '/', label: 'Inicio Aspirantes' },
                            { to: '/admin', label: 'Área Administrativa' },
                        ].map(({ to, label }) => (
                            <li key={to}>
                                <Link
                                    to={to}
                                    className="text-white/65 hover:text-puj-gold text-sm transition-colors"
                                >
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="border-t border-white/10">
                <div className="max-w-360 mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-white/40">
                    <span>© 2026 Pontificia Universidad Javeriana · Bogotá, Colombia</span>
                    <a
                        href="https://www.linkedin.com/in/dianampino16/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-puj-gold transition-colors"
                    >
                        Desarrollado por Diana Marcela Pino Perafan
                    </a>
                </div>
            </div>
        </footer>
    );
};

import { Link } from 'react-router';
import type { Programa } from '../types';
import { ChevronRightIcon } from '../assets/icons';

interface ProgramCardProps {
    program: Programa;
}

const TYPE_BADGE: Record<string, string> = {
    'Pregrado': 'bg-puj-blue/85 text-white',
    'Posgrado': 'bg-puj-gold/90 text-puj-blue',
    'Maestría': 'bg-puj-gold/90 text-puj-blue',
    'Especialización': 'bg-puj-gold/90 text-puj-blue',
    'Doctorado': 'bg-puj-gold/90 text-puj-blue',
    'Educación Continua': 'bg-puj-cyan/85 text-white',
};

export const ProgramCard = ({ program }: ProgramCardProps) => {
    const DEFAULT_IMAGE = "https://images.pexels.com/photos/256455/pexels-photo-256455.jpeg?auto=compress&cs=tinysrgb&w=600";
    const badgeClass = TYPE_BADGE[program.tipo_programa || ''] ?? 'bg-white/85 text-primary';

    return (
        <Link
            to={`/programa/${program.id}`}
            className="group flex flex-col w-full bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-border hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
        >
            <div className="relative w-full h-52 sm:h-60 overflow-hidden">
                <div className="absolute top-4 left-0 bg-puj-cyan text-white font-bold text-sm px-5 py-1.5 z-10 shadow-md transition-transform duration-300 group-hover:translate-x-1 rounded-r-lg">
                    ¡Inscríbete!
                </div>

                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent z-0" />

                <img
                    src={program.imagen_url || DEFAULT_IMAGE}
                    alt={`Imagen representativa de ${program.nombre}`}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                        e.currentTarget.src = DEFAULT_IMAGE;
                    }}
                />

                <div className="absolute bottom-3 left-3 z-10">
                    <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm backdrop-blur-sm ${badgeClass}`}>
                        {program.tipo_programa || 'Programa'}
                    </span>
                </div>
            </div>

            <div className="p-5 flex flex-col grow">
                <h3 className="text-lg font-bold text-foreground leading-snug group-hover:text-puj-cyan transition-colors duration-200 line-clamp-2">
                    {program.nombre}
                </h3>

                {program.facultad && (
                    <p className="mt-1.5 text-xs font-medium text-muted-foreground line-clamp-1">
                        {program.facultad}
                    </p>
                )}

                <div className="mt-auto pt-4 flex items-center justify-end text-sm font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                    <span>Ver detalles</span>
                    <ChevronRightIcon className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
            </div>
        </Link>
    );
};

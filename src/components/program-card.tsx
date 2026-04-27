import { Link } from 'react-router';
import type { Programa } from '../types';
import { ChevronRightIcon } from '../assets/svg-icons';

interface ProgramCardProps {
    program: Programa;
}

export const ProgramCard = ({ program }: ProgramCardProps) => {
    const DEFAULT_IMAGE = "https://images.pexels.com/photos/256455/pexels-photo-256455.jpeg?auto=compress&cs=tinysrgb&w=600";

    return (
        <Link
            to={`/programa/${program.id}`}
            className="group flex flex-col w-full bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-border hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
        >
            <div className="relative w-full h-56 sm:h-64 overflow-hidden">

                <div className="absolute top-6 left-0 bg-puj-cyan text-white font-bold text-lg px-6 py-2 z-10 shadow-md transition-transform duration-300 group-hover:translate-x-1 rounded-r-lg">
                    ¡Inscríbete!
                </div>

                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent z-0"></div>

                <img
                    src={program.imagen_url || DEFAULT_IMAGE}
                    alt={`Imagen representativa de ${program.nombre}`}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                        e.currentTarget.src = DEFAULT_IMAGE;
                    }}
                />

                <div className="absolute bottom-4 left-4 z-10">
                    <span className="bg-card/90 backdrop-blur-sm text-primary text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm">
                        {program.tipo_programa || 'Programa'}
                    </span>
                </div>
            </div>

            <div className="p-6 flex flex-col grow">
                <h3 className="text-xl font-bold text-foreground leading-tight group-hover:text-puj-cyan transition-colors duration-200 line-clamp-2">
                    {program.nombre}
                </h3>

                <div className="mt-auto pt-4 flex items-center justify-end text-sm font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                    <span>Ver detalles</span>
                    <ChevronRightIcon className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
            </div>
        </Link>
    );
};
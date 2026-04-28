import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { programasService } from '../services/programs-service';
import { ProgramCard } from '../components/program-card';
import type { Programa } from '../types';
import { Select } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Navbar } from '../components/ui/navbar';
import { removeAccents } from '../utils/normalizer';

export const ProgramasPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [programas, setProgramas] = useState<Programa[]>([]);
    const [loading, setLoading] = useState(true);

    const paramFacultad = searchParams.get('facultad');
    const paramTipo = searchParams.get('tipo') || '';

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const loadProgramas = async () => {
            try {
                const data = await programasService.getProgramas();
                setProgramas(data);
            } catch (error) {
                console.error("Error cargando programas", error);
            } finally {
                setLoading(false);
            }
        };
        loadProgramas();
    }, []);

    const filteredProgramas = useMemo(() => {
        return programas.filter((prog) => {
            const matchFacultad = paramFacultad ? prog.facultad === paramFacultad : true;

            let matchTipo = true;
            if (paramTipo) { 
                const tipoFiltro = paramTipo.toLowerCase().trim(); 
                const tipoPrograma = (prog.tipo_programa || '').toLowerCase().trim();

                if (tipoFiltro === 'posgrado') {
                    matchTipo = ['posgrado', 'maestría', 'especialización', 'doctorado'].includes(tipoPrograma);
                } else {
                    matchTipo = tipoPrograma === tipoFiltro;
                }
            }

            const matchSearch = removeAccents(prog.nombre.toLowerCase()).includes(removeAccents(searchTerm.toLowerCase()));

            return matchFacultad && matchTipo && matchSearch;
        });
    }, [programas, paramFacultad, searchTerm, paramTipo]);

    const pageTitle = paramFacultad
        ? `Programas de la Facultad de ${paramFacultad}`
        : paramTipo
            ? `Nuestra Oferta de ${paramTipo}`
            : 'Explorar Oferta Académica';

    const handleLimpiarFiltros = () => {
        setSearchTerm('');
        setSearchParams({}); 
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
            <div className="relative h-12 w-12">
                <div className="absolute inset-0 rounded-full border-4 border-muted" />
                <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-puj-blue" />
            </div>
            <p className="text-sm text-muted-foreground font-medium tracking-wide">Cargando programas...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-background flex flex-col items-center">
            <Navbar />

            <header className="w-full bg-puj-blue py-8 sm:py-10 px-4 sm:px-6">
                <div className="max-w-360 mx-auto">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">{pageTitle}</h1>
                    <div className="h-1 w-20 sm:w-24 bg-puj-gold mt-3 sm:mt-4"></div>
                </div>
            </header>

            <div className="w-full max-w-360 mx-auto px-4 sm:px-6 -mt-6 sm:-mt-8 relative z-10">
                <div className="bg-card p-4 sm:p-6 rounded-xl shadow-lg border border-border flex flex-col md:flex-row gap-4 items-end">
                    <div className="w-full md:w-1/4">
                        <Select 
                            label="Tipo Programa" 
                            value={paramTipo} 
                            onChange={(e) => {
                                const newParams = new URLSearchParams(searchParams);
                                
                                if (e.target.value) {
                                    newParams.set('tipo', e.target.value);
                                } else {
                                    newParams.delete('tipo');
                                }
                                
                                setSearchParams(newParams); 
                            }}
                            options={[
                                { value: '', label: 'Todos los tipos' },
                                { value: 'Pregrado', label: 'Pregrado' },
                                { value: 'Posgrado', label: 'Posgrado' },
                                { value: 'Educación Continua', label: 'Educación Continua' }
                            ]}
                        />
                    </div>
                    <div className="w-full md:w-3/4">
                        <Input
                            label="Buscar programa"
                            placeholder="Ej. Ingeniería de Sistemas, Arquitectura..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <main className="w-full max-w-360 mx-auto px-6 py-12">
                {filteredProgramas.length === 0 ? (
                    <div className="text-center py-20 space-y-4">
                        <div className="text-5xl">🔍</div>
                        <p className="text-xl text-muted-foreground font-semibold">No encontramos programas con estos filtros.</p>
                        <button
                            onClick={handleLimpiarFiltros}
                            className="inline-flex items-center gap-1.5 text-puj-cyan hover:text-puj-blue font-bold transition-colors underline underline-offset-4"
                        >
                            Limpiar filtros
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {filteredProgramas.map((prog, index) => (
                            <ProgramCard key={`${prog.id}-${index}`} program={prog} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};
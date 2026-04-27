import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { programasService } from '../services/programs-service';
import { ProgramCard } from '../components/program-card';
import type { Programa } from '../types';
import { Select } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Navbar } from '../components/ui/navbar';

export const ProgramasPage = () => {
    // Agregamos setSearchParams para poder limpiar la URL si es necesario
    const [searchParams, setSearchParams] = useSearchParams();
    const [programas, setProgramas] = useState<Programa[]>([]);
    const [loading, setLoading] = useState(true);

    // Leer qué nos pide la URL
    const paramFacultad = searchParams.get('facultad');
    const paramTipo = searchParams.get('tipo') || '';

    // Estados para la barra de filtros
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

    // Lógica de filtrado combinada e inteligente
    const filteredProgramas = useMemo(() => {
        return programas.filter((prog) => {
            // 1. Filtro por Facultad
            const matchFacultad = paramFacultad ? prog.facultad === paramFacultad : true;

            let matchTipo = true;
            if (paramTipo) { // <-- CAMBIO AQUÍ
                const tipoFiltro = paramTipo.toLowerCase().trim(); // <-- CAMBIO AQUÍ
                const tipoPrograma = (prog.tipo_programa || '').toLowerCase().trim();

                if (tipoFiltro === 'posgrado') {
                    matchTipo = ['posgrado', 'maestría', 'especialización', 'doctorado'].includes(tipoPrograma);
                } else {
                    matchTipo = tipoPrograma === tipoFiltro;
                }
            }

            const matchSearch = prog.nombre.toLowerCase().includes(searchTerm.toLowerCase());

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

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-puj-blue"></div></div>;

    return (
        <div className="min-h-screen bg-background flex flex-col items-center">
            <Navbar />

            <header className="w-full bg-puj-blue py-10 px-6">
                <div className="max-w-360 mx-auto">
                    <h1 className="text-4xl md:text-5xl font-black text-white">{pageTitle}</h1>
                    <div className="h-1 w-24 bg-puj-gold mt-4"></div>
                </div>
            </header>

            <div className="w-full max-w-360 mx-auto px-6 -mt-8 relative z-10">
                <div className="bg-card p-6 rounded-xl shadow-lg border border-border flex flex-col md:flex-row gap-4 items-end">
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

            {/* Grilla de Resultados */}
            <main className="w-full max-w-360 mx-auto px-6 py-12">
                {filteredProgramas.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-2xl text-muted-foreground font-bold">No encontramos programas con estos filtros.</p>
                        <button
                            onClick={handleLimpiarFiltros}
                            className="mt-4 text-puj-cyan hover:underline font-bold"
                        >
                            Limpiar filtros
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProgramas.map((prog, index) => (
                            <ProgramCard key={`${prog.id}-${index}`} program={prog} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};
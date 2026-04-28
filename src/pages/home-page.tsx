import { useEffect, useState } from 'react';
import type { Programa, Evento } from '../types';
import { programasService } from '../services/programs-service';
import { eventosService } from '../services/events-service';
import { ProgramCard } from '../components/program-card';

import campus from '../assets/hero-campus.jpg';
import { Navbar } from '../components/ui/navbar';

export const Home = () => {
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [destacados, setDestacados] = useState<Programa[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [progData, eventData] = await Promise.all([
                    programasService.getProgramas(),
                    eventosService.getEventos()
                ]);

                setEventos(eventData);
                setDestacados(progData.slice(0, 4));
            } catch (error) {
                console.error("Error al cargar datos", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-puj-blue"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background text-foreground w-full flex flex-col overflow-x-hidden">
            <Navbar isSecondMenu={true}/>

            <section className="relative w-full h-137.5 overflow-hidden">
                <img
                    src={campus}
                    alt="Campus Javeriana"
                    className="w-full h-full object-cover transform scale-105 hover:scale-100 transition-transform duration-[5s]"
                />
                <div className="absolute inset-0 bg-linear-to-r from-puj-blue/80 to-transparent flex items-center">
                    <div className="w-full mx-auto px-6">
                        <div className="max-w-2xl text-white space-y-4">
                            <h2 className="text-6xl md:text-8xl font-black leading-none drop-shadow-2xl">
                                Transforma <br /> <span className="text-puj-gold">tu futuro</span>
                            </h2>
                            <p className="text-xl md:text-2xl font-light border-l-4 border-puj-gold pl-6 py-2 bg-black/10 backdrop-blur-sm">
                                Excelencia académica con sello Javeriano
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <main className="w-full mx-auto px-6 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                    <div className="lg:col-span-8">
                        <div className="flex items-center justify-between mb-12">
                            <h3 className="text-4xl font-black text-primary uppercase">
                                Programas <span className="text-muted-foreground font-light">Destacados</span>
                            </h3>
                            <div className="h-1 w-24 bg-puj-gold"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {destacados.map((prog, index) => (
                                < ProgramCard key={`${prog.id}-${index}`} program={prog} />
                            ))}
                        </div>
                    </div>

                    <aside className="lg:col-span-4">
                        <div className="bg-card p-10 rounded-2xl border-t-8 border-puj-blue shadow-sm border">
                            <h3 className="text-2xl font-bold text-primary mb-8 uppercase tracking-wider">Próximos Eventos</h3>
                            <div className="space-y-8">
                                {eventos.slice(0, 3).map((evento) => (
                                    <div key={evento.id} className="flex gap-6 items-start group cursor-pointer">
                                        <div className="bg-puj-blue text-white p-3 rounded-lg text-center min-w-17.5 group-hover:bg-puj-gold group-hover:text-puj-blue transition-colors shadow-lg">
                                            <span className="block text-xs font-bold">ABR</span>
                                            <span className="block text-2xl font-black">28</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg leading-snug group-hover:text-primary transition-colors">{evento.nombre}</h4>
                                            <p className="text-sm text-muted-foreground mt-1">Modalidad Presencial</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-10 py-4 border-2 border-primary text-primary font-bold rounded-lg hover:bg-primary hover:text-primary-foreground transition-all">
                                Ver Calendario Completo
                            </button>
                        </div>
                    </aside>

                </div>
            </main>
        </div>
    );
};
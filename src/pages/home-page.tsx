import React, { useEffect, useState } from 'react';
import type { Programa, Evento } from '../types';
import { programasService } from '../services/programs-service';
import { eventosService } from '../services/events-service';
import { ProgramCard } from '../components/program-card';
import { useLeadsStorage } from '../hooks/use-lead-storage';
import { validateJaverianaEmail } from '../utils/validators';
import { normalizeLeadData } from '../utils/normalizer';
import { Modal } from '../components/ui/modal';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { CheckCircleIcon } from '../assets/icons';

import campus from '../assets/hero-campus.jpg';
import { Navbar } from '../components/ui/navbar';

const EMPTY_INSCRIPCION = { nombre: '', email: '', telefono: '' };
const soloLetras = (val: string) => val.replace(/[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]/g, '');
const soloNumeros = (val: string) => val.replace(/[^0-9]/g, '');

export const Home = () => {
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [destacados, setDestacados] = useState<Programa[]>([]);
    const [loading, setLoading] = useState(true);

    const { addLead } = useLeadsStorage();
    const [eventoSeleccionado, setEventoSeleccionado] = useState<Evento | null>(null);
    const [inscripcionForm, setInscripcionForm] = useState(EMPTY_INSCRIPCION);
    const [inscripcionEmailError, setInscripcionEmailError] = useState<string | null>(null);
    const [inscripcionSuccess, setInscripcionSuccess] = useState(false);

    const handleAbrirInscripcion = (evento: Evento) => {
        setEventoSeleccionado(evento);
        setInscripcionForm(EMPTY_INSCRIPCION);
        setInscripcionEmailError(null);
        setInscripcionSuccess(false);
    };

    const handleCerrarInscripcion = () => {
        setEventoSeleccionado(null);
        setInscripcionForm(EMPTY_INSCRIPCION);
        setInscripcionEmailError(null);
        setInscripcionSuccess(false);
    };

    const handleInscripcionSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setInscripcionEmailError(null);

        const validation = validateJaverianaEmail(inscripcionForm.email);
        if (!validation.isValid) {
            setInscripcionEmailError(validation.errorMessage);
            return;
        }

        const success = addLead(normalizeLeadData({
            nombre: inscripcionForm.nombre,
            email: inscripcionForm.email,
            telefono: inscripcionForm.telefono,
            programa_interes: eventoSeleccionado!.nombre,
            facultad: '',
            tipo_documento: 'CC',
            documento: '',
            evento_inscrito: eventoSeleccionado!.nombre,
        }));

        if (success) setInscripcionSuccess(true);
    };

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
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
            <div className="relative h-12 w-12">
                <div className="absolute inset-0 rounded-full border-4 border-muted" />
                <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-puj-blue" />
            </div>
            <p className="text-sm text-muted-foreground font-medium tracking-wide">Cargando contenido...</p>
        </div>
    );

    return (
        <>
        <div className="min-h-screen bg-background text-foreground w-full flex flex-col overflow-x-hidden">
            <Navbar isSecondMenu={true}/>

            <section className="relative w-full h-85 sm:h-105 md:h-130 lg:h-137.5 overflow-hidden">
                <img
                    src={campus}
                    alt="Campus Javeriana"
                    className="w-full h-full object-cover transform scale-105 hover:scale-100 transition-transform duration-[5s]"
                />
                <div className="absolute inset-0 bg-linear-to-r from-puj-blue/85 via-puj-blue/50 to-transparent flex items-center">
                    <div className="w-full max-w-360 mx-auto px-5 sm:px-8">
                        <div className="max-w-xl text-white space-y-4 sm:space-y-5">
                            <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.05] drop-shadow-xl">
                                Transforma <br />
                                <span className="text-puj-gold">tu futuro</span>
                            </h2>
                            <p className="text-base sm:text-xl md:text-2xl font-light border-l-4 border-puj-gold pl-5 py-1.5 bg-black/10 backdrop-blur-sm">
                                Excelencia académica con sello Javeriano
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <main className="w-full max-w-360 mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">

                    <div className="lg:col-span-8">
                        <div className="flex items-center justify-between mb-8 sm:mb-12">
                            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-primary uppercase">
                                Programas <span className="text-muted-foreground font-light">Destacados</span>
                            </h3>
                            <div className="h-1 w-16 sm:w-24 bg-puj-gold shrink-0"></div>
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
                                {eventos.map((evento) => {
                                    const fecha = new Date(evento.fecha);
                                    const mes = fecha.toLocaleString('es-CO', { month: 'short' }).toUpperCase();
                                    const dia = fecha.getDate();
                                    return (
                                        <div key={evento.id} className="flex gap-4 items-start group">
                                            <div className="bg-puj-blue text-white p-3 rounded-lg text-center min-w-17.5 group-hover:bg-puj-gold group-hover:text-puj-blue transition-colors shadow-lg shrink-0">
                                                <span className="block text-xs font-bold">{mes}</span>
                                                <span className="block text-2xl font-black">{dia}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-lg leading-snug group-hover:text-primary transition-colors">{evento.nombre}</h4>
                                                <p className="text-sm text-muted-foreground mt-1">Modalidad Presencial</p>
                                                <Button
                                                    size="sm"
                                                    className="mt-3"
                                                    onClick={() => handleAbrirInscripcion(evento)}
                                                >
                                                    Inscribirse
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </aside>

                </div>
            </main>
        </div>

        <Modal
            isOpen={!!eventoSeleccionado}
            onClose={handleCerrarInscripcion}
            title={eventoSeleccionado ? `Inscribirse: ${eventoSeleccionado.nombre}` : ''}
        >
            {inscripcionSuccess ? (
                <div className="text-center py-10 animate-in zoom-in duration-500">
                    <div className="w-16 h-16 bg-puj-gold/20 text-puj-gold rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircleIcon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-puj-blue">¡Inscripción exitosa!</h3>
                    <p className="text-muted-foreground mt-2 text-sm">Tu registro al evento ha sido guardado correctamente.</p>
                </div>
            ) : (
                <form onSubmit={handleInscripcionSubmit} className="space-y-4">
                    <p className="text-sm text-muted-foreground">Completa tus datos para inscribirte al evento.</p>
                    <Input
                        label="Nombre completo"
                        required
                        value={inscripcionForm.nombre}
                        onChange={e => setInscripcionForm({ ...inscripcionForm, nombre: soloLetras(e.target.value) })}
                    />
                    <Input
                        label="Email Institucional"
                        type="email"
                        required
                        error={inscripcionEmailError ?? undefined}
                        value={inscripcionForm.email}
                        onChange={e => setInscripcionForm({ ...inscripcionForm, email: e.target.value })}
                    />
                    <Input
                        label="Teléfono"
                        type="tel"
                        required
                        value={inscripcionForm.telefono}
                        onChange={e => setInscripcionForm({ ...inscripcionForm, telefono: soloNumeros(e.target.value) })}
                    />
                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={handleCerrarInscripcion}>Cancelar</Button>
                        <Button type="submit">Confirmar Inscripción</Button>
                    </div>
                </form>
            )}
        </Modal>
        </>
    );
};
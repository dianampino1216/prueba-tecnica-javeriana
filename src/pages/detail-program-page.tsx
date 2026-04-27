import { useEffect, useState, useMemo } from 'react';
import { CheckCircleIcon } from '../assets/svg-icons';
import { useParams, useNavigate } from 'react-router';
import { programasService } from '../services/programs-service';
import { useLeadsStorage } from '../hooks/use-lead-storage';
import { normalizeLeadData, type LeadInputData } from '../utils/normalizer';
import { validateJaverianaEmail } from '../utils/validators';
import type { Programa } from '../types';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Navbar } from '../components/ui/navbar';
import { Select } from '../components/ui/select';

import campusImage from '../assets/hero-campus.jpg';

export const DetalleProgramaPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { leads, addLead } = useLeadsStorage();

    const [programa, setPrograma] = useState<Programa | null>(null);
    const [errorEmail, setErrorEmail] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        nombre: '',
        apellidos: '',
        tipo_documento: 'CC',
        documento: '',
        telefono: '',
        email: '',
        autorizacion: false
    });

    const [submitted, setSubmitted] = useState(false);

    const yaRegistrado = useMemo(() => {
        return leads.some(lead => lead.programa_interes === programa?.nombre);
    }, [leads, programa]);

    useEffect(() => {
        const loadDetalle = async () => {
            try {
                const allProgs = await programasService.getProgramas();
                const found = allProgs.find(p => String(p.id) === id);
                setPrograma(found || null);
            } catch (error) {
                console.error("Error al cargar el detalle", error);
            }
        };
        loadDetalle();
    }, [id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorEmail(null);

        const validation = validateJaverianaEmail(formData.email);
        if (!validation.isValid) {
            setErrorEmail(validation.errorMessage);
            return;
        }

        const dataToNormalize: LeadInputData = {
            nombre: `${formData.nombre} ${formData.apellidos}`,
            email: formData.email,
            telefono: formData.telefono,
            programa_interes: programa?.nombre || '',
            facultad: programa?.facultad || '',
            tipo_documento: formData.tipo_documento,
            documento: formData.documento
        };

        const normalizedData = normalizeLeadData(dataToNormalize);
        const success = addLead(normalizedData);

        if (success) {
            setSubmitted(true);
            setTimeout(() => navigate('/'), 3000);
        }
    };

    if (!programa) return null;

    return (
        <div className="min-h-screen bg-background pb-20 flex flex-col">
            <Navbar />

            <div className="w-full h-100 relative">
                <img src={programa.imagen_url || campusImage} className="w-full h-full object-cover" alt={programa.nombre} onError={(e) => {
                    e.currentTarget.src = campusImage;
                }} />
                <div className="absolute inset-0 bg-puj-blue/70 flex items-center">
                    <div className="max-w-360 mx-auto px-6 w-full text-white">
                        <h1 className="text-5xl font-black mb-2">{programa.nombre}</h1>
                        <p className="text-xl font-light text-puj-gold">{programa.facultad}</p>
                    </div>
                </div>
            </div>

            <div className="max-w-360 mx-auto px-6 mt-12 w-full grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-3xl font-bold text-primary border-b border-border pb-4">Acerca del Programa</h2>
                    <p className="text-lg text-foreground/80 leading-relaxed">{programa.descripcion}</p>
                </div>

                <div className="bg-card p-8 rounded-2xl shadow-xl border-t-8 border-puj-gold border h-fit sticky top-24">
                    {yaRegistrado || submitted ? (
                        <div className="text-center py-10 animate-in zoom-in duration-500">
                            <div className="w-20 h-20 bg-puj-gold/20 text-puj-gold rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircleIcon className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-bold text-puj-blue">
                                {yaRegistrado ? '¡Ya estás registrado!' : '¡Inscripción Exitosa!'}
                            </h3>
                            <p className="text-muted-foreground mt-3 font-medium">
                                {yaRegistrado
                                    ? 'Ya hemos recibido tu interés para este programa. Pronto nos comunicaremos contigo.'
                                    : 'Tus datos han sido procesados correctamente.'}
                            </p>
                            <Button
                                variant="outline"
                                className="mt-8 w-full"
                                onClick={() => navigate('/programas')}
                            >
                                Ver otros programas
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <h3 className="text-2xl font-black text-puj-blue mb-2">Inscríbete</h3>

                            <Input label="Nombre" required value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value })} />
                            <Input label="Apellidos" required value={formData.apellidos} onChange={e => setFormData({ ...formData, apellidos: e.target.value })} />

                            <div className="grid grid-cols-2 gap-4">
                                <Select
                                    label="Tipo"
                                    required
                                    value={formData.tipo_documento}
                                    onChange={e => setFormData({ ...formData, tipo_documento: e.target.value })}
                                    options={[{ value: 'CC', label: 'CC' }, { value: 'TI', label: 'TI' }]}
                                />
                                <Input label="Documento" required value={formData.documento} onChange={e => setFormData({ ...formData, documento: e.target.value })} />
                            </div>

                            <Input label="Teléfono" type="tel" required value={formData.telefono} onChange={e => setFormData({ ...formData, telefono: e.target.value })} />
                            <Input
                                label="E-mail Institucional"
                                type="email"
                                required
                                error={errorEmail || undefined}
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />

                            <div className="flex items-start gap-2 pt-2">
                                <input type="checkbox" id="auth" required className="mt-1 w-4 h-4 text-puj-blue" />
                                <label htmlFor="auth" className="text-sm text-muted-foreground cursor-pointer">Autorizo el tratamiento de mis datos.</label>
                            </div>

                            <Button type="submit" fullWidth className="py-3">Enviar Solicitud</Button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
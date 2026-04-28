import React, { useState, useMemo, useEffect } from 'react';
import { CheckCircleIcon } from '../assets/icons';
import { useLeadsStorage } from '../hooks/use-lead-storage';
import { leadsService } from '../services/leads-service';
import { programasService } from '../services/programs-service';
import { Table, type Column } from '../components/ui/table';
import { Navbar } from '../components/ui/navbar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/select';
import { Modal } from '../components/ui/modal';
import { validateJaverianaEmail } from '../utils/validators';
import { normalizeLeadData, type LeadInputData, removeAccents } from '../utils/normalizer';
import type { Lead, Programa } from '../types';

const EMPTY_FORM = {
    nombre: '',
    apellidos: '',
    tipo_documento: 'CC',
    documento: '',
    telefono: '',
    email: '',
    programa_interes: '',
    facultad: '',
};

const OPCIONES_TIPO_PROGRAMA = [
    { value: '', label: 'Todos los tipos' },
    { value: 'Pregrado', label: 'Pregrado' },
    { value: 'Posgrado', label: 'Posgrado' },
    { value: 'Educación Continua', label: 'Educación Continua' }
];

const soloLetras = (val: string) => val.replace(/[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]/g, '');
const soloNumeros = (val: string) => val.replace(/[^0-9]/g, '');

export const AdminLeadsPage = () => {
    const { leads: localLeads, addLead } = useLeadsStorage();
    const [serviceLeads, setServiceLeads] = useState<Lead[]>([]);
    const [programas, setProgramas] = useState<Programa[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const [leads, progs] = await Promise.all([
                leadsService.getLeads(),
                programasService.getProgramas(),
            ]);
            setServiceLeads(leads);
            setProgramas(progs);
        };
        fetchData();
    }, []);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterTipoPrograma, setFilterTipoPrograma] = useState('');
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [formSuccess, setFormSuccess] = useState(false);
    const [formTipoProgramaFilter, setFormTipoProgramaFilter] = useState('');

    const programasFiltrados = useMemo(() => {
        if (!formTipoProgramaFilter) return programas;

        return programas.filter(prog => {
            const tipoPrograma = (prog.tipo_programa || '').toLowerCase().trim();
            const filtro = formTipoProgramaFilter.toLowerCase().trim();

            if (filtro === 'posgrado') {
                return ['posgrado', 'maestría', 'maestria', 'especialización', 'especializacion', 'doctorado'].includes(tipoPrograma);
            }
            return removeAccents(tipoPrograma) === removeAccents(filtro);
        });
    }, [programas, formTipoProgramaFilter]);

    const handleTipoProgramaFormChange = (tipo: string) => {
        setFormTipoProgramaFilter(tipo);
        setFormData(prev => ({ ...prev, programa_interes: '', facultad: '' }));
    };

    const handleProgramaChange = (programaNombre: string) => {
        const prog = programas.find(p => p.nombre === programaNombre);
        setFormData(prev => ({
            ...prev,
            programa_interes: programaNombre,
            facultad: prog?.facultad ?? '',
        }));
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setEmailError(null);

        const validation = validateJaverianaEmail(formData.email);
        if (!validation.isValid) {
            setEmailError(validation.errorMessage);
            return;
        }

        const dataToNormalize: LeadInputData = {
            nombre: `${formData.nombre} ${formData.apellidos}`,
            email: formData.email,
            telefono: formData.telefono,
            programa_interes: formData.programa_interes,
            facultad: formData.facultad,
            tipo_documento: formData.tipo_documento,
            documento: formData.documento,
        };

        const success = addLead(normalizeLeadData(dataToNormalize));
        if (success) setFormSuccess(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setFormData(EMPTY_FORM);
        setEmailError(null);
        setFormSuccess(false);
        setFormTipoProgramaFilter('');
    };

    const allLeadsSorted = useMemo(() => {
        const combined = [...localLeads, ...serviceLeads];
        const normalizedSearch = removeAccents(searchTerm.toLowerCase());

        const filtered = combined.filter(lead => {
            const matchesSearch =
                removeAccents(lead.nombre.toLowerCase()).includes(normalizedSearch) ||
                removeAccents(lead.email.toLowerCase()).includes(normalizedSearch);

            let matchesTipoPrograma = true;
            if (filterTipoPrograma) {
                const progRelacionado = programas.find(p => p.nombre === lead.programa_interes);
                const tipoPrograma = progRelacionado ? (progRelacionado.tipo_programa || '').toLowerCase().trim() : '';
                const filtro = filterTipoPrograma.toLowerCase().trim();

                if (filtro === 'posgrado') {
                    matchesTipoPrograma = ['posgrado', 'maestría', 'maestria', 'especialización', 'especializacion', 'doctorado'].includes(tipoPrograma);
                } else {
                    matchesTipoPrograma = removeAccents(tipoPrograma) === removeAccents(filtro);
                }
            }

            return matchesSearch && matchesTipoPrograma;
        });

        return filtered.sort((a, b) =>
            new Date(b.fecha_inscripcion).getTime() - new Date(a.fecha_inscripcion).getTime()
        );
    }, [localLeads, serviceLeads, searchTerm, filterTipoPrograma, programas]);

    const columns: Column<Lead>[] = [
        {
            header: 'Fecha',
            accessor: (row) => new Date(row.fecha_inscripcion).toLocaleDateString()
        },
        { header: 'Nombre Completo', accessor: 'nombre' },
        {
            header: 'Programa de Interés',
            accessor: (row) => (
                <div className="space-y-1">
                    <span className="block">{row.programa_interes}</span>
                    {row.evento_inscrito && (
                        <span className="inline-block text-xs bg-puj-gold/20 text-puj-gold px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                            Evento
                        </span>
                    )}
                </div>
            )
        },
        {
            header: 'Email',
            accessor: (row) => (
                <span className="text-primary font-medium">{row.email}</span>
            )
        },
        {
            header: 'Acciones',
            accessor: (row) => (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLead(row);
                    }}
                    className="text-primary font-bold underline"
                >
                    Ver detalle
                </Button>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar isSecondMenu={false} />

            <main className="w-full max-w-360 mx-auto px-6 py-10 space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-puj-blue uppercase">Gestión de Aspirantes</h1>
                        <p className="text-muted-foreground">Administra los aspirantes de la base de datos y de registros locales.</p>
                    </div>

                    <div className="flex gap-4 items-stretch">
                        <div className="bg-card px-4 py-0 h-16 rounded-xl shadow-sm border-l-4 border-puj-blue border min-w-20 flex flex-col justify-center">
                            <span className="text-xs text-muted-foreground font-bold uppercase">Total</span>
                            <p className="text-2xl font-black text-puj-blue">{allLeadsSorted.length}</p>
                        </div>
                        <Button onClick={() => setIsFormOpen(true)} className="h-16 px-6">
                            + Registrar Aspirante
                        </Button>
                    </div>
                </div>

                <div className="bg-card p-6 rounded-xl shadow-sm border border-border flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                        <Input
                            label="Buscar por nombre o correo"
                            placeholder="Ej: Juan Perez..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="w-full md:w-64">
                        <Select
                            label="Tipo de Programa"
                            value={filterTipoPrograma}
                            onChange={(e) => setFilterTipoPrograma(e.target.value)}
                            options={OPCIONES_TIPO_PROGRAMA}
                        />
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => { setSearchTerm(''); setFilterTipoPrograma(''); }}
                        className="h-10.5"
                    >
                        Limpiar
                    </Button>
                </div>

                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Table
                        data={allLeadsSorted}
                        columns={columns}
                        emptyMessage="Aún no hay aspirantes registrados para estos criterios."
                    />
                </div>
            </main>

            <Modal
                isOpen={isFormOpen}
                onClose={handleCloseForm}
                title="Registrar Nuevo Aspirante"
            >
                {formSuccess ? (
                    <div className="text-center py-10 animate-in zoom-in duration-500">
                        <div className="w-16 h-16 bg-puj-gold/20 text-puj-gold rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircleIcon className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-puj-blue">¡Aspirante registrado!</h3>
                        <p className="text-muted-foreground mt-2 text-sm">El registro ha sido guardado correctamente.</p>
                    </div>
                ) : (
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Nombre" required value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: soloLetras(e.target.value) })} />
                            <Input label="Apellidos" required value={formData.apellidos} onChange={e => setFormData({ ...formData, apellidos: soloLetras(e.target.value) })} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Select
                                label="Tipo doc."
                                required
                                value={formData.tipo_documento}
                                onChange={e => setFormData({ ...formData, tipo_documento: e.target.value })}
                                options={[{ value: 'CC', label: 'CC' }, { value: 'TI', label: 'TI' }, { value: 'CE', label: 'CE' }]}
                            />
                            <Input label="Documento" required value={formData.documento} onChange={e => setFormData({ ...formData, documento: soloNumeros(e.target.value) })} />
                        </div>

                        <Input label="Teléfono" type="tel" required value={formData.telefono} onChange={e => setFormData({ ...formData, telefono: soloNumeros(e.target.value) })} />

                        <Input
                            label="E-mail Institucional"
                            type="email"
                            required
                            error={emailError ?? undefined}
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />

                        <Select
                            label="Tipo de Programa (opcional)"
                            value={formTipoProgramaFilter}
                            onChange={e => handleTipoProgramaFormChange(e.target.value)}
                            options={OPCIONES_TIPO_PROGRAMA}
                        />

                        <Select
                            label="Programa de Interés"
                            required
                            value={formData.programa_interes}
                            onChange={e => handleProgramaChange(e.target.value)}
                            options={[
                                { value: '', label: 'Selecciona un programa' },
                                ...programasFiltrados.map(p => ({ value: p.nombre, label: p.nombre }))
                            ]}
                        />

                        <div className="flex justify-end gap-3 pt-2">
                            <Button type="button" variant="outline" onClick={handleCloseForm}>Cancelar</Button>
                            <Button type="submit">Guardar Aspirante</Button>
                        </div>
                    </form>
                )}
            </Modal>

            <Modal
                isOpen={!!selectedLead}
                onClose={() => setSelectedLead(null)}
                title="Información Completa del Aspirante"
            >
                {selectedLead && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-xs font-bold text-muted-foreground uppercase">Aspirante</h4>
                                <p className="text-lg font-bold text-primary">{selectedLead.nombre}</p>
                            </div>
                            {selectedLead.documento && (
                                <div>
                                    <h4 className="text-xs font-bold text-muted-foreground uppercase">Identificación</h4>
                                    <p className="text-foreground/80">{selectedLead.tipo_documento}: {selectedLead.documento}</p>
                                </div>
                            )}
                        </div>

                        <div className="p-4 bg-surface rounded-lg space-y-4">
                            <h4 className="text-sm font-bold text-puj-blue">Datos de Contacto</h4>
                            <div className="space-y-1">
                                <p className="text-sm"><strong>Email:</strong> {selectedLead.email}</p>
                                <p className="text-sm"><strong>Teléfono:</strong> {selectedLead.telefono || 'No registrado'}</p>
                            </div>

                            {selectedLead.telefono && (
                                <a
                                    href={`https://wa.me/${String(selectedLead.telefono).replace(/\+/g, '').replace(/\s+/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center w-full px-4 py-2 text-sm font-bold text-white transition-colors duration-200 rounded-lg shadow-md bg-[#13ac4b] hover:bg-[#128C7E] focus:outline-none"
                                >
                                    Contactar por WhatsApp
                                </a>
                            )}
                        </div>

                        <div className="space-y-2">
                            <h4 className="text-xs font-bold text-muted-foreground uppercase">
                                {selectedLead.evento_inscrito ? 'Evento de Inscripción' : 'Programa de Interés'}
                            </h4>
                            <div className="bg-surface border border-border p-3 rounded-md">
                                <p className="font-bold text-puj-blue">{selectedLead.programa_interes}</p>
                                {selectedLead.facultad && (
                                    <p className="text-xs text-puj-cyan font-semibold uppercase">{selectedLead.facultad}</p>
                                )}
                                {selectedLead.evento_inscrito && (
                                    <span className="mt-2 inline-block text-xs bg-puj-gold/20 text-puj-gold px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                                        Inscripción a evento
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="pt-2 flex justify-end">
                            <Button variant="outline" onClick={() => setSelectedLead(null)}>
                                Cerrar Registro
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};
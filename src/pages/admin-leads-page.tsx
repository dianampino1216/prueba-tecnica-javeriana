import { useState, useMemo, useEffect, type FormEvent } from 'react';
import { CheckCircleIcon } from '../assets/svg-icons';
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
import { normalizeLeadData, type LeadInputData } from '../utils/normalizer';
import type { Lead, Programa } from '../types';
import { facultades } from '../constants';

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

    // Estados para filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [filterFacultad, setFilterFacultad] = useState('');
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

    // Estados para formulario de nuevo lead
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [formSuccess, setFormSuccess] = useState(false);
    const [formFacultadFilter, setFormFacultadFilter] = useState('');

    const facultadesUnicas = useMemo(
        () => [...new Set(programas.map(p => p.facultad))].sort(),
        [programas]
    );

    const programasFiltrados = useMemo(
        () => formFacultadFilter ? programas.filter(p => p.facultad === formFacultadFilter) : programas,
        [programas, formFacultadFilter]
    );

    const handleFacultadFormChange = (facultad: string) => {
        setFormFacultadFilter(facultad);
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

    const handleFormSubmit = (e: FormEvent) => {
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
        setFormFacultadFilter('');
    };

    // 2. Unimos, filtramos y ORDENAMOS (Más nuevos primero)
    const allLeadsSorted = useMemo(() => {
        // Unimos ambas listas
        const combined = [...localLeads, ...serviceLeads];

        // Filtramos según la búsqueda del usuario
        const filtered = combined.filter(lead => {
            const matchesSearch =
                lead.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lead.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFacultad = filterFacultad ? lead.facultad === filterFacultad : true;
            return matchesSearch && matchesFacultad;
        });

        // Ordenamos por fecha descendente (lo más reciente arriba)
        return filtered.sort((a, b) =>
            new Date(b.fecha_inscripcion).getTime() - new Date(a.fecha_inscripcion).getTime()
        );
    }, [localLeads, serviceLeads, searchTerm, filterFacultad]);

    // Definición de Columnas
    const columns: Column<Lead>[] = [
        {
            header: 'Fecha',
            accessor: (row) => new Date(row.fecha_inscripcion).toLocaleDateString()
        },
        { header: 'Nombre Completo', accessor: 'nombre' },
        { header: 'Programa de Interés', accessor: 'programa_interes' },
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
                    onClick={() => setSelectedLead(row)}
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
                {/* Cabecera y Estadísticas */}
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

                {/* Filtros */}
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
                            label="Filtrar por Facultad"
                            value={filterFacultad}
                            onChange={(e) => setFilterFacultad(e.target.value)}
                             options={[
                                { value: '', label: 'Todas las facultades' },
                                ...facultades.map(f => ({ value: f, label: f }))
                            ]}
                        />
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => { setSearchTerm(''); setFilterFacultad(''); }}
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
                        <Button className="mt-6" onClick={handleCloseForm}>Cerrar</Button>
                    </div>
                ) : (
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Nombre" required value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value })} />
                            <Input label="Apellidos" required value={formData.apellidos} onChange={e => setFormData({ ...formData, apellidos: e.target.value })} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Select
                                label="Tipo doc."
                                required
                                value={formData.tipo_documento}
                                onChange={e => setFormData({ ...formData, tipo_documento: e.target.value })}
                                options={[{ value: 'CC', label: 'CC' }, { value: 'TI', label: 'TI' }, { value: 'CE', label: 'CE' }]}
                            />
                            <Input label="Documento" required value={formData.documento} onChange={e => setFormData({ ...formData, documento: e.target.value })} />
                        </div>

                        <Input label="Teléfono" type="tel" required value={formData.telefono} onChange={e => setFormData({ ...formData, telefono: e.target.value })} />

                        <Input
                            label="E-mail Institucional"
                            type="email"
                            required
                            error={emailError ?? undefined}
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />

                        <Select
                            label="Facultad (opcional)"
                            value={formFacultadFilter}
                            onChange={e => handleFacultadFormChange(e.target.value)}
                            options={[
                                { value: '', label: 'Todas las facultades' },
                                ...facultadesUnicas.map(f => ({ value: f, label: f }))
                            ]}
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
                            <div>
                                <h4 className="text-xs font-bold text-muted-foreground uppercase">Identificación</h4>
                                <p className="text-foreground/80">{selectedLead.tipo_documento}: {selectedLead.documento}</p>
                            </div>
                        </div>

                        <div className="p-4 bg-surface rounded-lg space-y-4">
                            <h4 className="text-sm font-bold text-puj-blue">Datos de Contacto</h4>
                            <div className="space-y-1">
                                <p className="text-sm"><strong>Email:</strong> {selectedLead.email}</p>
                                <p className="text-sm"><strong>Teléfono:</strong> {selectedLead.telefono}</p>
                            </div>

                            <a
                                href={`https://wa.me/${selectedLead.telefono.replace(/\+/g, '').replace(/\s+/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block"
                            >
                                <Button fullWidth className="bg-[#25D366] hover:bg-[#128C7E] text-white border-none shadow-md">
                                    Contactar por WhatsApp
                                </Button>
                            </a>
                        </div>

                        <div className="space-y-2">
                            <h4 className="text-xs font-bold text-muted-foreground uppercase">Programa de Interés</h4>
                            <div className="bg-surface border border-border p-3 rounded-md">
                                <p className="font-bold text-puj-blue">{selectedLead.programa_interes}</p>
                                <p className="text-xs text-puj-cyan font-semibold uppercase">{selectedLead.facultad}</p>
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
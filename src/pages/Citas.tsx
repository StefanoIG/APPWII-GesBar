// src/pages/Citas.tsx
import { useState } from 'react';
import { useCitas, type CreateCitaDto } from '../hooks/useCitas';
import { useServicios } from '../hooks/useServicios';
import { useBarberos } from '../hooks/useBarberos';
import { useAuthStore } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';

const Citas = () => {
  const { user } = useAuthStore();
  const { misCitas, isLoading, crearCita } = useCitas();
  const { servicios } = useServicios(1); // Asumiendo barberia_id = 1
  const { barberos } = useBarberos(1); // Asumiendo barberia_id = 1
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    barberia_id: 1,
    fecha: '',
    hora: '',
    servicio_id: '',
    barbero_id: '',
    metodo_pago: 'en_local' as const,
  });

  const isBarbero = user?.role?.nombre === 'barbero';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const citaData: CreateCitaDto = {
        barberia_id: formData.barberia_id,
        fecha: formData.fecha,
        hora: formData.hora,
        servicio_id: parseInt(formData.servicio_id),
        barbero_id: parseInt(formData.barbero_id),
        metodo_pago: formData.metodo_pago,
      };
      await crearCita(citaData);
      setShowForm(false);
      setFormData({
        barberia_id: 1,
        fecha: '',
        hora: '',
        servicio_id: '',
        barbero_id: '',
        metodo_pago: 'en_local',
      });
    } catch (error) {
      console.error('Error al crear cita:', error);
    }
  };

  const getStatusBadgeColor = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmada':
        return 'bg-green-100 text-green-800';
      case 'completada':
        return 'bg-blue-100 text-blue-800';
      case 'cancelada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <div className="text-lg text-gray-600">Cargando citas...</div>
        </div>
      </div>
    );
  }

  const citas = misCitas || [];

  return (
    <div className="space-y-8">
      {/* Header con estadísticas */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
          <div className="mb-6 lg:mb-0">
            <h1 className="text-3xl font-bold mb-2">
              {isBarbero ? 'Mis Citas Asignadas' : 'Mis Citas'}
            </h1>
            <p className="text-blue-100">Gestiona todas tus citas de manera eficiente</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total", value: citas.length, color: "bg-white/10" },
              { label: "Pendientes", value: citas.filter((c: any) => c.estado === 'pendiente').length, color: "bg-yellow-500/20" },
              { label: "Confirmadas", value: citas.filter((c: any) => c.estado === 'confirmada').length, color: "bg-green-500/20" },
              { label: "Completadas", value: citas.filter((c: any) => c.estado === 'completada').length, color: "bg-blue-500/20" }
            ].map((stat, index) => (
              <div key={index} className={`${stat.color} backdrop-blur-sm rounded-lg p-4 text-center`}>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nueva Cita
          </Button>
          <Button variant="outline">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
            </svg>
            Filtrar
          </Button>
        </div>
      </div>

      {/* Formulario de nueva cita */}
      {showForm && (
        <div className="bg-white shadow-xl rounded-xl p-8 border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Nueva Cita</h2>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="fecha">Fecha</Label>
                <Input
                  id="fecha"
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                  required
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="hora">Hora</Label>
                <Input
                  id="hora"
                  type="time"
                  value={formData.hora}
                  onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                  required
                  className="mt-2"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="servicio_id">Servicio</Label>
                <select
                  id="servicio_id"
                  value={formData.servicio_id}
                  onChange={(e) => setFormData({ ...formData, servicio_id: e.target.value })}
                  required
                  className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors"
                >
                  <option value="">Seleccionar servicio</option>
                  {servicios?.map((servicio: any) => (
                    <option key={servicio.id} value={servicio.id}>
                      {servicio.nombre} - ${servicio.precio}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="barbero_id">Barbero</Label>
                <select
                  id="barbero_id"
                  value={formData.barbero_id}
                  onChange={(e) => setFormData({ ...formData, barbero_id: e.target.value })}
                  required
                  className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors"
                >
                  <option value="">Seleccionar barbero</option>
                  {barberos?.map((barbero: any) => (
                    <option key={barbero.id} value={barbero.id}>
                      {barbero.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="metodo_pago">Método de Pago</Label>
              <select
                id="metodo_pago"
                value={formData.metodo_pago}
                onChange={(e) => setFormData({ ...formData, metodo_pago: e.target.value as any })}
                required
                className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors"
              >
                <option value="en_local">Pago en Local</option>
                <option value="transferencia">Transferencia</option>
                <option value="payphone">Payphone</option>
              </select>
            </div>

            <div className="flex space-x-4 pt-4">
              <Button 
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                Crear Cita
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de citas */}
      {citas.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No hay citas programadas</h3>
          <p className="text-gray-600 mb-8">¡Programa tu primera cita para comenzar!</p>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            Programar Primera Cita
          </Button>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-xl border overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {citas.length} cita{citas.length !== 1 ? 's' : ''} encontrada{citas.length !== 1 ? 's' : ''}
            </h2>
          </div>
          
          <div className="divide-y divide-gray-100">
            {citas.map((cita: any) => (
              <div key={cita.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Cita #{cita.id}
                        </h3>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(cita.estado)}`}>
                          {cita.estado}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{new Date(cita.fecha).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{cita.hora}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                          <span className="font-semibold">${cita.total}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                          <span className="capitalize">{cita.metodo_pago.replace('_', ' ')}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                          <span className="capitalize">{cita.estado_pago}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Button size="sm" variant="outline">
                      Ver Detalles
                    </Button>
                    {cita.estado === 'pendiente' && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        Confirmar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Citas;

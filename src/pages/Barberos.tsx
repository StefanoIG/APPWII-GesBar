// src/pages/Barberos.tsx
import React, { useState } from 'react';
import { useBarberos, type Barbero } from '../hooks/useBarberos';
import { useAuthStore } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';

// Modal para crear barbero
const CreateBarberoModal = ({ isOpen, onClose, onSubmit, isLoading }: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    password: '',
    biografia: '',
    barberia_id: 1
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-6">Agregar Nuevo Barbero</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nombre">Nombre Completo</Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="biografia">Biografía (opcional)</Label>
            <textarea
              id="biografia"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={3}
              value={formData.biografia}
              onChange={(e) => setFormData({ ...formData, biografia: e.target.value })}
            />
          </div>
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Creando...' : 'Crear Barbero'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal para ver barbero
const ViewBarberoModal = ({ isOpen, onClose, barbero }: {
  isOpen: boolean;
  onClose: () => void;
  barbero: Barbero | null;
}) => {
  if (!isOpen || !barbero) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold">Información del Barbero</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* Información Personal */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Información Personal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-500">Nombre:</span>
                <p className="text-gray-900">{barbero.user.nombre}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Email:</span>
                <p className="text-gray-900">{barbero.user.email}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Teléfono:</span>
                <p className="text-gray-900">{barbero.user.telefono}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Estado:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  barbero.estado === 'activo' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {barbero.estado}
                </span>
              </div>
            </div>
          </div>

          {/* Biografía */}
          {barbero.biografia && (
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">Biografía</h3>
              <p className="text-gray-700">{barbero.biografia}</p>
            </div>
          )}

          {/* Servicios */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-4">Servicios Asignados</h3>
            {barbero.servicios && barbero.servicios.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {barbero.servicios.map((servicio) => (
                  <div key={servicio.id} className="border rounded-lg p-3">
                    <h4 className="font-medium">{servicio.nombre}</h4>
                    <p className="text-sm text-gray-600">{servicio.descripcion}</p>
                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                      <span>{servicio.duracion} min</span>
                      <span>${servicio.precio}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No tiene servicios asignados</p>
            )}
          </div>

          {/* Información de Barbería */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-4">Barbería</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-500">Nombre:</span>
                <p className="text-gray-900">{barbero.barberia.nombre}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Dirección:</span>
                <p className="text-gray-900">{barbero.barberia.direccion}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Teléfono:</span>
                <p className="text-gray-900">{barbero.barberia.telefono}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Email:</span>
                <p className="text-gray-900">{barbero.barberia.email}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
};

// Modal para editar barbero
const EditBarberoModal = ({ isOpen, onClose, barbero, onSubmit, isLoading }: {
  isOpen: boolean;
  onClose: () => void;
  barbero: Barbero | null;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    biografia: '',
    estado: 'activo' as 'activo' | 'inactivo'
  });

  // Cargar datos del barbero cuando se abre el modal
  React.useEffect(() => {
    if (barbero) {
      setFormData({
        nombre: barbero.user.nombre,
        email: barbero.user.email,
        telefono: barbero.user.telefono,
        biografia: barbero.biografia || '',
        estado: barbero.estado
      });
    }
  }, [barbero]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (barbero) {
      onSubmit({ id: barbero.id, data: formData });
    }
  };

  if (!isOpen || !barbero) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Editar Barbero</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="edit-nombre">Nombre Completo</Label>
            <Input
              id="edit-nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="edit-email">Email</Label>
            <Input
              id="edit-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="edit-telefono">Teléfono</Label>
            <Input
              id="edit-telefono"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="edit-biografia">Biografía</Label>
            <textarea
              id="edit-biografia"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={3}
              value={formData.biografia}
              onChange={(e) => setFormData({ ...formData, biografia: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="edit-estado">Estado</Label>
            <select
              id="edit-estado"
              value={formData.estado}
              onChange={(e) => setFormData({ ...formData, estado: e.target.value as 'activo' | 'inactivo' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Barberos = () => {
  const { user } = useAuthStore();
  const {
    barberos,
    stats,
    isLoading,
    createBarbero,
    updateBarbero,
    isCreating,
    isUpdating,
    createError
  } = useBarberos();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBarbero, setSelectedBarbero] = useState<Barbero | null>(null);

  const isAdmin = user?.role?.nombre === 'admin';
  const isDueno = user?.role?.nombre === 'dueño';
  const canManageBarberos = isAdmin || isDueno;

  const handleCreateBarbero = (data: any) => {
    createBarbero(data, {
      onSuccess: () => {
        setShowCreateModal(false);
      }
    });
  };

  const handleUpdateBarbero = (data: any) => {
    updateBarbero(data, {
      onSuccess: () => {
        setShowEditModal(false);
        setSelectedBarbero(null);
      }
    });
  };

  const handleViewBarbero = (barbero: Barbero) => {
    setSelectedBarbero(barbero);
    setShowViewModal(true);
  };

  const handleEditBarbero = (barbero: Barbero) => {
    setSelectedBarbero(barbero);
    setShowEditModal(true);
  };

  if (!canManageBarberos) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h1>
          <p className="text-gray-600 mb-6">No tienes permisos para ver esta página.</p>
          <Button onClick={() => window.history.back()} variant="outline">
            Volver
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <div className="text-lg text-gray-600">Cargando barberos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-8 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gestión de Barberos</h1>
            <p className="text-purple-100">Administra el equipo de profesionales</p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-white text-purple-600 hover:bg-gray-50"
          >
            + Agregar Barbero
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Barberos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Barberos Activos</p>
              <p className="text-2xl font-bold text-green-600">{stats.activos}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Barberos Inactivos</p>
              <p className="text-2xl font-bold text-red-600">{stats.inactivos}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Nuevos Este Mes</p>
              <p className="text-2xl font-bold text-purple-600">{stats.nuevos}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Barberos */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Lista de Barberos</h2>
              <p className="text-gray-600">Gestiona la información de tu equipo</p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden">
          {(!barberos || barberos.length === 0) ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay barberos registrados</h3>
              <p className="text-gray-500 mb-6">Agrega el primer barbero a tu equipo</p>
              <Button onClick={() => setShowCreateModal(true)}>
                + Agregar Primer Barbero
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {barberos.map((barbero) => (
                <div key={barbero.id} className="bg-gray-50 rounded-lg p-6 border">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-semibold text-lg">
                          {barbero.user.nombre.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{barbero.user.nombre}</h3>
                        <p className="text-sm text-gray-500">{barbero.user.email}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      barbero.estado === 'activo' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {barbero.estado}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {barbero.user.telefono}
                    </div>
                    {barbero.biografia && (
                      <p className="text-sm text-gray-600">{barbero.biografia}</p>
                    )}
                    <div className="text-sm text-gray-500">
                      Servicios: {barbero.servicios?.length || 0}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleViewBarbero(barbero)}
                    >
                      Ver
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEditBarbero(barbero)}
                    >
                      Editar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <CreateBarberoModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateBarbero}
        isLoading={isCreating}
      />

      <ViewBarberoModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedBarbero(null);
        }}
        barbero={selectedBarbero}
      />

      <EditBarberoModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedBarbero(null);
        }}
        barbero={selectedBarbero}
        onSubmit={handleUpdateBarbero}
        isLoading={isUpdating}
      />

      {/* Error handling */}
      {createError && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error al crear barbero: {createError.message}
        </div>
      )}
    </div>
  );
};

export default Barberos;

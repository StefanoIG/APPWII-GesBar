// src/pages/Perfil.tsx
import { useState } from 'react';
import { useAuthStore } from '../hooks/useAuth';
import useApiClient from '../hooks/useApiClient';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';

const Perfil = () => {
  const { user, login } = useAuthStore();
  const apiClient = useApiClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    email: user?.email || '',
    telefono: user?.telefono || '',
    cedula: user?.cedula || '',
  });

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    try {
      // PUT /usuarios/{id}
      const { data: updatedUser } = await apiClient.put(`/usuarios/${user?.id}`, formData);
      // Actualizar el estado global (mantener token)
      login(useAuthStore.getState().token!, updatedUser);
      setIsEditing(false);
    } catch (err: any) {
      setSaveError('Error al guardar cambios');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
        <Button 
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "outline" : "default"}
        >
          {isEditing ? 'Cancelar' : 'Editar Perfil'}
        </Button>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        {!isEditing ? (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">Nombre Completo</Label>
              <p className="mt-1 text-lg text-gray-900">{user?.nombre}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Email</Label>
              <p className="mt-1 text-lg text-gray-900">{user?.email}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Teléfono</Label>
              <p className="mt-1 text-lg text-gray-900">{user?.telefono}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Cédula</Label>
              <p className="mt-1 text-lg text-gray-900">{user?.cedula || 'No registrada'}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Rol</Label>
              <p className="mt-1 text-lg text-gray-900 capitalize">{user?.role?.nombre}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Estado</Label>
              <span className={`mt-1 inline-flex px-2 py-1 text-xs rounded-full ${
                user?.bloqueado 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {user?.bloqueado ? 'Bloqueado' : 'Activo'}
              </span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="nombre">Nombre Completo</Label>
              <Input
                id="nombre"
                name="nombre"
                type="text"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                name="telefono"
                type="tel"
                value={formData.telefono}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="cedula">Cédula</Label>
              <Input
                id="cedula"
                name="cedula"
                type="text"
                value={formData.cedula}
                onChange={handleChange}
                placeholder="Opcional"
              />
            </div>
            <div className="flex space-x-3">
              <Button type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Guardar Cambios'}</Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditing(false)}
                disabled={saving}
              >
                Cancelar
              </Button>
            </div>
            {saveError && <div className="text-red-600 mt-2">{saveError}</div>}
          </form>
        )}
      </div>
    </div>
  );
};

export default Perfil;

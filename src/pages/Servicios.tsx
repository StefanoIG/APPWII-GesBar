// src/pages/Servicios.tsx
import { useServicios } from '../hooks/useServicios';
import { Button } from '../components/ui/Button';

const Servicios = () => {
  const { servicios, isLoading } = useServicios(1); // Asumiendo barberia_id = 1

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <div className="text-lg text-gray-600">Cargando servicios...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Nuestros Servicios</h1>
            <p className="text-indigo-100">Descubre todos los servicios premium que ofrecemos</p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold">{servicios?.length || 0}</div>
              <div className="text-sm text-indigo-100">Servicios Disponibles</div>
            </div>
          </div>
        </div>
      </div>

      {/* Servicios Grid */}
      {(!servicios || servicios.length === 0) ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay servicios disponibles</h3>
          <p className="text-gray-600">Los servicios se cargarán pronto.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicios.map((servicio: any) => (
            <div key={servicio.id} className="group bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all duration-300 overflow-hidden">
              {/* Service Icon/Image */}
              <div className="h-32 bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M12 5.5a3 3 0 015.196 2.14l-1.732 1.732M8 21l4-7 4 7M3 4h18" />
                  </svg>
                </div>
              </div>
              
              {/* Service Content */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                    {servicio.nombre}
                  </h3>
                  <span className="text-2xl font-bold text-purple-600">
                    ${servicio.precio}
                  </span>
                </div>
                
                {servicio.descripcion && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {servicio.descripcion}
                  </p>
                )}
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {servicio.duracion} minutos
                  </div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-1 text-sm text-gray-500">4.8</span>
                  </div>
                </div>
                
                <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                  Reservar Ahora
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Service Categories */}
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Categorías de Servicios
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: "Cortes", icon: "✂️", count: "8 servicios" },
            { name: "Barba", icon: "🧔", count: "5 servicios" },
            { name: "Tratamientos", icon: "✨", count: "3 servicios" },
            { name: "Combos", icon: "💇‍♂️", count: "4 servicios" }
          ].map((category, index) => (
            <div key={index} className="text-center p-4 rounded-lg border hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="text-3xl mb-2">{category.icon}</div>
              <h3 className="font-semibold text-gray-900">{category.name}</h3>
              <p className="text-sm text-gray-500">{category.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-4">¿No encuentras lo que buscas?</h2>
        <p className="text-purple-100 mb-6">
          Contáctanos para servicios personalizados o consultas especiales
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
            Contactar
          </Button>
          <Button className="bg-white text-purple-600 hover:bg-gray-100">
            Ver Promociones
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Servicios;

import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, Package } from 'lucide-react';
import { ProductRow } from '../ui/ProductRow';
import { useInventory } from '../../../hooks/useInventory';

/**
 * Inventory management page with product stock control
 */
export function InventoryPage() {
  const {
    inventory,
    loading,
    updateStock,
    toggleAvailability,
    updatePrice,
    getProductsByCategory,
    searchProducts,
    getLowStockProducts,
  } = useInventory();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Get filtered products
  const getFilteredProducts = () => {
    if (searchQuery) {
      return searchProducts(searchQuery);
    }
    return getProductsByCategory(activeCategory);
  };

  const filteredProducts = getFilteredProducts();
  const lowStockProducts = getLowStockProducts();

  const categories = [
    { value: 'all', label: 'Todos' },
    { value: 'matcha', label: 'Matcha' },
    { value: 'protein', label: 'Proteína' },
    { value: 'coffee', label: 'Café y Té' },
    { value: 'snacks', label: 'Para Picar' },
  ];

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#155020] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#155020]/60 font-sans-brand">Cargando inventario...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-[Abril_Fatface] text-[#155020] mb-2">
          Gestión de Inventario
        </h1>
        <p className="text-[#155020]/60 font-sans-brand">
          Administra el stock y disponibilidad de productos
        </p>
      </motion.div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border-l-4 border-red-600 p-4 mb-6 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6 text-red-600" />
            <div>
              <p className="font-sans-brand font-semibold text-red-900">
                {lowStockProducts.length} {lowStockProducts.length === 1 ? 'producto tiene' : 'productos tienen'} stock bajo
              </p>
              <p className="text-sm text-red-700 font-sans-brand">
                Revisa y actualiza el inventario de estos productos
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        {/* Category Filters */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-5 h-5 text-[#155020]" />
            <span className="font-sans-brand font-semibold text-[#155020]">Categoría:</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => {
                  setActiveCategory(category.value);
                  setSearchQuery('');
                }}
                className={`px-4 py-2 rounded-lg font-sans-brand font-semibold transition-all ${
                  activeCategory === category.value
                    ? 'bg-[#155020] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setActiveCategory('all');
            }}
            placeholder="Buscar productos por nombre..."
            className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg font-sans-brand focus:outline-none focus:border-[#155020] transition-colors"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#155020] text-white">
              <tr>
                <th className="py-4 px-4 text-left font-sans-brand font-semibold">Imagen</th>
                <th className="py-4 px-4 text-left font-sans-brand font-semibold">Nombre</th>
                <th className="py-4 px-4 text-left font-sans-brand font-semibold">Categoría</th>
                <th className="py-4 px-4 text-left font-sans-brand font-semibold">Precio</th>
                <th className="py-4 px-4 text-left font-sans-brand font-semibold">Stock</th>
                <th className="py-4 px-4 text-left font-sans-brand font-semibold">Disponible</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-sans-brand">
                      No se encontraron productos
                    </p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    onUpdateStock={updateStock}
                    onToggleAvailability={toggleAvailability}
                    onUpdatePrice={updatePrice}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results Count */}
      <div className="mt-4 text-center">
        <p className="text-sm text-[#155020]/60 font-sans-brand">
          Mostrando {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'}
        </p>
      </div>

      {/* Help Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 bg-[#C8D96F]/10 border border-[#C8D96F]/30 rounded-lg p-4"
      >
        <h4 className="font-sans-brand font-semibold text-[#155020] mb-2">
          💡 Ayuda
        </h4>
        <ul className="text-sm text-[#155020]/80 font-sans-brand space-y-1">
          <li>• Click en el número de stock para editarlo directamente</li>
          <li>• Usa los botones + / - para ajustar el stock rápidamente</li>
          <li>• El switch permite activar/desactivar la disponibilidad del producto</li>
          <li>• Los productos con stock bajo (menos de 5 unidades) se marcan en rojo</li>
        </ul>
      </motion.div>
    </div>
  );
}
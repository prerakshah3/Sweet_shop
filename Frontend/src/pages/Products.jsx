import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye } from 'lucide-react';
import ProductModal from '../components/ProductModal';
import PurchaseModal from '../components/PurchaseModal';

const API_URL = 'http://localhost:8000/api/sweets';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [purchaseQuantities, setPurchaseQuantities] = useState({});
  const [purchaseProduct, setPurchaseProduct] = useState(null);
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);

  // Fetch products from backend
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add product
  const addProduct = async (product) => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      if (res.ok) {
        fetchProducts();
      }
    } catch (err) {
      console.error('Failed to add product:', err);
    }
  };

  // Update product
  const updateProduct = async (id, product) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      if (res.ok) {
        fetchProducts();
      }
    } catch (err) {
      console.error('Failed to update product:', err);
    }
  };

  // Delete product
  const deleteProduct = async (sweetId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`${API_URL}/${sweetId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProducts();
      }
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  };

  const handleQuantityChange = (sweetId, value) => {
    setPurchaseQuantities(prev => ({
      ...prev,
      [sweetId]: value ? parseInt(value, 10) : ''
    }));
  };

  const handlePurchase = async (sweetId, quantity) => {
    if (!quantity || quantity <= 0) return;

    try {
      const res = await fetch(`${API_URL}/purchase`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sweetId, quantity }),
      });

      if (res.ok) {
        fetchProducts();
        setPurchaseQuantities(prev => {
          const newState = { ...prev };
          delete newState[sweetId];
          return newState;
        });
        window.dispatchEvent(new Event('inventory-refresh'));
      } else {
        const errorData = await res.json();
        alert(`Purchase failed: ${errorData.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Failed to purchase product:', err);
      alert('Failed to purchase product. Please try again.');
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { color: 'text-red-600', bg: 'bg-red-100', label: 'Out of Stock' };
    if (stock < 10) return { color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Low Stock' };
    return { color: 'text-green-600', bg: 'bg-green-100', label: 'In Stock' };
  };

  const outOfStockCount = products.filter(p => (p.stock ?? p.quantity) === 0).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center space-x-2 shadow-lg"
        >
          <Plus className="h-5 w-5" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading products...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id || product.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 min-h-[380px] min-w-[260px] flex flex-col"
            >
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover"
                  onError={e => e.target.style.display='none'}
                />
              ) : (
                <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
                  <span className="text-gray-300 text-6xl">🖼️</span>
                </div>
              )}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                  <span style={{ color: product.quantity === 0 ? 'red' : 'inherit' }}>
                    {product.quantity} in stock
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                <p className="text-gray-700 text-sm mb-3">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-purple-600">{product.price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={e => {
                        e.stopPropagation(); // Prevent triggering card click
                        deleteProduct(product.sweetId);
                      }}
                      className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setPurchaseProduct(product);
                    setPurchaseQuantity(1);
                  }}
                  className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                  disabled={product.quantity === 0}
                >
                  Purchase
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredProducts.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg">No products found</div>
          <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
        </div>
      )}

      {purchaseProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">Purchase {purchaseProduct.name}</h2>
            <div className="flex items-center justify-center space-x-4 mb-4">
              <button
                onClick={() => setPurchaseQuantity(q => Math.max(1, q - 1))}
                className="px-3 py-1 bg-gray-200 rounded text-lg"
              >-</button>
              <input
                type="number"
                min="1"
                max={purchaseProduct.quantity}
                value={purchaseQuantity}
                onChange={e => {
                  let val = parseInt(e.target.value, 10);
                  if (isNaN(val)) val = 1;
                  setPurchaseQuantity(Math.max(1, Math.min(purchaseProduct.quantity, val)));
                }}
                className="w-16 text-center border border-gray-300 rounded"
              />
              <button
                onClick={() => setPurchaseQuantity(q => Math.min(purchaseProduct.quantity, q + 1))}
                className="px-3 py-1 bg-gray-200 rounded text-lg"
              >+</button>
            </div>
            <div className="text-center mb-4">
              <span className="font-semibold">Total: </span>
              <span className="text-purple-600 font-bold">
                {(purchaseProduct.price * purchaseQuantity).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
              </span>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setPurchaseProduct(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >Cancel</button>
              <button
                onClick={async () => {
                  await handlePurchase(purchaseProduct.sweetId, purchaseQuantity);
                  setPurchaseProduct(null);
                }}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700"
              >Buy</button>
            </div>
          </div>
        </div>
      )}

      <ProductModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        product={selectedProduct}
        onSave={(product) => {
          if (selectedProduct) {
            updateProduct(selectedProduct._id || selectedProduct.id, product);
          } else {
            addProduct(product);
          }
          handleModalClose();
        }}
      />
    </div>
  );
};

export default Products;
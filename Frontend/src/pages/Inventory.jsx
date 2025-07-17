import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

const API_URL = 'http://localhost:8000/api/sweets';
const RESTOCK_URL = 'http://localhost:8000/api/sweets/restock';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [restockQuantities, setRestockQuantities] = useState({});

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const handleRefresh = () => {
      fetchProducts();
    };
    window.addEventListener('inventory-refresh', handleRefresh);
    return () => window.removeEventListener('inventory-refresh', handleRefresh);
  }, []);

  const inStockItems = products.filter(product => product.stock > 0);
  const lowStockItems = products.filter(product => product.stock > 0 && product.stock < 10);
  const outOfStockItems = products.filter(product => product.stock === 0);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let aValue, bValue;
    if (sortBy === 'stock') {
      aValue = a.stock ?? a.quantity;
      bValue = b.stock ?? b.quantity;
    } else {
      aValue = a[sortBy];
      bValue = b[sortBy];
    }

    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const getStockStatus = (stock) => {
    if (stock === 0) return { color: 'text-red-600', bg: 'bg-red-100', label: 'Out of Stock' };
    if (stock < 10) return { color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Low Stock' };
    return { color: 'text-green-600', bg: 'bg-green-100', label: 'In Stock' };
  };

  const handleRestockChange = (sweetId, value) => {
    setRestockQuantities(prev => ({
      ...prev,
      [sweetId]: value ? parseInt(value, 10) : ''
    }));
  };

  const handleRestock = async (sweetId) => {
    const quantity = restockQuantities[sweetId];
    if (!quantity || quantity <= 0) return;
    try {
      const res = await fetch(RESTOCK_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sweetId, quantity }),
      });
      if (res.ok) {
        setRestockQuantities(prev => ({ ...prev, [sweetId]: '' }));
        fetchProducts(); // <-- This refreshes the inventory
      } else {
        const errorData = await res.json();
        alert(`Restock failed: ${errorData.message || 'Unknown error'}`);
      }
    } catch (err) {
      alert('Failed to restock product. Please try again.');
    }
  };

  const inStockCount = products.filter(p => (p.stock ?? p.quantity) > 0).length;
  const lowStockCount = products.filter(p => (p.stock ?? p.quantity) > 0 && (p.stock ?? p.quantity) < 10).length;
  const outOfStockCount = products.filter(p => (p.stock ?? p.quantity) === 0).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
        <div className="flex space-x-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="name">Sort by Name</option>
            <option value="stock">Sort by Stock</option>
            <option value="price">Sort by Price</option>
            <option value="category">Sort by Category</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
          >
            {sortOrder === 'asc' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            <span>{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
          </button>
        </div>
      </div>

      <div className="my-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-3">
            <Package className="h-6 w-6 text-green-600" />
            <h3 className="text-lg font-semibold text-green-900">In Stock</h3>
          </div>
          <p className="text-2xl font-bold text-green-600 mb-2">{inStockCount}</p>
          <p className="text-sm text-green-700">Products available in inventory</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-3">
            <Package className="h-6 w-6 text-yellow-600" />
            <h3 className="text-lg font-semibold text-yellow-900">Low Stock</h3>
          </div>
          <p className="text-2xl font-bold text-yellow-600 mb-2">{lowStockCount}</p>
          <p className="text-sm text-yellow-700">Products with less than 10 units</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-3">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <h3 className="text-lg font-semibold text-red-900">Out of Stock</h3>
          </div>
          <p className="text-2xl font-bold text-red-600 mb-2">{outOfStockCount}</p>
          <p className="text-sm text-red-700">Products need immediate restocking</p>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Current Inventory</h3>
        </div>
        {loading ? (
          <div className="text-center py-8 text-gray-400">Loading inventory...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Restock
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {sortedProducts.map((product) => {
                  const status = getStockStatus(product.stock ?? product.quantity);
                return (
                    <tr key={product._id || product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                          <div className="text-2xl">{product.emoji}</div>
                        <div>
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                          {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.stock ?? product.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStockStatus(product.stock ?? product.quantity).bg} ${getStockStatus(product.stock ?? product.quantity).color}`}>
                        {getStockStatus(product.stock ?? product.quantity).label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        { (product.price * product.quantity).toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          min="1"
                          value={restockQuantities[product.sweetId] || ''}
                          onChange={e => handleRestockChange(product.sweetId, e.target.value)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded-md text-center"
                          placeholder="Qty"
                        />
                        <button
                          onClick={() => handleRestock(product.sweetId)}
                          disabled={!restockQuantities[product.sweetId] || restockQuantities[product.sweetId] <= 0}
                          className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-colors"
                        >
                          Restock
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;
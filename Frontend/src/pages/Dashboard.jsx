import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:8000/api/sweets';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAllProducts, setShowAllProducts] = useState(false);

  useEffect(() => {
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
    fetchProducts();
  }, []);

  const totalProducts = products.length;
  const inStockCount = products.filter(p => p.quantity > 0).length;
  const lowStockCount = products.filter(p => p.quantity > 0 && p.quantity < 10).length;
  const outOfStockCount = products.filter(p => p.quantity === 0).length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  const lowStockProducts = products.filter(p => p.quantity > 0 && p.quantity < 10);
  const outOfStockProducts = products.filter(p => p.quantity === 0);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Dashboard</h1>
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading dashboard...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
            <div
              className="bg-white p-6 rounded-xl shadow-sm border text-center cursor-pointer hover:bg-purple-50"
              onClick={() => setShowAllProducts(v => !v)}
            >
              <div className="text-2xl font-bold text-purple-600">{totalProducts}</div>
              <div className="text-gray-700 mt-2">Total Products</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
              <div className="text-2xl font-bold text-green-600">{inStockCount}</div>
              <div className="text-gray-700 mt-2">In Stock</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
              <div className="text-2xl font-bold text-yellow-600">{lowStockCount}</div>
              <div className="text-gray-700 mt-2">Low Stock</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
              <div className="text-2xl font-bold text-red-600">{outOfStockCount}</div>
              <div className="text-gray-700 mt-2">Out of Stock</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
              <div className="text-2xl font-bold text-blue-600">
                {totalValue.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
              </div>
              <div className="text-gray-700 mt-2">Inventory Value</div>
            </div>
          </div>

          {showAllProducts && (
            <div className="bg-white rounded-xl shadow-sm border mt-6 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.sweetId}>
                      <td className="px-6 py-4">{p.name}</td>
                      <td className="px-6 py-4">{p.category}</td>
                      <td className="px-6 py-4">{p.price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
                      <td className="px-6 py-4">{p.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Low/Out of Stock Alerts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-yellow-50 p-4 rounded-xl border">
              <h3 className="font-semibold text-yellow-800 mb-2">Low Stock Products</h3>
              <ul>
                {lowStockProducts.length === 0 ? (
                  <li className="text-gray-500">None</li>
                ) : (
                  lowStockProducts.map(p => (
                    <li key={p.sweetId} className="text-yellow-700">{p.name} ({p.quantity} left)</li>
                  ))
                )}
              </ul>
            </div>
            <div className="bg-red-50 p-4 rounded-xl border">
              <h3 className="font-semibold text-red-800 mb-2">Out of Stock Products</h3>
              <ul>
                {outOfStockProducts.length === 0 ? (
                  <li className="text-gray-500">None</li>
                ) : (
                  outOfStockProducts.map(p => (
                    <li key={p.sweetId} className="text-red-700">{p.name}</li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:8000/api/sweets/purchase';

const PurchaseModal = ({ isOpen, onClose, product, onPurchase }) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [purchaseProduct, setPurchaseProduct] = useState(null);
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setError('');
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const maxQuantity = product.stock || product.quantity || 0;
  const totalPrice = (quantity * product.price).toFixed(2);

  const handlePurchase = async (sweetId, quantity) => {
    if (!quantity || quantity <= 0) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sweetId: sweetId, quantity: Number(quantity) })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to purchase');
      }
      if (onPurchase) onPurchase(Number(quantity));
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to purchase');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Purchase {product.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">✕</button>
        </div>
        <form onSubmit={handlePurchase} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
            <input
              type="number"
              min={1}
              max={maxQuantity}
              value={quantity}
              onChange={e => setQuantity(Math.max(1, Math.min(maxQuantity, Number(e.target.value))))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
            <div className="text-xs text-gray-500 mt-1">Available: {maxQuantity}</div>
          </div>
          <div>
            <span className="text-lg font-semibold">Total Price: </span>
            <span className="text-lg text-purple-600 font-bold">{Number(totalPrice).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
              disabled={loading || quantity < 1 || quantity > maxQuantity}
            >
              {loading ? 'Purchasing...' : 'Purchase'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PurchaseModal; 
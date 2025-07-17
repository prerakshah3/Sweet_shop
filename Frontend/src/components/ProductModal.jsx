import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';

const API_URL = 'http://localhost:8000/api/sweets';

const ProductModal = ({ isOpen, onClose, product, onSave, products }) => {
  const { addNotification } = useNotifications();
  const [formData, setFormData] = useState({
    sweetId: '',
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    image: ''
  });
  const [file, setFile] = useState(null);

  const categoryOptions = products
    ? Array.from(new Set(products.map(p => p.category)))
        .filter(Boolean)
        .map(cat => ({ value: cat, label: cat }))
    : [];

  useEffect(() => {
    if (product) {
      setFormData({
        sweetId: product.sweetId || '',
        name: product.name,
        category: product.category,
        price: product.price.toString(),
        stock: product.stock?.toString() || product.quantity?.toString() || '',
        description: product.description,
        image: product.image || ''
      });
      setFile(null);
    } else {
      setFormData({
        sweetId: '',
        name: '',
        category: '',
        price: '',
        stock: '',
        description: '',
        image: ''
      });
      setFile(null);
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('sweetId', formData.sweetId);
    formDataToSend.append('name', formData.name);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('quantity', formData.stock);
    formDataToSend.append('description', formData.description);
    // If a new file is selected, use it. Otherwise, if a new URL is entered, use it. If neither, backend keeps old image.
    if (file) {
      formDataToSend.append('image', file);
    } else if (formData.image && (!product || formData.image !== product.image)) {
      formDataToSend.append('image', formData.image);
    }
    try {
      if (product) {
        // Update (with file or URL support)
        const res = await fetch(`${API_URL}/${product.sweetId}`, {
          method: 'PUT',
          body: formDataToSend
        });
        if (!res.ok) throw new Error('Failed to update product');
        addNotification('Product updated successfully!', 'success');
      } else {
        // Add (with file upload)
        const res = await fetch(API_URL, {
          method: 'POST',
          body: formDataToSend
        });
        if (!res.ok) throw new Error('Failed to add product');
        addNotification('Product added successfully!', 'success');
      }
      if (onSave) onSave(formData);
      onClose();
    } catch (err) {
      addNotification(err.message || 'Error saving product', 'error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!product && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sweet ID
              </label>
              <input
                type="text"
                value={formData.sweetId}
                onChange={(e) => setFormData(prev => ({ ...prev, sweetId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <CreatableSelect
              options={categoryOptions}
              value={formData.category ? { value: formData.category, label: formData.category } : null}
              onChange={option => setFormData(prev => ({ ...prev, category: option ? option.value : '' }))}
              isClearable
              isSearchable
              placeholder="Select or type category"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter product description..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Image (Upload or URL)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={e => setFile(e.target.files[0])}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <input
              type="url"
              value={formData.image}
              onChange={e => setFormData(prev => ({ ...prev, image: e.target.value }))}
              placeholder="https://example.com/image.jpg"
              className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            {/* Show preview if editing or if a new file or URL is selected */}
            {(file || formData.image) && (
              <img
                src={file ? URL.createObjectURL(file) : formData.image}
                alt="Preview"
                className="mt-2 h-40 w-40 object-contain rounded mx-auto"
                onError={e => e.target.style.display='none'}
              />
            )}
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              {product ? 'Update' : 'Add'} Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
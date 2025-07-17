import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Package, 
  Warehouse, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings,
  X,
  Candy
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Package, label: 'Products', path: '/products' },
    { icon: Warehouse, label: 'Inventory', path: '/inventory' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 
        transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 bg-black bg-opacity-20">
          <div className="flex items-center space-x-2">
            <Candy className="h-8 w-8 text-pink-400" />
            <h1 className="text-xl font-bold text-white">Sweet Shop</h1>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-white hover:text-pink-400 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="mt-8 px-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-all duration-200 ${
                  isActive
                    ? 'bg-white bg-opacity-20 text-white shadow-lg'
                    : 'text-purple-200 hover:bg-white hover:bg-opacity-10 hover:text-white'
                }`
              }
              onClick={() => onClose()}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center">
            <p className="text-purple-200 text-sm">
              Sweet Shop Management
            </p>
            <p className="text-purple-300 text-xs mt-1">
              v1.0.0
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
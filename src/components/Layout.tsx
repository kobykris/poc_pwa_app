// src/components/Layout.tsx
import React, { useState } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // ไอคอน Hamburger และ X

const Layout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { name: 'หน้าแรก', path: '/' },
    { name: 'รายละเอียด', path: '/notification' },
    { name: 'ทดสอบ', path: '/debug' },
  ];

  return (
    <div className="relative min-h-screen bg-gray-100 font-sans">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-20 bg-white shadow-md h-16 flex items-center justify-between px-4">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-gray-700 p-2 rounded-full hover:bg-gray-200 transition-colors"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        <div className="flex items-center gap-2">
           {/* ใส่ Logo ของคุณที่นี่ */}
          <Link to="/" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
            <img src="/favicon.ico" className="h-8 w-8" alt="App Logo" />
            <span className="text-xl font-bold text-gray-800">PWA</span>
          </Link>
        </div>
        <div className="w-10"></div> {/* Spacer */}
      </header>

      {/* Collapsible Hamburger Menu */}
      <aside
        className={`fixed top-0 left-0 z-30 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">เมนู</h2>
          <button 
            onClick={() => setIsMenuOpen(false)} 
            className="p-2 rounded-full hover:bg-gray-200"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>
        <nav className="mt-4">
          <ul>
            {menuItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `block w-full px-4 py-3 text-left transition-colors ${
                      isActive
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      
      {/* Overlay for when menu is open */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}

      {/* Page Content */}
      <main className="pt-20 px-4 pb-4">
        <Outlet /> {/* <-- React Router จะ render page component ที่นี่ */}
      </main>
    </div>
  );
};

export default Layout;
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Menu, X, LogOut, Award } from 'lucide-react';

const Navbar = ({ score, user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isAdmin = location.pathname.startsWith('/admin');
  if (isAdmin) return null; // Admin has its own sidebar

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Verify', path: '/verify' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Officer Portal', path: '/admin/login' },
  ];

  return (
    <nav className="bg-[#021B79] text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-[#F5A623] fill-[#F5A623]/20" />
            <span className="text-xl font-bold tracking-tight">BIS Saathi</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === link.path ? 'text-[#F5A623]' : 'hover:text-[#F5A623]'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-4 border-l border-white/20 pl-6">
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="bg-white/10 px-3 py-1 rounded-full flex items-center space-x-2 border border-white/20">
                    <Award className="h-4 w-4 text-[#F5A623]" />
                    <span className="font-bold text-[#F5A623]">{score} pts</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Hi, {user.name.split(' ')[0]}</span>
                    <button 
                      onClick={onLogout}
                      className="p-1 hover:bg-white/10 rounded-full transition-colors"
                    >
                      <LogOut className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link to="/login" className="text-sm font-medium hover:text-[#F5A623]">Login</Link>
                  <Link 
                    to="/register" 
                    className="bg-[#F5A623] text-[#021B79] px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#FFB84D] transition-all"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-white/10"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#021B79] border-t border-white/10 pb-4">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-white/10"
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <>
                <div className="px-3 py-2 text-[#F5A623] font-bold">🏆 {score} pts</div>
                <button
                  onClick={() => { onLogout(); setIsOpen(false); }}
                  className="w-full text-left px-3 py-2 text-base font-medium hover:bg-white/10"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2 p-3">
                <Link to="/login" onClick={() => setIsOpen(false)} className="px-3 py-2 text-base font-medium">Login</Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="bg-[#F5A623] text-[#021B79] px-4 py-2 rounded-lg font-bold text-center">Register</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

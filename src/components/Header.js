import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, logout, openLogin, openRegister } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-secondary-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg overflow-hidden bg-white/10">
              <img 
                src="/logo.jpg" 
                alt="Cyberciaforge Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-white">CyberCiaForge</span>
              <span className="text-xs text-secondary-400 -mt-1">Security Training</span>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-secondary-300 hover:text-white font-medium transition-colors">
              Home
            </a>
            <a href="#tracks" className="text-secondary-300 hover:text-white font-medium transition-colors">
              Courses
            </a>
            <a href="#assistant" className="text-secondary-300 hover:text-white font-medium transition-colors">
              AI Assistant
            </a>
            <a href="#labs" className="text-secondary-300 hover:text-white font-medium transition-colors">
              Labs
            </a>
          </nav>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                <div className="hidden md:flex items-center space-x-3">
                  <span className="text-sm text-secondary-300">{currentUser.email}</span>
                  <button 
                    onClick={() => logout()} 
                    className="text-sm text-secondary-400 hover:text-white font-medium"
                  >
                    Sign out
                  </button>
                </div>
              </>
            ) : (
              <>
                <button 
                  onClick={openLogin} 
                  className="text-sm font-medium text-secondary-300 hover:text-white transition-colors"
                >
                  Sign in
                </button>
                <button 
                  onClick={openRegister} 
                  className="btn-primary text-sm"
                >
                  Get started
                </button>
              </>
            )}
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 text-secondary-400 hover:text-secondary-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M6 18h12"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-secondary-200 bg-white">
          <div className="px-4 py-4 space-y-3">
            <a href="#home" className="block text-secondary-600 hover:text-primary-600 font-medium py-2">
              Home
            </a>
            <a href="#tracks" className="block text-secondary-600 hover:text-primary-600 font-medium py-2">
              Courses
            </a>
            <a href="#assistant" className="block text-secondary-600 hover:text-primary-600 font-medium py-2">
              AI Assistant
            </a>
            <a href="#labs" className="block text-secondary-600 hover:text-primary-600 font-medium py-2">
              Labs
            </a>
            
            {/* Mobile auth */}
            {currentUser ? (
              <div className="pt-4 border-t border-secondary-200">
                <div className="text-sm text-secondary-600 mb-2">{currentUser.email}</div>
                <button 
                  onClick={() => logout()} 
                  className="text-sm text-secondary-500 hover:text-secondary-700"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-secondary-200 space-y-3">
                <button 
                  onClick={openLogin} 
                  className="block w-full text-left text-secondary-600 font-medium py-2"
                >
                  Sign in
                </button>
                <button 
                  onClick={openRegister} 
                  className="btn-primary w-full justify-center"
                >
                  Get started
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
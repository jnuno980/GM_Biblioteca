import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
<<<<<<< HEAD
import { Menu, X, BookOpen, Building, User, Tag, MapPin } from 'lucide-react';
=======
import { Menu, X, BookOpen, Users, Library, FileText, Building, User, Tag, MapPin } from 'lucide-react';
>>>>>>> cdde7e74c145f3a7e1d3f77290ab03c7b8100859

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();


  const catalogItems = [
    { name: 'Editoras', href: '/editoras', icon: Building },
    { name: 'Autores', href: '/autores', icon: User },
    { name: 'Géneros', href: '/generos', icon: Tag },
    { name: 'Códigos Postais', href: '/codigos-postais', icon: MapPin },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const NavLink = ({ href, children, className = '' }) => (
    <Link
      to={href}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive(href)
          ? 'bg-red-900 text-white'
          : 'text-gray-300 hover:bg-red-800 hover:text-white'
      } ${className}`}
      onClick={() => setIsOpen(false)}
    >
      {children}
    </Link>
  );

  return (
    <nav className="bg-red-900 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-white font-bold text-xl">
            <BookOpen className="h-6 w-6" />
            <span>Biblioteca GM</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink href="/">Início</NavLink>
            
            {/* Catalog Dropdown */}
            <div className="relative group">
              <button className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-red-800 hover:text-white transition-colors">
                Catálogo
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-1">
                  {catalogItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <item.icon className="h-4 w-4 mr-2" />
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <NavLink href="/livros">Livros</NavLink>
            <NavLink href="/exemplares">Exemplares</NavLink>
            <NavLink href="/utentes">Utentes</NavLink>
            <NavLink href="/requisicoes">Requisições</NavLink>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none focus:text-white"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-red-800 rounded-md mt-2">
              <NavLink href="/" className="block">Início</NavLink>
              
              <div className="text-gray-300 px-3 py-2 text-sm font-medium">
                Catálogo
              </div>
              {catalogItems.map((item) => (
                <NavLink key={item.name} href={item.href} className="block pl-6">
                  <item.icon className="h-4 w-4 inline mr-2" />
                  {item.name}
                </NavLink>
              ))}
              
              <NavLink href="/livros" className="block">Livros</NavLink>
              <NavLink href="/exemplares" className="block">Exemplares</NavLink>
              <NavLink href="/utentes" className="block">Utentes</NavLink>
              <NavLink href="/requisicoes" className="block">Requisições</NavLink>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;



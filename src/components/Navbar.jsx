import { Menu, X, Home, ShoppingCart, Layers, HelpCircle, CreditCard } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { cld } from '../utils/cloudinary'
const logo = 'https://res.cloudinary.com/djdbcoyot/image/upload/v1781776847/zfp64sddl6r4e7stmelk.png'
import { useCart } from '../context/CartContext'
import { createPortal } from 'react-dom'
import { products } from '../data/products'
const searchIcon = cld('search', { width: 48 })

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCollections, setShowCollections] = useState(false);
  const navigate = useNavigate();
  const cart = useCart();

  // DesktopSearch component inlined to keep Navbar self-contained
  function DesktopSearch() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const searchRef = useRef(null)
    const dropdownRef = useRef(null)
    const [coords, setCoords] = useState(null)

    const onChange = (e) => {
      const v = e.target.value
      setQuery(v)
      const q = String(v || '').trim().toLowerCase()
      if (!q) {
        setResults([])
        setCoords(null)
        return
      }
      const filtered = products.filter(p => String(p.title || '').toLowerCase().includes(q)).slice(0, 6)
      setResults(filtered)
      try {
        const el = searchRef.current
        if (el) {
          const r = el.getBoundingClientRect()
          setCoords({ top: r.bottom, left: r.left, width: r.width })
        }
      } catch { setCoords(null) }
    }

    const onSelect = (p) => {
      setQuery('')
      setResults([])
      setCoords(null)
      navigate(`/product/${p.id}`)
    }

    useEffect(() => {
      const onDocClick = (e) => {
        const t = e.target
        if (searchRef.current && searchRef.current.contains(t)) return
        if (dropdownRef.current && dropdownRef.current.contains(t)) return
        setResults([])
        setCoords(null)
      }
      const onKey = (e) => {
        if (e.key === 'Escape') {
          setResults([])
          setCoords(null)
        }
      }
      document.addEventListener('mousedown', onDocClick)
      document.addEventListener('touchstart', onDocClick)
      document.addEventListener('keydown', onKey)
      return () => {
        document.removeEventListener('mousedown', onDocClick)
        document.removeEventListener('touchstart', onDocClick)
        document.removeEventListener('keydown', onKey)
      }
    }, [])

    return (
      <>
        <div ref={searchRef} className="ml-3 w-full flex items-center gap-2" style={{ background: '#f5f5f5', borderRadius: 999, padding: '8px 14px' }}>
          <svg xmlns="http://www.w3.org/2000/svg" style={{ width: 16, height: 16, color: '#9ca3af', flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 16.65z" />
          </svg>
          <input
            value={query}
            onChange={onChange}
            className="bg-transparent w-full outline-none"
            style={{ fontSize: 14, color: '#111827', fontWeight: 400, letterSpacing: '0.01em' }}
            placeholder="Search products..."
          />
          <kbd style={{ fontSize: 11, color: '#9ca3af', background: '#e5e5e5', borderRadius: 4, padding: '2px 6px', fontFamily: 'inherit', lineHeight: '1.4', flexShrink: 0, fontWeight: 500 }}>⌘K</kbd>
        </div>
        {results && results.length > 0 && coords && createPortal(
          <div ref={dropdownRef} style={{ position: 'fixed', top: coords.top + 4 + 'px', left: coords.left + 'px', width: coords.width + 'px', border: '1px solid #e5e7eb', boxShadow: '0 12px 32px rgba(0,0,0,0.1)' }} className="bg-white rounded-xl shadow-lg max-h-80 overflow-auto z-[4000]">
            {results.map(r => (
              <button key={r.id} onClick={() => onSelect(r)} className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0" style={{ transition: 'background 0.15s ease' }}>
                <img src={r.image} alt={r.title} className="w-12 h-12 object-cover rounded-lg" width="48" height="48" loading="eager" fetchPriority="high" decoding="async" style={{ borderRadius: 8 }} />
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-900">{r.title}</div>
                  <div className="text-xs text-gray-500" style={{ marginTop: 2 }}>NGN {Number(r.price).toLocaleString()}</div>
                </div>
              </button>
            ))}
          </div>
        , document.body)}
      </>
    )
  }
  const mobileNavItems = [
    { path: '/home', label: 'Home', Icon: Home },
    { path: '/shop', label: 'Shop', Icon: ShoppingCart },
    { path: '/collections', label: 'Collections', Icon: Layers },
    { path: '/faq', label: 'FAQ', Icon: HelpCircle },
    { path: '/checkout', label: `Checkout (${cart.count || 0})`, Icon: CreditCard },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 w-full text-black pt-3"
      style={{
        backgroundColor: 'white',
      }}
    >
      <div className="relative max-w-7xl mx-auto px-4 py-6 flex items-center md:px-20">
        {/* Mobile Menu Toggle */}
        <button className="md:hidden z-20 flex-shrink-0" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu" aria-expanded={isOpen} aria-controls="mobile-menu">
          {isOpen ? <X /> : <Menu />}
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center flex-shrink-0 absolute left-1/2 transform -translate-x-1/2 md:static md:transform-none md:mr-6 lg:mr-10 z-10">
          <img src={logo} alt="Logo" className="h-10 md:h-11 lg:h-12 w-auto" width="48" height="48" loading="eager" fetchPriority="high" decoding="sync" style={{objectFit: 'contain'}} />
        </Link>

        {/* Search (desktop only) */}
        <div className="hidden md:flex items-center flex-1 justify-center md:mx-4 lg:mx-8">
          <div className="w-full max-w-xs lg:max-w-md xl:max-w-lg relative">
            <DesktopSearch />
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2 flex-shrink-0 md:ml-4 lg:ml-8">
          {['/home', '/shop', '/collections', '/faq', '/checkout'].map((path) => {
            const labelMap = {
              '/home': 'Home',
              '/shop': 'Shop',
              '/collections': 'Collections',
              '/faq': 'FAQ',
              '/checkout': 'Checkout',
            };
            const label = labelMap[path];
            const commonClasses = "relative inline-block text-sm lg:text-base font-normal text-gray-700 transition-colors duration-200 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-gray-900 after:transition-all after:duration-300 hover:after:w-full hover:text-gray-900";
            if (path === '/collections') {
              return (
                <button
                  key={path}
                  onClick={(e) => { e.preventDefault(); setShowCollections(true); }}
                  className={`${commonClasses} px-3 py-2`}
                  aria-haspopup="dialog"
                >
                  {label}
                </button>
              );
            }
            return (
              <NavLink
                key={path}
                to={path}
                end={path === '/home' || path === '/checkout'}
                className={({ isActive }) => isActive
                  ? 'relative inline-flex items-center text-sm lg:text-base font-medium text-white bg-gray-900 px-5 py-2 mr-2 rounded-r-lg'
                  : 'relative inline-block text-sm lg:text-base font-normal text-gray-700 px-3 py-2 transition-colors duration-200 after:content-[""] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-gray-900 after:transition-all after:duration-300 hover:after:w-full hover:text-gray-900'}
              >
                {label}
              </NavLink>
            );
          })}
        </nav>

        {/* Cart Icon (always visible) */}
        <button onClick={(e) => { e.preventDefault(); navigate('/checkout'); }} className="flex items-center justify-center flex-shrink-0 ml-auto md:ml-4 lg:ml-6 relative z-20" aria-label="Go to checkout">
          <div id="cart-icon" className="relative inline-flex items-center justify-center h-9 w-9 md:h-10 md:w-10 lg:h-11 lg:w-11 rounded-full hover:bg-gray-100 transition-colors duration-200">
            <ShoppingCart size={18} className="md:w-[19px] md:h-[19px] lg:w-5 lg:h-5 text-black" />
            <span className="absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1 bg-red-500 text-white text-[10px] md:text-xs min-w-[18px] md:min-w-[20px] h-[18px] md:h-[20px] rounded-full flex items-center justify-center px-1 font-medium shadow-sm">{cart.count || 0}</span>
          </div>
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden fixed inset-0 z-30 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto bg-black/20 backdrop-blur-sm' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
        aria-hidden={!isOpen}
        style={{ backdropFilter: isOpen ? 'blur(6px)' : 'none' }}
      />

      <nav
        id="mobile-menu"
        className={`md:hidden fixed top-0 left-0 h-full w-57 pt-6 rounded-r-2xl shadow-lg transform origin-left transition-transform duration-600 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} z-40 flex flex-col`}
        aria-hidden={!isOpen}
        role="navigation"
        style={{ backgroundColor: 'white' }}
      >
        <div className="px-6 pt-6 pb-4 border-b border-gray-200">
          <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="h-10 w-auto mb-3" width="40" height="40" loading="eager" fetchPriority="high" decoding="sync" style={{objectFit: 'contain'}} />
          </Link>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="divide-y divide-gray-100">
            {mobileNavItems.map(({ path, label, Icon }) => {
              if (path === '/checkout') {
                return (
                  <NavLink
                    key={path}
                    to={path}
                    end
                    onClick={() => setIsOpen(false)}
                    style={({ isActive }) => ({
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px 24px',
                      color: isActive ? '#ffffff' : '#1f2937',
                      backgroundColor: isActive ? '#111827' : 'transparent',
                      textDecoration: 'none',
                    })}
                    onMouseEnter={e => {
                      if (e.currentTarget.style.backgroundColor !== 'rgb(17, 24, 39)') {
                        e.currentTarget.style.backgroundColor = '#f9fafb'
                      }
                    }}
                    onMouseLeave={e => {
                      if (e.currentTarget.style.backgroundColor !== 'rgb(17, 24, 39)') {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }
                    }}
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-4">
                          <CreditCard size={18} style={{ color: isActive ? '#ffffff' : '#4b5563' }} />
                          <span>{label.replace(/ \(\d+\)/, '')}</span>
                        </div>
                        {(cart.count || 0) > 0 && (
                          <span className="bg-red-500 text-white text-[10px] min-w-[16px] h-[16px] rounded-full flex items-center justify-center px-0.5 font-medium shadow-sm">{cart.count || 0}</span>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              }
              if (path === '/collections') {
                return (
                  <button
                    key={path}
                    onClick={(e) => {
                      e.preventDefault();
                      setIsOpen(false);
                      setShowCollections(true);
                    }}
                    className={`flex items-center gap-4 px-6 py-4 text-gray-800 hover:bg-gray-50`}
                    aria-haspopup="dialog"
                  >
                    <Icon size={18} className="text-gray-600" />
                    <span>{label}</span>
                  </button>
                );
              }

              return (
                <NavLink
                  key={path}
                  to={path}
                  onClick={() => setIsOpen(false)}
                >
                  {({ isActive }) => (
                    <div className={`flex items-center gap-4 px-6 py-4 ${isActive ? 'text-white bg-gray-900' : 'text-gray-800 hover:bg-gray-50'}`}>
                      <Icon size={18} className={isActive ? 'text-white' : 'text-gray-600'} />
                      <span>{label}</span>
                    </div>
                  )}
                </NavLink>
              );
            })}
          </div>

        </div>
      </nav>

      {/* Collections modal */}
      {showCollections && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowCollections(false)} aria-hidden="true" />

          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 z-10 p-6" role="dialog" aria-modal="true" aria-labelledby="collections-title">
            <div className="flex justify-between items-start">
              <div className="text-center w-full">
                <h2 id="collections-title" className="text-xl font-bold">Coming Soon</h2>
                <p className="text-sm text-gray-600 mt-2">We're working on something amazing. Stay tuned</p>
              </div>
              <button onClick={() => setShowCollections(false)} className="text-gray-500 hover:text-gray-700 ml-4" aria-label="Close">
                <X />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
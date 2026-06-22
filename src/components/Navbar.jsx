import { Menu, X, Home, ShoppingCart, Layers, HelpCircle, CreditCard } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { cld } from '../utils/cloudinary'
const logo = 'https://res.cloudinary.com/djdbcoyot/image/upload/v1781776847/zfp64sddl6r4e7stmelk.png'
import { useCart } from '../context/CartContext'
import { createPortal } from 'react-dom'
import { products } from '../data/products'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCollections, setShowCollections] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
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
        <div ref={searchRef} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f9fafb', borderRadius: 8, border: '1px solid #e5e7eb', padding: '8px 12px', transition: 'all 0.15s ease' }}>
          <svg xmlns="http://www.w3.org/2000/svg" style={{ width: 15, height: 15, color: '#d1d5db', flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 16.65z" />
          </svg>
          <input
            value={query}
            onChange={onChange}
            className="bg-transparent w-full outline-none"
            style={{ fontSize: 13, color: '#111827', fontWeight: 400 }}
            placeholder="Search products..."
          />
          <kbd style={{ fontSize: 10, color: '#d1d5db', background: '#f3f4f6', borderRadius: 4, padding: '2px 5px', fontFamily: 'inherit', lineHeight: '1.4', flexShrink: 0, fontWeight: 500, border: '1px solid #e5e7eb' }}>⌘K</kbd>
        </div>
        {results && results.length > 0 && coords && createPortal(
          <div ref={dropdownRef} className="search-dropdown" style={{ position: 'fixed', top: coords.top + 4 + 'px', left: coords.left + 'px', width: coords.width + 'px', border: '1px solid #e5e7eb', boxShadow: '0 12px 32px rgba(0,0,0,0.1)' }}>
            <style>{`
              .search-dropdown {
                border-radius: 12px;
                background: #ffffff;
                max-height: 320px;
                overflow: auto;
                z-index: 4000;
              }
              @media (min-width: 640px) and (max-width: 767px) {
                .search-dropdown {
                  width: 480px !important;
                  left: calc(50% - 240px) !important;
                }
              }
              @media (min-width: 768px) {
                .search-dropdown {
                  width: 520px !important;
                  left: calc(50% - 260px) !important;
                }
              }
              @media (min-width: 1024px) {
                .search-dropdown {
                  width: 600px !important;
                  left: calc(50% - 300px) !important;
                }
              }
            `}</style>
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

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 w-full"
      style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #f3f4f6',
      }}
    >
      <div className="relative max-w-7xl mx-auto flex items-center justify-between navbar-inner" style={{ height: 64 }}>
        <style>{`
          .navbar-inner {
            padding-left: 24px;
            padding-right: 24px;
          }
          @media (min-width: 640px) and (max-width: 767px) {
            .navbar-inner {
              padding-left: 48px !important;
              padding-right: 48px !important;
            }
          }
          @media (min-width: 768px) {
            .navbar-inner {
              padding-left: 40px;
              padding-right: 40px;
            }
          }
          @media (min-width: 1024px) {
            .navbar-inner {
              padding-left: 64px;
              padding-right: 64px;
            }
          }
        `}</style>
        {/* Mobile Menu Toggle */}
        <button className="md:hidden z-20 flex-shrink-0" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu" aria-expanded={isOpen} aria-controls="mobile-menu" style={{ padding: 8, borderRadius: 8, background: 'transparent', border: 'none', cursor: 'pointer', color: '#111827' }}>
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center flex-shrink-0 absolute left-1/2 transform -translate-x-1/2 md:static md:transform-none z-10">
          <img src={logo} alt="Logo" style={{ height: 32, width: 'auto' }} width="48" height="48" loading="eager" fetchPriority="high" decoding="sync" />
        </Link>

        {/* Search (desktop only) */}
        <div className="hidden md:flex items-center flex-1 justify-center search-wrapper" style={{ margin: '0 24px' }}>
          <style>{`
            .search-wrapper {
              max-width: 320px;
            }
            @media (min-width: 640px) and (max-width: 767px) {
              .search-wrapper {
                max-width: 400px !important;
              }
            }
            @media (min-width: 768px) {
              .search-wrapper {
                max-width: 400px !important;
              }
            }
            @media (min-width: 1024px) {
              .search-wrapper {
                max-width: 480px !important;
              }
            }
          `}</style>
          <DesktopSearch />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {['/home', '/shop', '/collections', '/faq', '/checkout'].map((path) => {
            const labelMap = {
              '/home': 'Home',
              '/shop': 'Shop',
              '/collections': 'Collections',
              '/faq': 'FAQ',
              '/checkout': 'Checkout',
            };
            const label = labelMap[path];
            if (path === '/collections') {
              return (
                <button
                  key={path}
                  onClick={(e) => { e.preventDefault(); setShowCollections(true); }}
                  style={{
                    padding: '6px 12px',
                    fontSize: 13,
                    fontWeight: 500,
                    color: '#374151',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'color 0.15s ease',
                    letterSpacing: '0.01em',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#111827'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#374151'; }}
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
                style={({ isActive }) => ({
                  padding: '6px 12px',
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#111827' : '#374151',
                  background: 'transparent',
                  textDecoration: 'none',
                  fontFamily: 'inherit',
                  transition: 'color 0.15s ease',
                  letterSpacing: '0.01em',
                  borderBottom: isActive ? '2px solid #111827' : '2px solid transparent',
                })}
              >
                {label}
              </NavLink>
            );
          })}
        </nav>

        {/* Cart Icon (always visible) */}
        <button id="cart-icon" onClick={(e) => { e.preventDefault(); navigate('/checkout'); }} className="flex items-center justify-center flex-shrink-0 relative z-20" aria-label="Go to checkout" style={{ padding: 8, borderRadius: 8, background: 'transparent', border: 'none', cursor: 'pointer' }}>
          <div className="relative inline-flex items-center justify-center" style={{ width: 32, height: 32 }}>
            <ShoppingCart size={17} style={{ color: '#111827' }} />
            <span style={{
              position: 'absolute',
              top: -2,
              right: -4,
              background: '#ef4444',
              color: '#ffffff',
              fontSize: 9,
              fontWeight: 600,
              minWidth: 16,
              height: 16,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 3px',
              boxShadow: '0 1px 3px rgba(239,68,68,0.3)',
            }}>{cart.count || 0}</span>
          </div>
        </button>
      </div>

      {/* Mobile overlay */}
      <div
        className={`md:hidden fixed inset-0 z-30 transition-all duration-300 ease-out ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
        aria-hidden={!isOpen}
        style={{
          background: isOpen ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0)',
          backdropFilter: isOpen ? 'blur(8px)' : 'blur(0px)',
          WebkitBackdropFilter: isOpen ? 'blur(8px)' : 'blur(0px)',
        }}
      />

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`md:hidden fixed top-0 left-0 h-full z-40 flex flex-col ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        aria-hidden={!isOpen}
        role="navigation"
        style={{
          width: 280,
          backgroundColor: '#ffffff',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
          boxShadow: isOpen ? '4px 0 24px rgba(0,0,0,0.08)' : 'none',
        }}
      >
        {/* Header */}
        <div style={{ padding: '24px 24px 16px', borderBottom: '1px solid #f3f4f6' }}>
          <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center">
            <img src={logo} alt="Logo" style={{ height: 30, width: 'auto' }} />
          </Link>
        </div>

        {/* Nav items */}
        <div style={{ flex: 1, overflow: 'auto', padding: '12px 12px' }}>
          {[
            { path: '/home', label: 'Home', Icon: Home },
            { path: '/shop', label: 'Shop', Icon: ShoppingCart },
            { path: '/collections', label: 'Collections', Icon: Layers, isCollections: true },
            { path: '/faq', label: 'FAQ', Icon: HelpCircle },
            { path: '/checkout', label: 'Checkout', Icon: CreditCard },
          ].map(({ path, label, Icon, isCollections }, index) => {
            const isActive = location.pathname === path
            return (
              <Link
                key={path}
                to={isCollections ? '#' : path}
                onClick={(e) => {
                  if (isCollections) {
                    e.preventDefault();
                    setIsOpen(false);
                    setShowCollections(true);
                  } else {
                    setIsOpen(false);
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 14px',
                  marginBottom: 2,
                  borderRadius: 10,
                  color: isActive ? '#111827' : '#374151',
                  backgroundColor: isActive ? '#f3f4f6' : 'transparent',
                  textDecoration: 'none',
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 450,
                  transition: 'all 0.2s ease',
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen ? 'translateY(0)' : 'translateY(8px)',
                  transitionDelay: `${index * 0.04}s`,
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <Icon size={16} style={{ color: isActive ? '#111827' : '#9ca3af', flexShrink: 0 }} />
                <span style={{ flex: 1 }}>{label}</span>
                {path === '/checkout' && (cart.count || 0) > 0 && (
                  <span style={{
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    fontSize: 10,
                    fontWeight: 600,
                    minWidth: 18,
                    height: 18,
                    borderRadius: 9,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 5px',
                  }}>
                    {cart.count}
                  </span>
                )}
              </Link>
            )
          })}
        </div>

        {/* Bottom */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid #f3f4f6' }}>
          <Link
            to="/collections"
            onClick={(e) => { e.preventDefault(); setIsOpen(false); setShowCollections(true); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 14px',
              borderRadius: 10,
              color: '#6b7280',
              textDecoration: 'none',
              fontSize: 13,
              fontWeight: 500,
              backgroundColor: '#f9fafb',
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f3f4f6'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#f9fafb'; }}
          >
            <Layers size={15} />
            <span>Collections</span>
            <span style={{ marginLeft: 'auto', fontSize: 11, color: '#9ca3af' }}>Coming Soon</span>
          </Link>
        </div>
      </div>

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
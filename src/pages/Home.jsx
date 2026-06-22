import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPortal } from 'react-dom'
import NewArrival from './NewArrival'
import Footer from './Footer'
import { products } from '../data/products'
import { cld } from '../utils/cloudinary'
// Hero images served via Cloudinary CDN
const em1 = cld('em1', { width: 1024 })
const em2 = cld('em2', { width: 1024 })
const em4 = cld('em4', { width: 1024 })
const em5 = cld('em5', { width: 1024 })
const em6 = cld('em6', { width: 1024 })
const searchIcon = cld('search', { width: 48 })

const Carousel = () => {
  const slides = [
    { id: 0, title: 'trucker caps ', subtitle: 'Style & Comfort For Every Head' },
    { id: 1, title: 'camouflage caps', subtitle: 'Bold Style & Street Attitude' },
    { id: 2, title: 'beanies', subtitle: 'Style & Comfort Fornose' },
    { id: 3, title: 'head warmers', subtitle: 'Warm Comfort & Bold Vibes' },
    { id: 4, title: 'Accessories', subtitle: 'Confidence & Comfort' },
  ]
  const [index, setIndex] = useState(0)
  const [autoplay] = useState(true)
  const navigate = useNavigate()

  const prev = () => setIndex(i => (i - 1 + slides.length) % slides.length)
  const next = () => setIndex(i => (i + 1) % slides.length)
  const goTo = (i) => setIndex(i)

  useEffect(() => {
    if (!autoplay) return
    const id = setInterval(() => {
      setIndex(i => (i + 1) % slides.length)
    }, 3000)
    return () => clearInterval(id)
  }, [autoplay, slides.length])

  return (
    <>
      {/* Mobile carousel */}
      <div className="w-full overflow-hidden relative md:hidden" style={{ marginTop: 12 }}>
        <div className="flex" style={{ animation: 'scrollTicker 30s linear infinite', width: 'max-content' }}>
          {[...slides, ...slides].map((s, i) => {
            const img = i % 5 === 0 ? em1 : i % 5 === 1 ? em2 : i % 5 === 2 ? em4 : i % 5 === 3 ? em5 : em6
            // Alternate text alignment per slide
            const isLeft = i % 2 === 0
            return (
              <div key={i} className="flex-shrink-0 relative" style={{ maxHeight: '380px', height: 'auto' }}>
                <img
                  src={img}
                  alt={s.title}
                  style={{ display: 'block', width: 'auto', height: 'auto', maxWidth: '100%', maxHeight: '380px' }}
                  loading="eager"
                  fetchPriority="high"
                  decoding="sync"
                  aria-hidden="true"
                />
                {/* Full dim overlay for readability */}
                <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.40)', pointerEvents: 'none' }} />
                {/* Extra dark gradient at bottom */}
                <div className="absolute bottom-0 left-0 right-0" style={{ height: '50%', background: 'linear-gradient(to top, rgba(0,0,0,0.60), transparent)', pointerEvents: 'none' }} />
                {/* Content - alternating positions */}
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: isLeft ? 'flex-end' : 'center', alignItems: isLeft ? 'flex-start' : 'center', padding: isLeft ? '20px 16px' : '0 16px', pointerEvents: 'none' }}>
                  <div style={{ maxWidth: '90%' }}>
                    <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)', borderRadius: 999, padding: '3px 10px', fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', color: '#ffffff', textTransform: 'uppercase', marginBottom: 6 }}>New Collection</span>
                    <h3 style={{ color: '#ffffff', fontSize: 17, fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.15, textShadow: '0 2px 12px rgba(0,0,0,0.6)', textTransform: 'uppercase' }}>
                      {s.title.trim()}
                    </h3>
                    <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 12, marginTop: 4, letterSpacing: '0.01em', textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}>
                      {s.subtitle}
                    </p>
                    <button
                      onClick={() => navigate('/shop')}
                      style={{ marginTop: 10, padding: '8px 20px', background: '#111827', color: '#ffffff', fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', borderRadius: 999, border: 'none', cursor: 'pointer', pointerEvents: 'auto', boxShadow: '0 4px 14px rgba(0,0,0,0.2)', transition: 'transform 0.15s ease, box-shadow 0.15s ease' }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px) scale(1.03)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)' }}
                      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.2)' }}
                    >
                      Shop Now
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Desktop/Tablet carousel */}
      <div className="hidden md:block w-full overflow-hidden relative" style={{ margin: '0 auto' }}>
        <div className="flex" style={{ animation: 'scrollTicker 40s linear infinite', width: 'max-content' }}>
          {[...slides, ...slides].map((s, i) => {
            const img = i % 5 === 0 ? em1 : i % 5 === 1 ? em2 : i % 5 === 2 ? em4 : i % 5 === 3 ? em5 : em6
            // Alternate text alignment per slide
            const isLeft = i % 2 === 0
            const isCenter = i % 3 === 1
            return (
              <div key={i} className="flex-shrink-0 relative md:max-h-[420px] lg:max-h-[520px]" style={{ height: 'auto' }}>
                <img
                  src={img}
                  alt={s.title}
                  className="md:max-h-[420px] lg:max-h-[520px]"
                  style={{ display: 'block', width: 'auto', height: 'auto', maxWidth: '100%' }}
                  loading="eager"
                  fetchPriority="high"
                  decoding="sync"
                  aria-hidden="true"
                />
                {/* Full dim overlay for readability */}
                <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.35)', pointerEvents: 'none' }} />
                {/* Extra dark gradient at bottom */}
                <div className="absolute bottom-0 left-0 right-0" style={{ height: '50%', background: 'linear-gradient(to top, rgba(0,0,0,0.55), transparent)', pointerEvents: 'none' }} />
                {/* Content - varied positioning */}
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: isCenter ? 'center' : 'flex-end', alignItems: isLeft ? 'flex-start' : 'center', padding: isLeft ? '28px 24px' : isCenter ? '0 24px' : '28px 24px', pointerEvents: 'none' }}>
                  <div style={{ maxWidth: isCenter ? '70%' : '85%' }}>
                    <span className="text-[10px] md:text-[11px] lg:text-[12px]" style={{ display: 'inline-block', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(6px)', borderRadius: 999, padding: '4px 12px', fontWeight: 600, letterSpacing: '0.08em', color: '#ffffff', textTransform: 'uppercase', marginBottom: 8 }}>New Collection</span>
                    <h3 style={{ color: '#ffffff', fontSize: isCenter ? 'clamp(22px, 3vw, 32px)' : 'clamp(20px, 2.5vw, 28px)', fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.15, textShadow: '0 3px 16px rgba(0,0,0,0.6)', textAlign: isCenter ? 'center' : isLeft ? 'left' : 'center', textTransform: 'uppercase' }}>
                      {s.title.trim()}
                    </h3>
                    <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 'clamp(13px, 1.5vw, 16px)', marginTop: 5, letterSpacing: '0.01em', textShadow: '0 1px 10px rgba(0,0,0,0.5)', textAlign: isCenter ? 'center' : isLeft ? 'left' : 'center' }}>
                      {s.subtitle}
                    </p>
                    <button
                      onClick={() => navigate('/shop')}
                      style={{ marginTop: 14, padding: '10px 26px', background: '#111827', color: '#ffffff', fontSize: 'clamp(11px, 1.2vw, 13px)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', borderRadius: 999, border: 'none', cursor: 'pointer', pointerEvents: 'auto', boxShadow: '0 4px 16px rgba(0,0,0,0.2)', transition: 'transform 0.15s ease, box-shadow 0.15s ease' }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.04)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)' }}
                      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)' }}
                    >
                      Shop Now
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

const Home = () => {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const searchRef = useRef(null)
  const dropdownRef = useRef(null)
  const [coords, setCoords] = useState(null)

  // mount animation state (top -> bottom slide in)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // respect user preference for reduced motion
    try {
      if (window && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setMounted(true)
        return
      }
    } catch (err) { /* ignore */ }
    const raf = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(raf)
  }, [])

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
    // compute position for portal dropdown
    try {
      const el = searchRef.current
      if (el) {
        const r = el.getBoundingClientRect()
        setCoords({ top: r.bottom, left: r.left, width: r.width })
      }
    } catch {
      setCoords(null)
    }
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

  // Preload hero carousel background images and warm up the browser image cache
  useEffect(() => {
    const imgs = [em1, em2, em4, em5, em6];
    const links = [];
    imgs.forEach(src => {
      if (!src) return;
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      link.setAttribute('fetchpriority', 'high');
      document.head.appendChild(link);
      links.push(link);
      const i = new Image();
      i.src = src;
      i.decoding = 'sync';
    });
    return () => {
      links.forEach(l => l.parentNode && l.parentNode.removeChild(l));
    };
  }, []);

  return (
    <>
      <section
        className={`min-h-110 pt-7 md:pt-20 -mt-4 transition-transform transition-opacity duration-700 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}
        style={{ backgroundColor: 'white' }}
      >
        {/* Hero content moved above the background image */}
        {/* Mobile search */}
        <div className="w-full px-4 flex justify-center md:hidden mt-2">
          <div ref={searchRef} className="w-full max-w-md relative" style={{ maxWidth: 400 }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#d1d5db', pointerEvents: 'none' }}>
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              value={query}
              onChange={onChange}
              id="mobile-search"
              placeholder="Search products..."
              style={{
                width: '100%',
                padding: '11px 14px 11px 40px',
                borderRadius: 8,
                border: '1px solid #e5e7eb',
                background: '#f9fafb',
                color: '#111827',
                fontSize: 14,
                outline: 'none',
                transition: 'all 0.15s ease',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#9ca3af';
                e.target.style.background = '#ffffff';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.background = '#f9fafb';
              }}
            />
          </div>
        </div>
        <main>
          <Carousel />
        </main>
        {results && results.length > 0 && coords && createPortal(
          <div ref={dropdownRef} style={{ position: 'fixed', top: coords.top + 'px', left: coords.left + 'px', width: coords.width + 'px' }} className="bg-white rounded-lg shadow-lg max-h-64 overflow-auto z-[4000]">
            {results.map(r => (
              <button key={r.id} onClick={() => onSelect(r)} className="w-full flex items-center gap-3 p-2 hover:bg-gray-100">
                <img src={r.image} alt={r.title} className="w-12 h-12 object-cover rounded" width="48" height="48" loading="eager" fetchPriority="high" decoding="async" />
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-800">{r.title}</div>
                  <div className="text-xs text-gray-500">NGN {Number(r.price).toLocaleString()}</div>
                </div>
              </button>
            ))}
          </div>
        , document.body)}
      </section>
      <div className="md:mt-10 lg:mt-16 mt-7">
        <NewArrival />
      </div>
      <Footer />
    </>
  );
};

export default Home;

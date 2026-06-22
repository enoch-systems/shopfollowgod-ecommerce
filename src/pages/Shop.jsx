import React, { useState, useMemo, useRef, useEffect } from "react";
import { useCart } from '../context/CartContext'

import { products } from '../data/products'
import { cld } from '../utils/cloudinary'
const soldBadge = cld('soldout', { width: 200 })
import { Link } from 'react-router-dom'
import MountReveal from '../components/MountReveal'
import { ChevronLeft, ChevronRight, Home, ShoppingCart, ShoppingBag, Tag } from 'lucide-react'
import MobileBottomNav from '../components/MobileBottomNav'

// cache preloaded image urls so we don't create duplicate Image objects
const preloadedImages = new Set()

const StarRow = ({ rating = 5 }) => {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className="text-yellow-400 text-sm mt-2 flex items-center justify-center">
      {Array.from({ length: full }).map((_, i) => (
        <span key={i}>★</span>
      ))}
      {half && <span>☆</span>}
    </div>
  );
};

const Shop = () => {
  const cart = useCart()
  const [showComingSoon, setShowComingSoon] = useState(false)
  // temporary added state per product for visual feedback after clicking Add to cart
  const [addedIds, setAddedIds] = useState(() => new Set())
  const addedTimers = useRef({})
  const productsRef = useRef(null)

  const scrollToTop = () => {
    if (productsRef.current) {
      productsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    return () => {
      const timers = addedTimers.current || {}
      Object.values(timers).forEach(t => clearTimeout(t))
      addedTimers.current = {}
    }
  }, [])

  const markAdded = (id, duration = 1500) => {
    setAddedIds(prev => {
      const s = new Set(prev)
      s.add(id)
      return s
    })
    if (addedTimers.current[id]) clearTimeout(addedTimers.current[id])
    addedTimers.current[id] = setTimeout(() => {
      setAddedIds(prev => {
        const s = new Set(prev)
        s.delete(id)
        return s
      })
      delete addedTimers.current[id]
    }, duration)
  }

  const handleAdd = (e, p) => {
    const card = e.currentTarget.closest('.product-card') || e.currentTarget.closest('.rounded-lg') || e.currentTarget.parentElement
    const img = card ? (card.querySelector('img[data-product-image]') || card.querySelector('img')) : null
    const rect = img && img.getBoundingClientRect ? img.getBoundingClientRect() : null
    cart.addItem(p, { sourceEl: img, imgSrc: img?.src || p.image, imgRect: rect })
    // show visual added state while preserving fly animation
    markAdded(p.id)
  }

  // preload images for faster product page loads (on hover/focus/touch)
  const preloadImages = (p) => {
    if (!p) return
    const list = p.images && p.images.length ? p.images : [p.image]
    list.forEach(src => {
      if (!preloadedImages.has(src)) {
        const img = new Image()
        img.src = src
        preloadedImages.add(src)
      }
    })
  }

  const [searchQuery, setSearchQuery] = useState('')
  const [sort, setSort] = useState('default');
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)

  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const handlePageChange = (newPage) => {
    setPage(newPage)
    setTimeout(() => scrollToTop(), 50)
  }

  const getPageSize = () => {
    if (windowWidth >= 1024) return 14    // lg: 7 cols × 2 rows
    if (windowWidth >= 768) return 15     // md: 5 cols × 3 rows
    return 12                              // sm / mobile: 4 cols × 3 rows or 3 cols × 4 rows
  }

  const displayedProducts = useMemo(() => {
    let list = [...products];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      list = list.filter(p =>
        p.title.toLowerCase().includes(q)
      )
    }
    if (category && category !== 'all') {
      if (category === 'trucker') list = list.filter((p) => /trucker/i.test(p.title));
      if (category === 'beanie') list = list.filter((p) => /beanie/i.test(p.title));
      if (category === 'signature') list = list.filter((p) => /signature/i.test(p.title));
      if (category === 'tactical') list = list.filter((p) => /tactical/i.test(p.title));
      if (category === 'tee') list = list.filter((p) => /tee/i.test(p.title));
      if (category === 'track') list = list.filter((p) => /track/i.test(p.title));
      if (category === 'caps') list = list.filter((p) => /cap|trucker/i.test(p.title));
      if (category === 'tank') list = list.filter((p) => /tank/i.test(p.title));
    }
    // Separate new arrivals and regular products
    const newProducts = list.filter(p => p.isNew && !p.soldOut)
    const regularProducts = list.filter(p => !p.isNew || p.soldOut)
    
    // Sort regular products based on selected sort option
    if (sort === 'low-high') regularProducts.sort((a, b) => a.price - b.price);
    else if (sort === 'high-low') regularProducts.sort((a, b) => b.price - a.price);
    else if (sort === 'default') {
      // Shuffle only regular products in default sort
      for (let i = regularProducts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [regularProducts[i], regularProducts[j]] = [regularProducts[j], regularProducts[i]];
      }
    }
    
    // Combine: new products first (in their original order), then sorted/shuffled regular products
    return [...newProducts, ...regularProducts];
  }, [sort, category, searchQuery]);

  const pageSize = getPageSize()
  const totalPages = Math.max(1, Math.ceil(displayedProducts.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const startIdx = (safePage - 1) * pageSize
  const pageItems = displayedProducts.slice(startIdx, startIdx + pageSize)

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1) }, [sort, category, windowWidth])

  // Compute a sliding window of 4 page numbers centered around current page
  const getPageNumbers = () => {
    const total = totalPages
    const current = safePage
    // Always show 4-page window
    let start = current - 1
    if (start < 1) start = 1
    if (start + 3 > total) start = Math.max(1, total - 3)
    const pages = []
    for (let i = start; i < start + 4 && i <= total; i++) {
      pages.push(i)
    }
    return pages
  }

  const pageNumbers = getPageNumbers()

  const btnBase = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 42,
    height: 42,
    padding: '0 14px',
    borderRadius: 10,
    border: '1px solid #e5e7eb',
    background: '#ffffff',
    color: '#111827',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 0.15s ease, border-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  }

  const btnActive = {
    ...btnBase,
    background: '#111827',
    borderColor: '#111827',
    color: '#ffffff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  }

  const Pagination = () => totalPages > 1 ? (
    <div className="flex items-center justify-center gap-2 flex-wrap" style={{ padding: '10px 0' }}>
      <button
        onClick={() => handlePageChange(Math.max(1, safePage - 1))}
        disabled={safePage === 1}
        style={{
          ...btnBase,
          opacity: safePage === 1 ? 0.5 : 1,
          cursor: safePage === 1 ? 'not-allowed' : 'pointer',
        }}
      >
        <ChevronLeft size={18} />
      </button>

      {pageNumbers.map(num => (
        <button
          key={num}
          onClick={() => handlePageChange(num)}
          style={num === safePage ? btnActive : btnBase}
          onMouseEnter={e => { if (num !== safePage) { e.currentTarget.style.background = '#f3f4f6'; e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.08)'; } }}
          onMouseLeave={e => { if (num !== safePage) { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'; } }}
        >
          {num}
        </button>
      ))}

      <button
        onClick={() => handlePageChange(Math.min(totalPages, safePage + 1))}
        disabled={safePage === totalPages}
        style={{
          ...btnBase,
          opacity: safePage === totalPages ? 0.5 : 1,
          cursor: safePage === totalPages ? 'not-allowed' : 'pointer',
        }}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  ) : null

  return (
    <>
      <MountReveal className="min-h-screen" style={{ backgroundColor: '#ffffff' }}>
        <div className="shop-container" ref={productsRef} style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 20px 64px' }}>
          <style>{`
            @media (min-width: 768px) {
              .shop-container {
                padding: 100px 24px 100px !important;
              }
            }
            @media (min-width: 1024px) {
              .shop-container {
                padding: 140px 24px 140px !important;
              }
            }
          `}</style>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#9ca3af', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>
              Products
            </p>
            <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 500, color: '#111827', lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: 8 }}>
              Shop
            </h1>
            <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6, maxWidth: 440, margin: '0 auto' }}>
              Browse our collection of faith-inspired apparel and accessories.
            </p>
            {/* Search */}
            <div style={{ maxWidth: 400, margin: '24px auto 0', position: 'relative' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#d1d5db', pointerEvents: 'none' }}>
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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

          {/* Filters: Sort & Category */}
          <div style={{ marginBottom: 20 }}>
            {/* Sort row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap', padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Sort</span>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['default', 'low-high', 'high-low'].map(s => (
                  <button
                    key={s}
                    onClick={() => setSort(s)}
                    style={{
                      padding: '5px 14px',
                      borderRadius: 999,
                      border: 'none',
                      background: sort === s ? '#111827' : '#f3f4f6',
                      color: sort === s ? '#ffffff' : '#6b7280',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={e => { if (sort !== s) e.currentTarget.style.background = sort === s ? '#111827' : '#e5e7eb'; }}
                    onMouseLeave={e => { if (sort !== s) e.currentTarget.style.background = '#f3f4f6'; }}
                  >
                    {s === 'default' ? 'Default' : s === 'low-high' ? 'Price: Low' : 'Price: High'}
                  </button>
                ))}
              </div>
            </div>
            {/* Category dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap', paddingTop: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Category</span>
              <div style={{ position: 'relative' }}>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{
                    appearance: 'none',
                    padding: '6px 32px 6px 14px',
                    borderRadius: 8,
                    border: '1px solid #e5e7eb',
                    background: '#f9fafb',
                    color: '#111827',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    transition: 'all 0.15s ease',
                    outline: 'none',
                    minWidth: 140,
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#9ca3af';
                    e.target.style.background = '#ffffff';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.background = '#f9fafb';
                  }}
                >
                  {['all', 'trucker', 'beanie', 'tee', 'tactical', 'signature', 'track', 'caps', 'tank'].map(cat => (
                    <option key={cat} value={cat}>{cat === 'all' ? 'All Products' : cat}</option>
                  ))}
                </select>
                <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Top pagination */}
          {Pagination()}

          {/* Product grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2 md:gap-4 lg:gap-3" style={{ marginTop: 12 }}>
            {pageItems.map((p) => (
              <div key={p.id} className="rounded-lg overflow-hidden" style={{
                backgroundColor: 'white',
                border: '1px solid #f5f5f5',
                borderRadius: 12,
                transition: 'box-shadow 0.2s ease, transform 0.2s ease',
              }}>
                <div className="relative" style={{ width: '100%', aspectRatio: '3/4', background: '#f5f5f5', overflow: 'hidden' }}>
                    <Link
                      to={`/product/${p.id}`}
                      className="w-full h-full block"
                      onMouseEnter={() => preloadImages(p)}
                      onFocus={() => preloadImages(p)}
                      onTouchStart={() => preloadImages(p)}
                      onPointerOver={() => preloadImages(p)}
                    >
                      <img src={p.image} alt={p.title} data-product-image="true" className="w-full h-full object-cover" />
                    </Link>
                    {p.soldOut && <img src={soldBadge} alt="Sold out" className="absolute top-2 right-2 w-12 h-12 pointer-events-none" />}
                    {p.isNew && !p.soldOut && (
                      <div style={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        background: '#dc2626',
                        color: '#ffffff',
                        fontSize: 9,
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: 4,
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        pointerEvents: 'none',
                      }}>
                        NEW
                      </div>
                    )}
                  </div>

                <div className="p-4 text-center">
                  <div className="text-[8px] tracking-widest uppercase text-gray-700 font-semibold -mt-1">{p.title}</div>
                  <div className="mt-2 font-semibold text-xs">{`₦ ${Number(p.price).toLocaleString()}`}</div>

                  <div className="-mt-2 text-yellow-400">
                    {Array.from({ length: Math.floor(p.rating) }).map((_, i) => (
                      <span key={i} className="text-[10px] leading-none mr-0.5">★</span>
                    ))}
                    <span className="text-[10px] text-gray-500 ml-2 leading-none">{p.rating}</span>
                  </div>

                  {(() => {
                    const isAdded = addedIds.has(p.id)
                    return (
                      <button
                        onClick={!p.soldOut && !isAdded ? (e) => handleAdd(e, p) : undefined}
                        disabled={p.soldOut || isAdded}
                        className={`${p.soldOut ? 'mt-1 w-full bg-gray-300 text-gray-600 py-2 rounded-md text-sm cursor-not-allowed' : isAdded ? 'mt-1 w-full bg-green-500 text-white py-2 rounded-md text-sm flex items-center justify-center gap-2' : 'mt-1 w-full bg-white text-black border border-gray-300 py-2 rounded-lg text-sm hover:opacity-95 hover:cursor-pointer hover:text-green-700'}`}>
                        {p.soldOut ? 'SOLD OUT' : (isAdded ? (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            <span>Added</span>
                          </>
                        ) : 'Add to cart')}
                      </button>
                    )
                  })()}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom pagination */}
          <div style={{ marginTop: 28, marginBottom: 40 }}>
            {Pagination()}
          </div>
        </div>
      </MountReveal>

      {/* Mobile Bottom Navigation - hides on md+ with creative animation */}
      <MobileBottomNav onTagsClick={() => setShowComingSoon(true)} />

      {/* Coming Soon Modal */}
      {showComingSoon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowComingSoon(false)} aria-hidden="true" />
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 z-10 p-6" role="dialog" aria-modal="true" aria-labelledby="coming-soon-title-shop">
            <div className="flex justify-between items-start">
              <div className="text-center w-full">
                <h2 id="coming-soon-title-shop" className="text-xl font-bold">Coming Soon</h2>
                <p className="text-sm text-gray-600 mt-2">We're working on something amazing. Stay tuned</p>
              </div>
              <button onClick={() => setShowComingSoon(false)} className="text-gray-500 hover:text-gray-700 ml-4" aria-label="Close">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Shop;

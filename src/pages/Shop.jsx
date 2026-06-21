import React, { useState, useMemo, useRef, useEffect } from "react";
import Footer from "../pages/Footer";
import { useCart } from '../context/CartContext'

import { products } from '../data/products'
import { cld } from '../utils/cloudinary'
const soldBadge = cld('soldout', { width: 200 })
import { Link } from 'react-router-dom'
import MountReveal from '../components/MountReveal'
import { ChevronLeft, ChevronRight } from 'lucide-react'

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
    if (category && category !== 'all') {
      if (category === 'trucker') list = list.filter((p) => /trucker/i.test(p.title));
      if (category === 'beanie') list = list.filter((p) => /beanie/i.test(p.title));
      if (category === 'signature') list = list.filter((p) => /signature/i.test(p.title));
      if (category === 'tactical') list = list.filter((p) => /tactical/i.test(p.title));
      if (category === 'tee') list = list.filter((p) => /tee/i.test(p.title));
    }
    if (sort === 'low-high') return list.sort((a, b) => a.price - b.price);
    if (sort === 'high-low') return list.sort((a, b) => b.price - a.price);
    // Shuffle products in default sort
    if (sort === 'default') {
      for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [list[i], list[j]] = [list[j], list[i]];
      }
    }
    return list;
  }, [sort, category]);

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
      <MountReveal className="min-h-screen py-8 md:pt-28" style={{ backgroundColor: 'white' }}>
        <div ref={productsRef} className="max-w-8xl mx-auto px-3 md:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between mb-6 gap-4">
            <div>
              <p className="text-black font-semibold uppercase text-lg md:text-xl lg:text-2xl" style={{ letterSpacing: '-0.01em' }}>Shop</p>
            </div>

            <div className="w-full md:w-auto">
              <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
                <div className="w-full md:w-auto">
                  <div className="text-xs text-gray-600 mb-2 uppercase tracking-wider">Sort By</div>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { value: 'default', label: 'Default' },
                      { value: 'low-high', label: 'Low to High' },
                      { value: 'high-low', label: 'High to Low' },
                    ].map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setSort(opt.value)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: 8,
                          fontSize: 12,
                          fontWeight: 600,
                          border: 'none',
                          background: sort === opt.value ? '#111827' : '#f3f4f6',
                          color: sort === opt.value ? '#ffffff' : '#374151',
                          cursor: 'pointer',
                          transition: 'background 0.15s ease, color 0.15s ease, transform 0.1s ease',
                          letterSpacing: '0.02em',
                        }}
                        onMouseEnter={e => { if (sort !== opt.value) { e.currentTarget.style.background = '#e5e7eb' } }}
                        onMouseLeave={e => { if (sort !== opt.value) { e.currentTarget.style.background = '#f3f4f6' } }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="w-full md:w-auto">
                  <div className="text-xs text-gray-600 mb-2 uppercase tracking-wider">Categories</div>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { value: 'all', label: 'All' },
                      { value: 'trucker', label: 'Trucker' },
                      { value: 'beanie', label: 'Beanie' },
                      { value: 'signature', label: 'Signature' },
                      { value: 'tactical', label: 'Tactical' },
                      { value: 'tee', label: 'Tee' },
                    ].map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setCategory(opt.value)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: 8,
                          fontSize: 12,
                          fontWeight: 600,
                          border: 'none',
                          background: category === opt.value ? '#111827' : '#f3f4f6',
                          color: category === opt.value ? '#ffffff' : '#374151',
                          cursor: 'pointer',
                          transition: 'background 0.15s ease, color 0.15s ease, transform 0.1s ease',
                          letterSpacing: '0.02em',
                        }}
                        onMouseEnter={e => { if (category !== opt.value) { e.currentTarget.style.background = '#e5e7eb' } }}
                        onMouseLeave={e => { if (category !== opt.value) { e.currentTarget.style.background = '#f3f4f6' } }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top pagination */}
          {Pagination()}

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
          <div style={{ marginTop: 28 }}>
            {Pagination()}
          </div>
        </div>
      </MountReveal>
      <Footer />
    </>
  );
};

export default Shop;
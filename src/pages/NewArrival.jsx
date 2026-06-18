import React, { useEffect, useState, useRef } from 'react'
import { products } from '../data/products'
import { useCart } from '../context/CartContext'
import { Link } from 'react-router-dom'
import soldBadge from '../assets/soldout.png'
import MountReveal from '../components/MountReveal' 

// cache preloaded image urls to avoid duplicate Image objects
const preloadedImages = new Set()

const preloadImages = (p) => {
  if (!p) return
  const list = p.images && p.images.length ? p.images : [p.image]
  list.forEach(src => {
    if (!src) return
    if (preloadedImages.has(src)) return
    try {
      const im = new Image()
      im.src = src
      preloadedImages.add(src)
    } catch (err) { void err }
  })
}

function NewArrival({ limit, className = '', hideTitle = false, product = null }) {
  const cart = useCart()
  // show temporary "Added" state per product when user clicks add-to-cart
  const [addedIds, setAddedIds] = useState(() => new Set())
  const addedTimers = useRef({})

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

  const [items, setItems] = useState(() => {
    let pool = products
    if (product && product.title) {
      const t = product.title.toLowerCase()
      if (t.includes('trucker')) pool = products.filter(p => p.title.toLowerCase().includes('trucker'))
      else if (t.includes('beanie')) pool = products.filter(p => p.title.toLowerCase().includes('beanie'))
    }
    if (product && product.id) pool = pool.filter(p => p.id !== product.id)

    // Fisher-Yates shuffle
    const shuffled = pool.slice()
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    const result = typeof limit === 'number' ? shuffled.slice(0, limit) : shuffled
    // Remove duplicates based on id
    return result.filter((item, index, self) => self.findIndex(p => p.id === item.id) === index)
  })

  useEffect(() => {
    let pool = products
    if (product && product.title) {
      const t = product.title.toLowerCase()
      if (t.includes('trucker')) pool = products.filter(p => p.title.toLowerCase().includes('trucker'))
      else if (t.includes('beanie')) pool = products.filter(p => p.title.toLowerCase().includes('beanie'))
    }
    if (product && product.id) pool = pool.filter(p => p.id !== product.id)

    const shuffled = pool.slice()
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    const result = typeof limit === 'number' ? shuffled.slice(0, limit) : shuffled
    // Remove duplicates based on id
    setItems(result.filter((item, index, self) => self.findIndex(p => p.id === item.id) === index))
  }, [limit, product])

  return (
    <MountReveal className={`${className}`} style={{ maxWidth: 1200, margin: '0 auto', padding: '0 12px 40px' }}>
      {!hideTitle && <div style={{ fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 20, paddingLeft: 4, letterSpacing: '-0.01em' }}>New Arrivals</div>}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4 lg:gap-3">
        {items.map((p) => (
          <div key={p.id} className="rounded-lg overflow-hidden" style={{
            backgroundColor: 'white',
            border: '1px solid #f0f0f0',
            borderRadius: 12,
            transition: 'box-shadow 0.2s ease, transform 0.2s ease',
          }}>
            <div className="relative" style={{ width: '100%', aspectRatio: '3/4', background: '#f5f5f5', overflow: 'hidden' }}>
                <Link to={`/product/${p.id}`} className="w-full h-full block">
                  <img src={p.image} alt={p.title} data-product-image="true" className="w-full h-full object-cover" />
                </Link>
                {p.soldOut && <img src={soldBadge} alt="Sold out" style={{ position: 'absolute', top: 8, right: 8, width: 36, height: 36, pointerEvents: 'none' }} />}
              </div>

            <div style={{ padding: '10px 8px 12px', textAlign: 'center' }}>
              <div style={{ fontSize: 8, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6b7280', fontWeight: 600 }}>{p.title}</div>
              <div style={{ marginTop: 6, fontWeight: 600, fontSize: 12, color: '#111827' }}>{`₦ ${Number(p.price).toLocaleString()}`}</div>

              <div style={{ marginTop: 4, color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                {Array.from({ length: Math.floor(p.rating) }).map((_, i) => (
                  <span key={i} style={{ fontSize: 10 }}>★</span>
                ))}
                <span style={{ fontSize: 10, color: '#9ca3af', marginLeft: 4 }}>{p.rating}</span>
              </div>

              {(() => {
                const isAdded = addedIds.has(p.id)
                return (
                  <button
                    onClick={!p.soldOut && !isAdded ? (e) => handleAdd(e, p) : undefined}
                    disabled={p.soldOut || isAdded}
                    style={{
                      marginTop: 8,
                      width: '100%',
                      padding: '7px 0',
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 600,
                      border: p.soldOut ? 'none' : isAdded ? 'none' : '1px solid #d1d5db',
                      background: p.soldOut ? '#e5e7eb' : isAdded ? '#15803d' : '#ffffff',
                      color: p.soldOut ? '#9ca3af' : isAdded ? '#ffffff' : '#111827',
                      cursor: p.soldOut || isAdded ? 'not-allowed' : 'pointer',
                      transition: 'background 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                    }}
                  >
                    {p.soldOut ? 'SOLD OUT' : (isAdded ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" style={{ width: 14, height: 14 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/></svg>
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
    </MountReveal>
  )
} 

export default NewArrival
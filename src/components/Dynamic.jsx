import React, { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import Footer from '../pages/Footer'
import { useCart } from '../context/CartContext'
import { products } from '../data/products'
import { cld } from '../utils/cloudinary'

const Dynamic = () => {
  const { id } = useParams()
  const cart = useCart()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])

  const [qty, setQty] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    setSelectedImage(0)
    setAdded(false)
    
    const found = products.find(p => String(p.id) === String(id))
    setProduct(found || null)
    
    if (found) {
      const related = products.filter(p => p.id !== found.id && p.category === found.category).slice(0, 6)
      setRelated(related)
    }
  }, [id])

  const handleAdd = () => {
    if (!product || added) return
    cart.addItem(product, { qty })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (!product) {
    return (
      <div style={{ minHeight: '100vh', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20 }}>
        <div style={{ color: '#6b7280', fontSize: 18 }}>Product not found</div>
        <Link to="/shop" style={{ color: '#064e3b', textDecoration: 'underline', fontSize: 16 }}>Back to Shop</Link>
      </div>
    )
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.image]

  return (
    <div style={{ minHeight: '100vh', background: 'white' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '100px 24px 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'start' }} className="md:grid-cols-1">
          {/* Image Gallery */}
          <div>
            <div style={{ position: 'sticky', top: 100 }}>
              <div style={{ borderRadius: 16, overflow: 'hidden', background: '#f5f5f5', aspectRatio: '3/4' }}>
                <img
                  src={images[selectedImage]}
                  alt={product.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              {images.length > 1 && (
                <div style={{ display: 'flex', gap: 12, marginTop: 16, overflowX: 'auto' }}>
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      style={{
                        width: 80,
                        height: 100,
                        borderRadius: 8,
                        overflow: 'hidden',
                        border: selectedImage === idx ? '2px solid #064e3b' : '2px solid #e5e7eb',
                        background: '#f5f5f5',
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}
                    >
                      <img src={img} alt={`View ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div style={{ padding: '20px 0' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b7280', marginBottom: 12 }}>
              {product.category || 'Product'}
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111827', marginBottom: 16, lineHeight: 1.2 }}>
              {product.title}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ color: '#fbbf24', fontSize: 18 }}>
                {'★'.repeat(Math.floor(product.rating))}
              </div>
              <span style={{ color: '#6b7280', fontSize: 14 }}>{product.rating}</span>
            </div>

            <div style={{ fontSize: 28, fontWeight: 700, color: '#064e3b', marginBottom: 24 }}>
              ₦ {Number(product.price).toLocaleString()}
            </div>

            {product.soldOut && (
              <div style={{ padding: '8px 16px', background: '#fee2e2', color: '#dc2626', borderRadius: 8, fontSize: 14, fontWeight: 600, marginBottom: 20, display: 'inline-block' }}>
                Sold Out
              </div>
            )}

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 8 }}>Quantity</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, maxWidth: 200 }}>
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  style={{ width: 40, height: 40, borderRadius: 8, border: '1px solid #d1d5db', background: 'white', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  -
                </button>
                <span style={{ fontSize: 16, fontWeight: 600, minWidth: 40, textAlign: 'center' }}>{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  style={{ width: 40, height: 40, borderRadius: 8, border: '1px solid #d1d5db', background: 'white', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAdd}
              disabled={product.soldOut || added}
              style={{
                width: '100%',
                maxWidth: 300,
                padding: '14px 32px',
                background: product.soldOut ? '#e5e7eb' : added ? '#16a34a' : '#064e3b',
                color: product.soldOut ? '#9ca3af' : 'white',
                border: 'none',
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 600,
                cursor: product.soldOut || added ? 'not-allowed' : 'pointer',
                marginBottom: 20,
              }}
            >
              {product.soldOut ? 'Sold Out' : added ? 'Added to Cart ✓' : 'Add to Cart'}
            </button>

            {!product.soldOut && (
              <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 20 }}>
                In Stock - Ready to ship
              </p>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div style={{ marginTop: 80 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111827', marginBottom: 32 }}>You May Also Like</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 24 }}>
              {related.map(p => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div style={{
                    background: 'white',
                    border: '1px solid #f5f5f5',
                    borderRadius: 12,
                    overflow: 'hidden',
                    transition: 'box-shadow 0.2s ease, transform 0.2s ease',
                  }}>
                    <div style={{ width: '100%', aspectRatio: '3/4', background: '#f5f5f5', overflow: 'hidden' }}>
                      <img src={p.image} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ padding: '12px' }}>
                      <div style={{ fontSize: 12, fontWeight: 500, color: '#111827', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#064e3b' }}>₦ {Number(p.price).toLocaleString()}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default Dynamic
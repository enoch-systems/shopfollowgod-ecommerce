import React, { useState, useEffect } from 'react'
import { collection, getDocs, deleteDoc, doc, updateDoc, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore'
import { signOut } from 'firebase/auth'
import { db, auth } from '../utils/firebase'
import { useNavigate } from 'react-router-dom'
import { cld, upload } from '../utils/cloudinary'
import { Trash2, Edit3, Plus, LogOut, Search, Filter } from 'lucide-react'

const Admin = () => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: 'trucker',
    rating: 4,
    soldOut: false,
    image: null,
    images: []
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    let filtered = products

    if (searchQuery) {
      filtered = filtered.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(p => {
        const title = p.title.toLowerCase()
        if (categoryFilter === 'trucker') return title.includes('trucker')
        if (categoryFilter === 'beanie') return title.includes('beanie')
        if (categoryFilter === 'tee') return title.includes('tee')
        if (categoryFilter === 'cap') return title.includes('cap')
        return true
      })
    }

    setFilteredProducts(filtered)
  }, [products, searchQuery, categoryFilter])

  const fetchProducts = async () => {
    try {
      const q = query(collection(db, 'products'), orderBy('id', 'asc'))
      const snapshot = await getDocs(q)
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      // Sort by numeric id descending
      data.sort((a, b) => b.id - a.id)
      setProducts(data)
    } catch (err) {
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      navigate('/admin-login')
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  const handleDelete = async (product) => {
    try {
      await deleteDoc(doc(db, 'products', product.id))
      setProducts(prev => prev.filter(p => p.id !== product.id))
      setDeleteConfirm(null)
    } catch (err) {
      console.error('Delete error:', err)
      alert('Failed to delete product')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      let imageUrl = editingProduct?.image || ''
      let imagesUrls = editingProduct?.images || []

      // Upload main image to Cloudinary if provided
      if (formData.image) {
        const result = await upload(formData.image)
        imageUrl = result.secure_url
      }

      // Upload additional images if provided
      if (formData.images && formData.images.length > 0) {
        const uploadPromises = formData.images.filter(img => img !== formData.image).map(img => upload(img))
        const results = await Promise.all(uploadPromises)
        imagesUrls = [imageUrl, ...results.map(r => r.secure_url)]
      }

      if (!imageUrl && editingProduct) {
        imageUrl = editingProduct.image
        imagesUrls = editingProduct.images
      }

      const productData = {
        title: formData.title,
        price: Number(formData.price),
        category: formData.category,
        rating: Number(formData.rating),
        soldOut: formData.soldOut,
        image: imageUrl,
        images: imagesUrls,
        updatedAt: serverTimestamp()
      }

      if (editingProduct) {
        await updateDoc(doc(db, 'products', editingProduct.id), productData)
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...productData } : p))
      } else {
        const maxId = products.length > 0 ? Math.max(...products.map(p => p.id)) : 0
        const newProduct = {
          ...productData,
          id: maxId + 1,
          createdAt: serverTimestamp()
        }
        const docRef = await addDoc(collection(db, 'products'), newProduct)
        setProducts(prev => [...prev, { ...newProduct, id: docRef.id }])
      }

      resetForm()
    } catch (err) {
      console.error('Save error:', err)
      alert('Failed to save product')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      price: '',
      category: 'trucker',
      rating: 4,
      soldOut: false,
      image: null,
      images: []
    })
    setEditingProduct(null)
    setShowForm(false)
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      title: product.title,
      price: product.price,
      category: product.category || 'trucker',
      rating: product.rating,
      soldOut: product.soldOut || false,
      image: null,
      images: []
    })
    setShowForm(true)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <header style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '16px 24px', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111827' }}>Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px' }}>
        {/* Controls */}
        <div style={{ background: 'white', padding: '20px 24px', borderRadius: 12, marginBottom: 24, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '10px 10px 10px 40px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, outline: 'none' }}
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, background: 'white', cursor: 'pointer' }}
          >
            <option value="all">All Categories</option>
            <option value="trucker">Truckers</option>
            <option value="beanie">Beanies</option>
            <option value="tee">Tees</option>
            <option value="cap">Caps</option>
          </select>

          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: '#064e3b', color: 'white', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
          >
            <Plus size={18} /> Add Product
          </button>
        </div>

        {/* Product Form Modal */}
        {showForm && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
            <div style={{ background: 'white', borderRadius: 16, padding: 32, maxWidth: 600, width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24, color: '#111827' }}>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Product Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14 }}
                    placeholder="e.g., CAMO YELLOW TRUCKER"
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Price (₦) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    step="1000"
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14 }}
                    placeholder="15000"
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14 }}
                  >
                    <option value="trucker">Trucker</option>
                    <option value="beanie">Beanie</option>
                    <option value="tee">Tee</option>
                    <option value="cap">Cap</option>
                  </select>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Rating</label>
                  <input
                    type="number"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    min="0"
                    max="5"
                    step="0.5"
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14 }}
                  />
                </div>

                <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <input
                    type="checkbox"
                    id="soldOut"
                    checked={formData.soldOut}
                    onChange={(e) => setFormData({ ...formData, soldOut: e.target.checked })}
                    style={{ width: 18, height: 18 }}
                  />
                  <label htmlFor="soldOut" style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>Sold Out</label>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Main Product Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                    style={{ fontSize: 14 }}
                  />
                  {editingProduct?.image && !formData.image && (
                    <img src={editingProduct.image} alt="Current" style={{ marginTop: 8, width: 100, height: 100, objectFit: 'cover', borderRadius: 8, border: '1px solid #e5e7eb' }} />
                  )}
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Additional Images</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setFormData({ ...formData, images: Array.from(e.target.files) })}
                    style={{ fontSize: 14 }}
                  />
                </div>

                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={resetForm}
                    style={{ padding: '10px 20px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ padding: '10px 20px', background: '#064e3b', color: 'white', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
                  >
                    {editingProduct ? 'Update' : 'Create'} Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
            <div style={{ background: 'white', borderRadius: 16, padding: 32, maxWidth: 400, width: '100%' }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: '#111827' }}>Delete Product?</h3>
              <p style={{ color: '#6b7280', marginBottom: 24, lineHeight: 1.6 }}>
                Are you sure you want to delete "{deleteConfirm.title}"? This action cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  style={{ padding: '10px 20px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  style={{ padding: '10px 20px', background: '#dc2626', color: 'white', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Products Table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#6b7280' }}>Loading products...</div>
        ) : (
          <div style={{ background: 'white', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ID</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Image</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Title</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Price</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rating</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(product => (
                    <tr key={product.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '12px 16px', fontSize: 14, color: '#111827' }}>#{product.id}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <img
                          src={product.image}
                          alt={product.title}
                          style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8, border: '1px solid #e5e7eb' }}
                        />
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 500, color: '#111827', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {product.title}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 14, color: '#111827' }}>₦ {Number(product.price).toLocaleString()}</td>
                      <td style={{ padding: '12px 16px', fontSize: 14, color: '#111827' }}>
                        <span style={{ color: '#fbbf24' }}>★</span> {product.rating}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        {product.soldOut ? (
                          <span style={{ padding: '4px 10px', background: '#fee2e2', color: '#dc2626', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>Sold Out</span>
                        ) : (
                          <span style={{ padding: '4px 10px', background: '#d1fae5', color: '#059669', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>Active</span>
                        )}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => handleEdit(product)}
                            style={{ padding: '6px 12px', background: '#dbeafe', color: '#2563eb', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                          >
                            <Edit3 size={14} /> Edit
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(product)}
                            style={{ padding: '6px 12px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredProducts.length === 0 && (
              <div style={{ textAlign: 'center', padding: 60, color: '#6b7280' }}>
                No products found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Admin
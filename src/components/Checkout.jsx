import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Home, ShoppingCart, ShoppingBag, Tag } from 'lucide-react'
import { useCart } from '../context/CartContext'
import ConfirmModal from './ConfirmModal'
import { jsPDF } from 'jspdf'
import { cld } from '../utils/cloudinary'
import MobileBottomNav from './MobileBottomNav'
const deleteIcon = cld('delete', { width: 32 })

function Checkout() {
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [showComingSoon, setShowComingSoon] = useState(false)
  const cart = useCart()
  const navigate = useNavigate()
  const [orderTotal, setOrderTotal] = useState(0.0)
  const [showConfirm, setShowConfirm] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastVisible, setToastVisible] = useState(false)
  const [emptyErrorVisible, setEmptyErrorVisible] = useState(false)
  const [formErrors, setFormErrors] = useState({ fullName: '', phone: '', address: '' })
  const [isProcessing, setIsProcessing] = useState(false)
  const fullNameRef = useRef(null)
  const phoneRef = useRef(null)
  const addressRef = useRef(null)
  const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN
  const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID

  function generateOrderPdfBlob() {
    try {
      const doc = new jsPDF({ unit: 'pt', format: 'a4' })
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      const margin = 40
      const usableWidth = pageWidth - 2 * margin

      let y = 40

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.setTextColor(100)
      doc.text('shopfollowgod.com', margin, y)
      y += 12
      doc.text('Owerri, Nigeria', margin, y)
      y += 12
      doc.text('CASH INVOICE', margin, y)

      const today = new Date()
      const dateStr = today.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }) + ' ' + today.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
      doc.text(`Date: ${dateStr}`, pageWidth - margin, 52, { align: 'right' })

      y += 30

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(20)
      doc.setTextColor(0)
      doc.text('CUSTOMER ORDER ALERT', pageWidth / 2, y, { align: 'center' })

      y += 40

      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.text('ORDER FROM:', margin, y)
      y += 18

      doc.setFontSize(11)
      const nameLabel = 'Name: '
      doc.setFont('helvetica', 'bold')
      doc.text(nameLabel, margin + 20, y)
      const nameLabelWidth = doc.getTextWidth(nameLabel)
      doc.setFont('helvetica', 'normal')
      doc.text(fullName ? fullName.toUpperCase() : 'N/A', margin + 20 + nameLabelWidth + 4, y)
      y += 15

      const phoneLabel = 'Phone Number: '
      doc.setFont('helvetica', 'bold')
      doc.text(phoneLabel, margin + 20, y)
      const phoneLabelWidth = doc.getTextWidth(phoneLabel)
      doc.setFont('helvetica', 'normal')
      doc.text(phone || 'N/A', margin + 20 + phoneLabelWidth + 4, y)
      y += 15

      const addrLabel = "Receiver's Address: "
      doc.setFont('helvetica', 'bold')
      doc.text(addrLabel, margin + 20, y)
      const addrLabelWidth = doc.getTextWidth(addrLabel)
      doc.setFont('helvetica', 'normal')
      const addrLines = doc.splitTextToSize(address || 'N/A', usableWidth - 40 - addrLabelWidth)
      doc.text(addrLines, margin + 20 + addrLabelWidth, y)
      y += addrLines.length * 15 + 20

      const colItem = 50
      const colDesc = 240
      const colQty = 80
      const colAmount = 100
      const tableTop = y
      const headerH = 30
      const rowH = 35

      doc.setFillColor(230, 215, 215)
      doc.rect(margin, tableTop, usableWidth, headerH, 'F')
      doc.setTextColor(80)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.text('Item', margin + colItem / 2, tableTop + 20, { align: 'center' })
      doc.text('Description', margin + colItem + colDesc / 2, tableTop + 20, { align: 'center' })
      doc.text('Qty', margin + colItem + colDesc + colQty / 2, tableTop + 20, { align: 'center' })
      doc.text('Amount', margin + usableWidth - colAmount / 2, tableTop + 20, { align: 'center' })

      doc.setDrawColor(200)
      doc.setLineWidth(0.5)
      doc.rect(margin, tableTop, usableWidth, headerH + rowH * (cart.items.length + 10), 'S')

      let vx = margin + colItem
      doc.line(vx, tableTop, vx, tableTop + headerH + rowH * (cart.items.length + 10))
      vx += colDesc
      doc.line(vx, tableTop, vx, tableTop + headerH + rowH * (cart.items.length + 10))
      vx += colQty
      doc.line(vx, tableTop, vx, tableTop + headerH + rowH * (cart.items.length + 10))

      let currentY = tableTop + headerH
      cart.items.forEach((item, i) => {
        const rowY = currentY + rowH / 2
        if (i % 2 === 1) {
          doc.setFillColor(245, 245, 245)
          doc.rect(margin, currentY, usableWidth, rowH, 'F')
        }
        doc.setTextColor(0)
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(11)
        doc.text(`${i + 1}`, margin + colItem / 2, rowY, { align: 'center' })
        doc.text((item.title || '').toUpperCase(), margin + colItem + 10, rowY)
        doc.text(`${item.qty}`, margin + colItem + colDesc + colQty / 2, rowY, { align: 'center' })
        const amount = Number(item.price || 0) * Number(item.qty || 1)
        doc.text(`${amount.toLocaleString()}`, margin + usableWidth - colAmount / 2, rowY, { align: 'center' })
        currentY += rowH
      })

      for (let i = cart.items.length; i < 10; i++) {
        currentY += rowH
      }

      const totalBoxW = 200
      const totalBoxH = 45
      const totalY = currentY + 30

      doc.setFillColor(230, 215, 215)
      doc.rect(pageWidth - margin - totalBoxW, totalY, totalBoxW, totalBoxH, 'F')
      doc.setTextColor(80)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(13)
      doc.text('Total: ', pageWidth - margin - totalBoxW + 22, totalY + 26)
      doc.setFontSize(18)
      doc.text(orderTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), 
               pageWidth - margin - totalBoxW + 90, totalY + 30)

      return doc.output('blob')
    } catch (err) {
      console.error('PDF generation error', err)
      return null
    }
  }

  async function sendPdfToTelegram(pdfBlob) {
    if (!pdfBlob || !TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return
    const form = new FormData()
    form.append('document', pdfBlob, 'order.pdf')
    form.append('chat_id', TELEGRAM_CHAT_ID)
    form.append('caption', `New Order from ${fullName} — ${phone}`)
    try {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`, {
        method: 'POST',
        body: form
      })
    } catch (err) {
      console.error('Telegram send error', err)
    }
  }

  function showToast(msg, duration = 3000) {
    setToastMessage(msg)
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), duration)
  }

  useEffect(() => {
    setOrderTotal(cart.total || 0)
  }, [cart.total])

  async function handlePlaceOrder(e) {
    e.preventDefault()
    if (isProcessing) return
    if (!cart.items || cart.items.length === 0) {
      setEmptyErrorVisible(true)
      setTimeout(() => setEmptyErrorVisible(false), 3000)
      return
    }

    const errors = {}
    if (!fullName.trim()) errors.fullName = 'Full name is required'
    else if (fullName.trim().length < 3) errors.fullName = 'Full name must be at least 3 characters'

    if (!phone.trim()) errors.phone = 'Phone is required'
    else if (phone.replace(/\D/g, '').length !== 11) errors.phone = 'Phone must be 11 digits'

    if (!address.trim()) errors.address = 'Delivery address is required'
    else if (address.trim().length < 5) errors.address = 'Delivery address must be at least 5 characters'

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      setTimeout(() => setFormErrors({ fullName: '', phone: '', address: '' }), 4000)
      try {
        const firstInvalidRef = errors.phone ? phoneRef : errors.fullName ? fullNameRef : errors.address ? addressRef : null
        if (firstInvalidRef && firstInvalidRef.current) {
          const isMobile = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 768px)').matches
          if (isMobile && firstInvalidRef.current.scrollIntoView) {
            firstInvalidRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
            setTimeout(() => firstInvalidRef.current.focus && firstInvalidRef.current.focus(), 300)
          } else {
            firstInvalidRef.current.focus && firstInvalidRef.current.focus()
          }
        }
      } catch (err) { void err }
      return
    }

    setIsProcessing(true)
    const pdfBlob = generateOrderPdfBlob()
    if (pdfBlob) {
      await Promise.race([
        sendPdfToTelegram(pdfBlob),
        new Promise(resolve => setTimeout(() => resolve('timeout'), 3000))
      ])
        .then(result => showToast(result === 'timeout' ? 'Telegram timed out (continuing)' : 'Invoice sent to Telegram', 3000))
        .catch(() => showToast('Failed to send to Telegram', 3000))
    }

    const itemsSnapshot = cart.items ? cart.items.map(i => ({ ...i })) : []
    const totalSnapshot = orderTotal

    cart.clear?.()
    setFullName('')
    setPhone('')
    setAddress('')
    setOrderTotal(0)
    setFormErrors({ fullName: '', phone: '', address: '' })

    try {
      fullNameRef.current?.blur && fullNameRef.current.blur()
      phoneRef.current?.blur && phoneRef.current.blur()
      addressRef.current?.blur && addressRef.current.blur()
    } catch (err) { void err }

    const message = encodeURIComponent(
      `New Order\n\nCustomer: ${fullName}\nPhone: ${phone}\nAddress: ${address}\n\nItems:\n` +
      itemsSnapshot.map((item, idx) => `${idx + 1}. ${item.title} x${item.qty} - ₦${Number(item.price).toLocaleString()} each`).join('\n') +
      `\n\nOrder Total: ₦${totalSnapshot.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\nThank you!\nSend account details`
    )

    window.location.href = `https://wa.me/2349031161058?text=${message}`
    setIsProcessing(false)
  }

  function handleClearCart() {
    setShowConfirm(true)
  }

  function confirmClearCart() {
    cart.clear?.()
    setShowConfirm(false)
    showToast('Cart cleared')
  }

  const fmt = (v) => '₦' + Number(v || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  // Progress: step 1 = Filling, step 2 = Order (placed), step 3 = WhatsApp Checkout
  const step = isProcessing ? 2 : 1

  return (
    <>
      <main className="min-h-screen bg-white">
        <div className="checkout-container" style={{ maxWidth: 960, margin: '0 auto', padding: '48px 16px 80px' }}>
          <style>{`
            @media (min-width: 768px) {
              .checkout-container {
                padding: 100px 24px 100px !important;
              }
            }
            @media (min-width: 1024px) {
              .checkout-container {
                padding: 140px 24px 140px !important;
              }
            }
          `}</style>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#9ca3af', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>
              Checkout
            </p>
            <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 500, color: '#111827', lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: 8 }}>
              Complete Your Order
            </h1>
            <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6, maxWidth: 440, margin: '0 auto' }}>
              Fill in your details and we'll connect with you on WhatsApp to confirm and arrange delivery.
            </p>
          </div>

          {/* Progress steps */}
          <div style={{ maxWidth: 480, margin: '0 auto 48px', padding: '0 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
              {/* Background line */}
              <div style={{ position: 'absolute', top: 14, left: 0, right: 0, height: 1, background: '#e5e7eb', zIndex: 0 }} />
              
              {/* Active progress fill */}
              <div 
                style={{ position: 'absolute', top: 14, left: 0, height: 1, background: '#111827', transition: 'width 0.5s ease', zIndex: 0 }}
                className="progress-fill"
              />
              <style>{`.progress-fill { width: ${step === 1 ? '25%' : step === 2 ? '60%' : '100%'}; }`}</style>

              {/* Step 1 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, background: step >= 1 ? '#111827' : '#e5e7eb', color: step >= 1 ? '#ffffff' : '#9ca3af', transition: 'all 0.3s ease' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <span style={{ fontSize: 11, fontWeight: 500, marginTop: 6, color: step >= 1 ? '#111827' : '#9ca3af' }}>Filling</span>
              </div>

              {/* Step 2 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, background: step >= 2 ? '#111827' : '#e5e7eb', color: step >= 2 ? '#ffffff' : '#9ca3af', transition: 'all 0.3s ease' }}>
                  {step === 2 ? (
                    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    '2'
                  )}
                </div>
                <span style={{ fontSize: 11, fontWeight: 500, marginTop: 6, color: step >= 2 ? '#111827' : '#9ca3af' }}>Order</span>
              </div>

              {/* Step 3 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, background: step >= 3 ? '#111827' : '#e5e7eb', color: step >= 3 ? '#ffffff' : '#9ca3af', transition: 'all 0.3s ease' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <span style={{ fontSize: 11, fontWeight: 500, marginTop: 6, color: step >= 3 ? '#111827' : '#9ca3af' }}>WhatsApp</span>
              </div>
            </div>
          </div>

          {/* Main grid */}
          <section className="checkout-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}>
            <style>{`
              @media (min-width: 768px) {
                .checkout-grid {
                  grid-template-columns: 3fr 2fr !important;
                  gap: 32px !important;
                }
              }
              @media (min-width: 1024px) {
                .checkout-grid {
                  gap: 40px !important;
                }
              }
            `}</style>

            {/* Form */}
            <form style={{ background: '#ffffff', borderRadius: 12, border: '1px solid #f3f4f6', padding: 24 }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 24 }}>Shipping Details</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Full Name */}
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      ref={fullNameRef}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value.replace(/[^a-zA-Z\s]/g, '').slice(0, 50))}
                      placeholder="Your full name"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: 8,
                        border: formErrors.fullName ? '1px solid #f87171' : '1px solid #e5e7eb',
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
                        e.target.style.borderColor = formErrors.fullName ? '#f87171' : '#e5e7eb';
                        e.target.style.background = '#f9fafb';
                      }}
                    />
                    {fullName.trim().length >= 3 && (
                      <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="12" fill="#16A34A" />
                          <path d="M17 8L10 15L7 12" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                  </div>
                  {formErrors.fullName && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>{formErrors.fullName}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Phone Number</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      ref={phoneRef}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                      placeholder="e.g 07031111111"
                      type="tel"
                      maxLength={11}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: 8,
                        border: formErrors.phone ? '1px solid #f87171' : '1px solid #e5e7eb',
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
                        e.target.style.borderColor = formErrors.phone ? '#f87171' : '#e5e7eb';
                        e.target.style.background = '#f9fafb';
                      }}
                    />
                    {phone.length === 11 && (
                      <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="12" fill="#16A34A" />
                          <path d="M17 8L10 15L7 12" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                  </div>
                  {formErrors.phone && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>{formErrors.phone}</p>}
                </div>

                {/* Address */}
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Delivery Address</label>
                  <div style={{ position: 'relative' }}>
                    <textarea
                      ref={addressRef}
                      value={address}
                      onChange={(e) => setAddress(e.target.value.slice(0, 200))}
                      placeholder="Enter your delivery address"
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: 8,
                        border: formErrors.address ? '1px solid #f87171' : '1px solid #e5e7eb',
                        background: '#f9fafb',
                        color: '#111827',
                        fontSize: 14,
                        outline: 'none',
                        transition: 'all 0.15s ease',
                        boxSizing: 'border-box',
                        resize: 'none',
                        fontFamily: 'inherit',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#9ca3af';
                        e.target.style.background = '#ffffff';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = formErrors.address ? '#f87171' : '#e5e7eb';
                        e.target.style.background = '#f9fafb';
                      }}
                    />
                    {address.trim().length >= 5 && (
                      <div style={{ position: 'absolute', right: 10, top: 10 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="12" fill="#16A34A" />
                          <path d="M17 8L10 15L7 12" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                  </div>
                  {formErrors.address && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>{formErrors.address}</p>}
                </div>
              </div>
            </form>

            {/* Order summary */}
            <aside style={{ background: '#ffffff', borderRadius: 12, border: '1px solid #f3f4f6', padding: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 20 }}>Your Order</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {cart.items && cart.items.length > 0 ? (
                  cart.items.map((item) => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 12, borderBottom: '1px solid #f3f4f6' }}>
                      <button
                        type="button"
                        onClick={() => navigate(`/product/${item.id}`)}
                        style={{ padding: 0, border: 'none', background: 'none', cursor: 'pointer', flexShrink: 0, borderRadius: 8, overflow: 'hidden' }}
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8 }}
                        />
                      </button>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                          <button
                            onClick={() => cart.decrementItem(item.id)}
                            disabled={item.qty <= 1}
                            style={{
                              width: 24, height: 24, borderRadius: 6, border: '1px solid #e5e7eb', background: '#ffffff',
                              fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                              cursor: item.qty <= 1 ? 'not-allowed' : 'pointer', opacity: item.qty <= 1 ? 0.4 : 1,
                              color: '#374151', transition: 'background 0.15s ease',
                            }}
                            onMouseEnter={(e) => { if (item.qty > 1) e.currentTarget.style.background = '#f3f4f6'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff'; }}
                          >
                            −
                          </button>
                          <span style={{ minWidth: 24, textAlign: 'center', fontSize: 13, fontWeight: 500, color: '#111827' }}>{item.qty}</span>
                          <button
                            onClick={() => cart.addItem(item, { qty: 1 })}
                            style={{
                              width: 24, height: 24, borderRadius: 6, border: '1px solid #e5e7eb', background: '#ffffff',
                              fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                              cursor: 'pointer', color: '#374151', transition: 'background 0.15s ease',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = '#f3f4f6'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff'; }}
                          >
                            +
                          </button>
                          <button
                            onClick={() => cart.removeItem(item.id)}
                            style={{
                              marginLeft: 'auto', padding: 4, border: 'none', background: 'none', cursor: 'pointer',
                              borderRadius: 4, transition: 'background 0.15s ease',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = '#f3f4f6'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                          >
                            <img src={deleteIcon} alt="Delete" style={{ width: 14, height: 14 }} />
                          </button>
                        </div>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', whiteSpace: 'nowrap' }}>{fmt(Number(item.price) * item.qty)}</div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '32px 0', textAlign: 'center', fontSize: 13, color: '#9ca3af' }}>Your cart is empty</div>
                )}
              </div>

              <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Order Total</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{fmt(orderTotal)}</span>
                </div>
              </div>

              <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  style={{
                    width: '100%', padding: '11px 0', borderRadius: 8, border: 'none',
                    background: '#111827', color: '#ffffff', fontSize: 13, fontWeight: 600,
                    cursor: isProcessing ? 'not-allowed' : 'pointer', opacity: isProcessing ? 0.6 : 1,
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => { if (!isProcessing) e.currentTarget.style.background = '#374151'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#111827'; }}
                >
                  {isProcessing ? 'Processing...' : 'Place Order — WhatsApp'}
                </button>
                <button
                  onClick={handleClearCart}
                  style={{
                    width: '100%', padding: '11px 0', borderRadius: 8, border: '1px solid #e5e7eb',
                    background: '#ffffff', color: '#6b7280', fontSize: 13, fontWeight: 500,
                    cursor: 'pointer', transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#fca5a5'; e.currentTarget.style.color = '#ef4444'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#6b7280'; }}
                >
                  Clear Cart
                </button>
                {emptyErrorVisible && (
                  <p style={{ fontSize: 12, color: '#ef4444', textAlign: 'center' }}>Your cart is empty</p>
                )}
              </div>
            </aside>
          </section>
        </div>

        <ConfirmModal
          open={showConfirm}
          title="Clear cart?"
          message="Do you want to clear your cart? This action cannot be undone."
          onConfirm={confirmClearCart}
          onCancel={() => setShowConfirm(false)}
        />

        {toastVisible && (
          <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 50 }}>
            <div style={{ background: '#111827', color: '#ffffff', padding: '10px 20px', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: 13 }}>{toastMessage}</div>
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation - hides on md+ with creative animation */}
      <MobileBottomNav onTagsClick={() => setShowComingSoon(true)} />

      {/* Coming Soon Modal */}
      {showComingSoon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowComingSoon(false)} aria-hidden="true" />
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 z-10 p-6" role="dialog" aria-modal="true" aria-labelledby="coming-soon-title-checkout">
            <div className="flex justify-between items-start">
              <div className="text-center w-full">
                <h2 id="coming-soon-title-checkout" className="text-xl font-bold">Coming Soon</h2>
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
  )
}

export default Checkout
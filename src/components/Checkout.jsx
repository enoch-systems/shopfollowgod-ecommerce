import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../pages/Footer'
import { useCart } from '../context/CartContext'
import ConfirmModal from './ConfirmModal'
import deleteIcon from '../assets/delete.png'
import { jsPDF } from 'jspdf'

function Checkout() {
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
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
        <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12 lg:py-16 md:pt-28">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight text-gray-900">Checkout</h1>
            <p className="mt-2 text-sm md:text-base text-gray-500 max-w-lg mx-auto">
              Complete your order and we'll connect with you on WhatsApp to confirm and arrange delivery.
            </p>
          </div>

          {/* Progress steps */}
          <div className="max-w-2xl mx-auto mb-10 md:mb-14">
            <div className="flex items-center justify-between relative">
              {/* Background line */}
              <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 -z-10" />
              
              {/* Active progress fill */}
              <div 
                className="absolute top-4 left-0 h-0.5 bg-gray-900 transition-all duration-500 -z-10"
                style={{ width: step === 1 ? '25%' : step === 2 ? '60%' : '100%' }}
              />

              {/* Step 1 */}
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm font-semibold transition-colors duration-300 ${step >= 1 ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <span className={`text-xs md:text-sm mt-2 font-medium ${step >= 1 ? 'text-gray-900' : 'text-gray-400'}`}>Filling</span>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm font-semibold transition-colors duration-300 ${step >= 2 ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {step === 2 ? (
                    <svg className="animate-spin w-4 h-4 md:w-5 md:h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    '2'
                  )}
                </div>
                <span className={`text-xs md:text-sm mt-2 font-medium ${step >= 2 ? 'text-gray-900' : 'text-gray-400'}`}>Order</span>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm font-semibold transition-colors duration-300 ${step >= 3 ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <span className={`text-xs md:text-sm mt-2 font-medium ${step >= 3 ? 'text-gray-900' : 'text-gray-400'}`}>WhatsApp</span>
              </div>
            </div>
          </div>

          {/* Main grid */}
          <section className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8 lg:gap-10 items-start">
            {/* Form - takes 3/5 of space on md+ */}
            <form className="md:col-span-3 bg-white rounded-xl border border-gray-200 p-5 md:p-7 lg:p-8 shadow-sm">
              <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-6">Shipping Details</h2>

              <div className="space-y-5">
                {/* Full Name */}
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                  <div className="relative">
                    <input
                      ref={fullNameRef}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value.replace(/[^a-zA-Z\s]/g, '').slice(0, 50))}
                      placeholder="Your full name"
                      className={`w-full rounded-lg border ${formErrors.fullName ? 'border-red-400' : 'border-gray-300'} py-2.5 md:py-3 pl-4 pr-10 text-sm md:text-base outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors`}
                      style={{ fontSize: 16 }}
                    />
                    {fullName.trim().length >= 3 && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="12" fill="#16A34A" />
                          <path d="M17 8L10 15L7 12" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                  </div>
                  {formErrors.fullName && <p className="text-xs text-red-500 mt-1">{formErrors.fullName}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                  <div className="relative">
                    <input
                      ref={phoneRef}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                      placeholder="e.g 07031111111"
                      type="tel"
                      maxLength={11}
                      className={`w-full rounded-lg border ${formErrors.phone ? 'border-red-400' : 'border-gray-300'} py-2.5 md:py-3 pl-4 pr-10 text-sm md:text-base outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors`}
                      style={{ fontSize: 16 }}
                    />
                    {phone.length === 11 && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="12" fill="#16A34A" />
                          <path d="M17 8L10 15L7 12" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                  </div>
                  {formErrors.phone && <p className="text-xs text-red-500 mt-1">{formErrors.phone}</p>}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5">Delivery Address</label>
                  <div className="relative">
                    <textarea
                      ref={addressRef}
                      value={address}
                      onChange={(e) => setAddress(e.target.value.slice(0, 200))}
                      placeholder="Enter your delivery address"
                      rows={3}
                      className={`w-full rounded-lg border ${formErrors.address ? 'border-red-400' : 'border-gray-300'} py-2.5 md:py-3 pl-4 pr-10 text-sm md:text-base outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors resize-none`}
                      style={{ fontSize: 16 }}
                    />
                    {address.trim().length >= 5 && (
                      <div className="absolute right-3 top-3">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="12" fill="#16A34A" />
                          <path d="M17 8L10 15L7 12" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                  </div>
                  {formErrors.address && <p className="text-xs text-red-500 mt-1">{formErrors.address}</p>}
                </div>
              </div>
            </form>

            {/* Order summary - takes 2/5 of space on md+ */}
            <aside className="md:col-span-2 bg-white rounded-xl border border-gray-200 p-5 md:p-7 lg:p-8 shadow-sm">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-5">Your Order</h3>

              <div className="space-y-4">
                {cart.items && cart.items.length > 0 ? (
                  cart.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 pb-4 border-b border-gray-100 last:border-b-0">
                      <button
                        type="button"
                        onClick={() => navigate(`/product/${item.id}`)}
                        className="p-0 rounded focus:outline-none flex-shrink-0"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-14 h-14 md:w-16 md:h-16 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                        />
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs md:text-sm font-medium text-gray-900 truncate">{item.title}</div>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => cart.decrementItem(item.id)}
                            disabled={item.qty <= 1}
                            className={`w-6 h-6 md:w-7 md:h-7 rounded border border-gray-300 text-sm flex items-center justify-center ${item.qty <= 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-100 transition-colors'}`}
                          >
                            −
                          </button>
                          <span className="min-w-[28px] text-center text-xs md:text-sm font-medium">{item.qty}</span>
                          <button
                            onClick={() => cart.addItem(item, { qty: 1 })}
                            className="w-6 h-6 md:w-7 md:h-7 rounded border border-gray-300 text-sm flex items-center justify-center hover:bg-gray-100 transition-colors"
                          >
                            +
                          </button>
                          <button
                            onClick={() => cart.removeItem(item.id)}
                            className="ml-auto p-1 rounded hover:bg-gray-100 transition-colors"
                          >
                            <img src={deleteIcon} alt="Delete" className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="text-xs md:text-sm font-semibold text-gray-900 whitespace-nowrap">{fmt(Number(item.price) * item.qty)}</div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-sm text-gray-400">Your cart is empty</div>
                )}
              </div>

              <div className="mt-5 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm md:text-base font-semibold text-gray-900">Order Total</span>
                  <span className="text-sm md:text-base font-bold text-gray-900">{fmt(orderTotal)}</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="w-full py-2.5 md:py-3 rounded-lg font-semibold text-sm md:text-base bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  {isProcessing ? 'Processing...' : 'Place Order — WhatsApp'}
                </button>
                <button
                  onClick={handleClearCart}
                  className="w-full bg-white border border-gray-300 text-gray-500 hover:text-red-600 hover:border-red-300 py-2.5 md:py-3 rounded-lg text-sm md:text-base font-medium transition-colors"
                >
                  Clear Cart
                </button>
                {emptyErrorVisible && (
                  <p className="text-xs text-red-500 text-center">Your cart is empty</p>
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
          <div className="fixed bottom-6 right-6 z-50">
            <div className="bg-gray-900 text-white px-4 py-2.5 rounded-lg shadow-lg text-sm">{toastMessage}</div>
          </div>
        )}
      </main>

      <Footer />
    </>
  )
}

export default Checkout
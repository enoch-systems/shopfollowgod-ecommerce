import React, { useMemo, useState, useRef, useEffect, useLayoutEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Heart, Share2, Home, Grid, ShoppingCart, Tag, User, Search } from 'lucide-react'
import { products } from '../data/products'
import { useCart } from '../context/CartContext'
import NewArrival from '../pages/NewArrival'
import Footer from '../pages/Footer'
import { cld } from '../utils/cloudinary'
const soldBadge = cld('soldout', { width: 200 })
import MountReveal from '../components/MountReveal' 

// Product metadata (colors and descriptions)
const PRODUCT_META = {
  1: { colors: ['Camo Yellow', 'Black', 'Olive', 'Khaki'], description: 'Structured FG trucker cap with a breathable mesh back and a curved brim. Features an embroidered front patch and an adjustable snapback for a comfortable, onesize fit  durable and ready for daily wear.' },
  2: { colors: ['Black', 'Charcoal', 'White'], description: 'Classic FG black trucker with a reinforced front panel and lightweight mesh to keep you cool. Clean embroidered branding and an adjustable snap closure for secure fit.' },
  3: { colors: ['Sky Blue', 'White', 'Navy'], description: 'FG sky blue trucker featuring a soft front panel and airy mesh back. Embroidered branding and adjustable snapback combine style and function for everyday wear.' },
  4: { colors: ['Silver Grey', 'Black', 'White'], description: 'Neutral silver grey trucker with structured shape and breathable construction. Pairs effortlessly with layered streetwear looks.' },
  5: { colors: ['Burnt Orange', 'Beige'], description: 'Bold burnt orange trucker with a durable front panel and classic mesh back. Built to hold its shape while providing all day comfort.' },
  6: { colors: ['Deep Red', 'Black'], description: 'Deep red FG trucker with premium embroidery and an adjustable snapback. Lightweight, breathable, and made to stand out.' },
  7: { colors: ['Burgundy Camo', 'Forest'], description: 'Burgundy camo trucker  statement styling with a reinforced front and ventilated mesh for comfortable wear.' },
  8: { colors: ['Forest Camo', 'Olive'], description: 'Forest camo FG trucker, designed for breathability and lasting shape. A versatile cap for casual and outdoor looks.' },
  9: { colors: ['Royal Purple', 'Black'], description: 'Vibrant royal purple trucker with a structured silhouette, embroidered logo, and adjustable snap for a personalized fit.' },
  10: { colors: ['Bright Red', 'Black'], description: 'Bright red FG trucker made for impact. Breathable mesh back and durable front deliver a standout everyday cap.' },
  11: { colors: ['Charcoal Grey', 'Black'], description: 'FG charcoal beanie knitted from a soft acrylic blend with a folded cuff and subtle embroidered logo. Provides comfortable warmth and a snug fit.' },
  12: { colors: ['Jet Black', 'Graphite'], description: 'Classic jet black beanie with a ribbed knit and clean finish. Lightweight, insulating and easy to style.' },
  13: { colors: ['Earth Brown', 'Tan'], description: 'Earth brown FG beanie offering soft warmth and a relaxed silhouette. The folded cuff adds structure while keeping ears cozy.' },
  14: { colors: ['Light Green', 'Mint'], description: 'Light green beanie with a soft handfeel and a close, comfortable fit. Ideal for layering under hoods or wearing solo.' },
  15: { colors: ['Light Grey', 'Heather'], description: 'Light grey beanie crafted for everyday warmth. The classic ribbed knit and moderate stretch ensure a secure, flattering fit.' },
  16: { colors: ['Navy Blue', 'Indigo'], description: 'Navy FG beanie combining a refined finish with insulating warmth. Subtle branding keeps the look clean and versatile.' },
  17: { colors: ['Deep Purple', 'Plum'], description: 'Deep purple beanie with a rich knit texture and snug fit. Comfortable for daily wear and cooler evenings.' },
  18: { colors: ['Wine Red', 'Burgundy'], description: 'Wine red FG beanie with a cozy ribbed knit and fold over cuff. A stylish, warm accessory that complements fall and winter outfits.' },
  19: { colors: ['Black', 'White', 'Grey'], description: 'FG Fear of Average Tee  a bold statement piece celebrating individuality and breaking away from mediocrity. Premium cotton blend with screenprinted graphics for everyday wear.' },
  20: { colors: ['Black', 'Navy', 'Grey'], description: 'FG Too Fly to Pray Tee  a lifestyle tee that blends street culture with confidence. Crafted from soft, durable cotton with embroidered FG branding.' },
  21: { colors: ['Black', 'White', 'Navy'], description: 'FG 1% Better Tee  celebrating the grind and constant improvement. Premium quality tshirt with bold graphic design and comfortable fit for all day wear.' },
  22: { colors: ['Black', 'White', 'Grey'], description: 'FG Highway to Heaven Tee  a spiritual yet streetinspired design. Made from premium cotton, perfect for layering or wearing solo with premium finishing.' },
  23: { colors: ['Black', 'Navy', 'Charcoal'], description: 'FG Logo Tee  classic FG branding with premium finishing. Made from durable cotton with a comfortable fit for everyday wear.' },
  34: { colors: ['Black'], description: 'FG Too Fly to Pray Tee (Black)  a lifestyle tee that blends street culture with confidence. Crafted from soft, durable cotton with printed graphics for everyday wear.' },
  24: { colors: ['Camo', 'Olive'], description: 'FG Tactical Cap (Camo)  rugged and versatile with a tactical design. Features reinforced stitching and an adjustable strap for a secure fit in any condition.' },
  25: { colors: ['Grey', 'Charcoal'], description: 'FG Tactical Cap (Grey)  sleek and functional design perfect for tactical or casual styling. Built with durable materials and an adjustable closure.' },
  26: { colors: ['Navy Blue', 'Black'], description: 'FG Tactical Cap (Navy Blue)  professional and versatile tactical cap with a structured design. Features breathable construction and adjustable fit.' },
  27: { colors: ['Black', 'White'], description: 'FG Signature Cap (Black)  iconic FG signature design in classic black. Premium embroidery and quality construction for a distinctive look.' },
  28: { colors: ['Pink', 'White'], description: 'FG Signature Cap (Pink)  bold and vibrant FG signature style. Stand out with this premium quality cap in a striking pink color.' },
  29: { colors: ['Gray', 'White'], description: 'FG Signature Cap (Gray)  refined FG signature cap in neutral grey. Versatile and stylish for any outfit with premium finishing.' },
  30: { colors: ['Red', 'White'], description: 'FG Signature Beanie (Red)  vibrant red signature beanie with premium knit quality. Provides warmth and style with iconic FG branding.' },
  31: { colors: ['Black', 'White'], description: 'FG Signature Beanie (Black)  classic black signature beanie with soft, comfortable knit. Perfect for everyday wear with distinctive FG styling.' },
  32: { colors: ['Red', 'Burgundy'], description: 'FG Signature Cap (Red)  bold red signature cap with premium quality construction. Makes a statement with vibrant color and iconic FG design.' },
  33: { colors: ['Black', 'White'], description: 'FG 1% Better Tee Black  celebrating the grind and constant improvement in style. Premium quality tshirt with bold graphic design and comfortable fit for all day wear.' }
}

function Dynamic({ product: propProduct }) {
  const { id } = useParams() || {}
  const productId = propProduct?.id || (id ? parseInt(id, 10) : null)

  const product = useMemo(() => {
    if (propProduct) return propProduct
    if (productId) return products.find(p => p.id === productId) || products[1]
    return products[1]
  }, [propProduct, productId])

  const [qty, setQty] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  const toastTimer = useRef(null)
  const mainImgRef = useRef(null)
  const [justAdded, setJustAdded] = useState(false)
  const addedTimer = useRef(null)
  const [mainSrc, setMainSrc] = useState(product.image)
  const [selectedThumb, setSelectedThumb] = useState(0)
  const [showFullDescription, setShowFullDescription] = useState(false)
  
  const _baseImages = product.images || product.gallery || [product.image]
  const thumbImages = _baseImages.length > 0 ? _baseImages : [product.image]
  const productMeta = PRODUCT_META[product.id]
  const description = productMeta?.description || 'Structured FG product description not available.'

  useLayoutEffect(() => {
    const created = []
    const preloaders = []
    try {
      const imgs = thumbImages && thumbImages.length ? thumbImages : [product.image]
      imgs.forEach(src => {
        if (!src) return
        if (!document.querySelector(`link[rel="preload"][href="${src}"]`)) {
          const link = document.createElement('link')
          link.rel = 'preload'
          link.as = 'image'
          link.href = src
          try { link.setAttribute('fetchpriority', 'high') } catch (e) { void e }
          document.head.appendChild(link)
          created.push(link)
        }
        try {
          const im = new Image()
          im.decoding = 'sync'
          im.loading = 'eager'
          try { im.setAttribute('fetchpriority', 'high') } catch (e) { void e }
          im.src = src
          preloaders.push(im)
        } catch (err) { void err }
      })

      if (product.image && !document.querySelector(`link[rel="preload"][href="${product.image}"]`)) {
        const mainLink = document.createElement('link')
        mainLink.rel = 'preload'
        mainLink.as = 'image'
        mainLink.href = product.image
        try { mainLink.setAttribute('fetchpriority', 'high') } catch (e) { void e }
        document.head.appendChild(mainLink)
        created.push(mainLink)
        try {
          const im = new Image()
          im.decoding = 'sync'
          im.loading = 'eager'
          try { im.setAttribute('fetchpriority', 'high') } catch (e) { void e }
          im.src = product.image
          preloaders.push(im)
        } catch (err) { void err }
      }
    } catch (err) { void err }

    return () => {
      created.forEach(l => { if (l.parentNode) l.parentNode.removeChild(l) })
      preloaders.forEach(p => { try { p.src = '' } catch (e) {} })
    }
  }, [product])

  const cart = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current)
      if (addedTimer.current) clearTimeout(addedTimer.current)
    }
  }, [product])

  useEffect(() => {
    setMainSrc(product.image)
    setSelectedThumb(0)
    setShowFullDescription(false)
    const imgs = thumbImages && thumbImages.length ? thumbImages : [product.image]
    imgs.forEach(src => {
      try {
        const img = new Image()
        img.src = src
      } catch (err) { void err }
    })
  }, [product])

  const goToIndex = (idx) => {
    const i = (idx + thumbImages.length) % thumbImages.length
    const src = thumbImages[i]
    setMainSrc(src)
    setSelectedThumb(i)
    if (mainImgRef.current) mainImgRef.current.src = src
  }

  const prevImage = () => goToIndex(selectedThumb - 1)
  const nextImage = () => goToIndex(selectedThumb + 1)

  const toggleFavorite = () => {
    setIsFavorite(prev => {
      const next = !prev
      if (next) {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
        favorites.push({
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          addedAt: new Date().toISOString()
        })
        localStorage.setItem('favorites', JSON.stringify(favorites))
        setToastMsg('Added product to favorite')
        setToastVisible(true)
        if (toastTimer.current) clearTimeout(toastTimer.current)
        toastTimer.current = setTimeout(() => setToastVisible(false), 2500)
      } else {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
        const updatedFavorites = favorites.filter(item => item.id !== product.id)
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites))
        setToastMsg('Removed from favorites')
        setToastVisible(true)
        if (toastTimer.current) clearTimeout(toastTimer.current)
        toastTimer.current = setTimeout(() => setToastVisible(false), 1500)
      }
      return next
    })
  }

  const handleShare = async () => {
    const shareData = {
      title: product.title,
      text: `Check out ${product.title} - NGN ${product.price.toLocaleString()}`,
      url: window.location.href
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(window.location.href)
        setToastMsg('Link copied to clipboard')
        setToastVisible(true)
        if (toastTimer.current) clearTimeout(toastTimer.current)
        toastTimer.current = setTimeout(() => setToastVisible(false), 2000)
      }
    } catch (err) {
      console.log('Share cancelled or failed:', err)
    }
  }

  const handleAddToCart = () => {
    if (cart && cart.addItem) {
      cart.addItem(product, { sourceEl: mainImgRef.current, imgSrc: product.image, qty })
    }
    setJustAdded(true)
    if (addedTimer.current) clearTimeout(addedTimer.current)
    addedTimer.current = setTimeout(() => setJustAdded(false), 1500)
    setToastMsg('Added to cart')
    setToastVisible(true)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToastVisible(false), 1600)
  }

  const handleBuyNow = () => {
    if (cart && cart.addItem) {
      cart.addItem(product, { sourceEl: mainImgRef.current, imgSrc: product.image, qty })
    }
    setTimeout(() => navigate('/checkout'), 150)
  }

  const alsoLikeLimit = useMemo(() => ({ base: 6, sm: 8, md: 10, lg: 10 }), [])

  if (!product) return <div className="p-6">Product not found</div>

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex items-center justify-around py-2">
          <Link to="/" className="flex flex-col items-center gap-1 p-2 text-gray-400">
            <Home size={20} />
            <span className="text-xs">Home</span>
          </Link>
          <button className="flex flex-col items-center gap-1 p-2 text-gray-400">
            <Grid size={20} />
            <span className="text-xs">Browse</span>
          </button>
          <Link to="/cart" className="flex flex-col items-center gap-1 p-2 text-gray-400 relative">
            <ShoppingCart size={20} />
            <span className="text-xs">Cart</span>
          </Link>
          <button className="flex flex-col items-center gap-1 p-2 text-gray-400">
            <Heart size={20} />
            <span className="text-xs">Saved</span>
          </button>
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex fixed left-0 top-0 h-full w-16 bg-white border-r border-gray-100 flex-col items-center py-4 z-40">
        <Link to="/" className="mb-8">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">FG</span>
          </div>
        </Link>
        
        <nav className="flex flex-col items-center gap-6 flex-1">
          <Link to="/" className="p-2 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-gray-900 transition-colors">
            <Home size={20} />
          </Link>
          <button className="p-2 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-gray-900 transition-colors">
            <Grid size={20} />
          </button>
          <Link to="/cart" className="p-2 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-gray-900 transition-colors relative">
            <ShoppingCart size={20} />
          </Link>
          <button className="p-2 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-gray-900 transition-colors">
            <Tag size={20} />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-gray-900 transition-colors mt-auto">
            <Heart size={20} />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-gray-900 transition-colors">
            <User size={20} />
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="lg:ml-16 pb-20 lg:pb-8">
        <MountReveal className="min-h-screen bg-white">
          {/* Toast */}
          <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${toastVisible ? 'translate-y-0 opacity-100' : '-translate-y-6 opacity-0'}`} role="status" aria-live="polite">
            <div className={`px-7 py-2 text-sm rounded-md shadow ${toastMsg.includes('favorite') || toastMsg.includes('Added') ? 'bg-green-500 text-white' : 'bg-black text-gray-400'}`}>
              {toastMsg}
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
            {/* Back Button */}
            <Link to="/" className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors mb-4 lg:mb-6">
              <ChevronLeft size={16} />
              <span className="hidden sm:inline">Back</span>
            </Link>

            {/* Product Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-12">
              {/* Left: Image Gallery */}
              <div className="space-y-3 lg:space-y-4">
                {/* Main Image */}
                <div className="relative bg-gray-50 rounded-xl lg:rounded-2xl overflow-hidden aspect-square flex items-center justify-center">
                  <button onClick={prevImage} aria-label="Previous image" className="absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 z-10 p-1.5 lg:p-2 bg-white/90 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm hover:scale-105 transition-transform">
                    <ChevronLeft size={16} className="text-gray-700" />
                  </button>

                  <button onClick={nextImage} aria-label="Next image" className="absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 z-10 p-1.5 lg:p-2 bg-white/90 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm hover:scale-105 transition-transform">
                    <ChevronRight size={16} className="text-gray-700" />
                  </button>

                  <img
                    ref={mainImgRef}
                    src={mainSrc}
                    alt={product.title}
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    onError={(e) => {
                      try {
                        if (e.currentTarget.src !== product.image) {
                          e.currentTarget.src = product.image
                        } else {
                          e.currentTarget.style.display = 'none'
                        }
                      } catch (err) { void err }
                    }}
                    className="w-full h-full object-contain p-4 lg:p-8"
                  />

                  {product.soldOut && (
                    <img src={soldBadge} alt="Sold out" className="absolute top-3 right-3 w-12 h-12 lg:w-16 lg:h-16 pointer-events-none z-20" />
                  )}
                </div>

                {/* Thumbnails */}
                <div className="flex items-center gap-2 lg:gap-3 overflow-x-auto pb-2">
                  {thumbImages.map((src, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setMainSrc(src)
                        setSelectedThumb(idx)
                        if (mainImgRef.current) mainImgRef.current.src = src
                      }}
                      className={`flex-shrink-0 w-14 h-14 lg:w-16 lg:h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedThumb === idx ? 'border-gray-900 ring-2 ring-gray-900 ring-offset-2' : 'border-gray-200 hover:border-gray-300'}`}
                      aria-label={`Show image ${idx + 1}`}>
                      <img src={src} alt={`${product.title} ${idx + 1}`} loading="lazy" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Right: Product Details */}
              <div className="flex flex-col">
                {/* Brand & Rating */}
                <div className="flex items-start justify-between mb-3 lg:mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 lg:w-8 lg:h-8 bg-gray-900 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">FG</span>
                    </div>
                    <div>
                      <div className="text-xs lg:text-sm font-semibold text-gray-900">FG</div>
                      <div className="flex items-center gap-1">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`w-2.5 h-2.5 lg:w-3 lg:h-3 ${i < Math.round(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-200'}`} viewBox="0 0 20 20">
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                            </svg>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 ml-1">({product.rating})</span>
                      </div>
                    </div>
                  </div>
                  <button className="p-1.5 lg:p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <svg className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>
                  </button>
                </div>

                {/* Product Title */}
                <h1 className="text-xl lg:text-2xl md:text-3xl font-bold text-gray-900 mb-2 lg:mb-3 leading-tight">{product.title}</h1>

                {/* Price */}
                <div className="flex items-baseline gap-3 mb-4 lg:mb-6">
                  <span className="text-xl lg:text-2xl font-bold text-gray-900">NGN {product.price.toLocaleString()}</span>
                </div>

                {/* Quantity */}
                <div className="mb-4 lg:mb-6">
                  <span className="text-xs lg:text-sm font-medium text-gray-900 block mb-2 lg:mb-3">Quantity</span>
                  <div className="inline-flex items-center border border-gray-200 rounded-lg">
                    <button 
                      onClick={() => setQty(q => Math.max(1, q - 1))}
                      className="w-9 h-9 lg:w-10 lg:h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors rounded-l-lg"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14"/>
                      </svg>
                    </button>
                    <span className="w-10 lg:w-12 text-center text-sm font-medium text-gray-900">{qty}</span>
                    <button 
                      onClick={() => setQty(q => q + 1)}
                      className="w-9 h-9 lg:w-10 lg:h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors rounded-r-lg"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14M5 12h14"/>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 lg:gap-3 mb-4 lg:mb-6">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.soldOut || justAdded}
                    className={`py-3 lg:py-3.5 rounded-lg font-semibold text-xs lg:text-sm transition-all ${
                      product.soldOut
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : justAdded
                        ? 'bg-green-500 text-white cursor-not-allowed'
                        : 'bg-black text-white hover:bg-gray-800'
                    }`}
                  >
                    {product.soldOut ? 'SOLD OUT' : justAdded ? 'Added' : 'Add to cart'}
                  </button>

                  {!product.soldOut && (
                    <button
                      onClick={handleBuyNow}
                      className="py-3 lg:py-3.5 rounded-lg font-semibold text-xs lg:text-sm border border-gray-900 text-gray-900 hover:bg-gray-50 transition-colors"
                    >
                      Buy now
                    </button>
                  )}
                </div>

                {/* Secondary Actions */}
                <div className="flex gap-2 lg:gap-3 mb-6 lg:mb-8">
                  <button 
                    onClick={toggleFavorite}
                    className={`flex-1 py-2 lg:py-2.5 rounded-lg border text-xs lg:text-sm font-medium transition-colors flex items-center justify-center gap-1.5 lg:gap-2 ${
                      isFavorite 
                        ? 'border-red-300 bg-red-50 text-red-600' 
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Heart size={14} className={`lg:w-4 lg:h-4 ${isFavorite ? 'fill-current' : ''}`} />
                    <span className="hidden sm:inline">{isFavorite ? 'Saved' : 'Save'}</span>
                  </button>
                  <button 
                    onClick={handleShare}
                    className="flex-1 py-2 lg:py-2.5 rounded-lg border border-gray-200 text-xs lg:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5 lg:gap-2"
                  >
                    <Share2 size={14} className="lg:w-4 lg:h-4" />
                    <span className="hidden sm:inline">Share</span>
                  </button>
                </div>

                {/* Description */}
                <div className="border-t border-gray-100 pt-4 lg:pt-6">
                  <h3 className="text-xs lg:text-sm font-semibold text-gray-900 mb-2 lg:mb-3">Description</h3>
                  <div className="text-xs lg:text-sm text-gray-600 leading-relaxed">
                    <p className={showFullDescription ? '' : 'line-clamp-3'}>
                      {description}
                    </p>
                    {description.length > 150 && (
                      <button 
                        onClick={() => setShowFullDescription(!showFullDescription)}
                        className="text-xs lg:text-sm font-medium text-gray-900 mt-1.5 lg:mt-2 hover:underline"
                      >
                        {showFullDescription ? 'Show less' : 'Show more'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-8 lg:mt-16 border-t border-gray-100 pt-6 lg:pt-8">
              <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-4 lg:mb-6">Reviews</h3>
              <div className="flex items-center gap-3 lg:gap-4 mb-4 lg:mb-6">
                <div className="text-3xl lg:text-4xl font-bold text-gray-900">{product.rating}</div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-3 h-3 lg:w-4 lg:h-4 ${i < Math.round(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-200'}`} viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                      </svg>
                    ))}
                  </div>
                  <div className="text-xs lg:text-sm text-gray-500">{product.rating} out of 5</div>
                </div>
              </div>
            </div>

            {/* You Might Also Like */}
            <div className="mt-8 lg:mt-16">
              <h3 className="text-xs lg:text-sm font-semibold text-gray-900 mb-4 lg:mb-6 tracking-wider uppercase">You Might Also Like</h3>
              <NewArrival limit={alsoLikeLimit} className="mt-4 lg:mt-6" hideTitle product={product} gridClass="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 lg:gap-4" />
            </div>
          </div>
        </MountReveal>
      </div>

      {/* Mobile Bottom Search Bar */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 z-30 px-4 pb-2 bg-white border-t border-gray-100">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
          <button className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white">
            <Search size={16} />
          </button>
        </div>
      </div>
    </>
  )
}

export default Dynamic
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPinCheck, Mail, Phone, Send } from 'lucide-react'
import { cld } from '../utils/cloudinary'
const logo = 'https://res.cloudinary.com/djdbcoyot/image/upload/v1781776847/zfp64sddl6r4e7stmelk.png'
const eye = cld('eye', { width: 32 })

const Footer = () => {
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showReturns, setShowReturns] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [showTick, setShowTick] = useState(false)
  const [thankYouHtml, setThankYouHtml] = useState('')

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setShowTerms(false);
        setShowPrivacy(false);
        setShowReturns(false);
        setShowAbout(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  const navigate = useNavigate();

  const openMail = (to, body = '') => {
    try {
      const mailtoHref = `mailto:${to}?body=${encodeURIComponent(body)}`;
      const gmailHref = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoHref;
      setTimeout(() => {
        window.open(gmailHref, '_blank');
      }, 800);
    } catch (err) {
      const gmailHref = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&body=${encodeURIComponent(body)}`;
      window.open(gmailHref, '_blank');
    }
  };

  const deepGreen = '#064e3b'

  const linkStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#4b5563',
    fontSize: 14,
    fontWeight: 500,
    padding: 0,
    textAlign: 'left',
    transition: 'color 0.2s ease',
    fontFamily: 'inherit',
  }

  const handleLinkEnter = (e) => { e.currentTarget.style.color = deepGreen }
  const handleLinkLeave = (e) => { e.currentTarget.style.color = '#4b5563' }

  const contactLinkStyle = {
    color: '#4b5563',
    fontSize: 13,
    textDecoration: 'none',
    transition: 'color 0.2s ease',
    cursor: 'pointer',
  }

  const ModalContent = ({ title, children, onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="z-10 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
        <div style={{ background: '#ffffff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 24px 48px rgba(0,0,0,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #e5e7eb' }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: 0, letterSpacing: '-0.01em' }}>{title}</h2>
            <button onClick={onClose} style={{ background: '#f3f4f6', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#6b7280', fontSize: 18, fontWeight: 600 }}>×</button>
          </div>
          <div style={{ padding: '24px', maxHeight: '60vh', overflowY: 'auto', color: '#374151', fontSize: 14, lineHeight: 1.7 }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )

  const headingStyle = {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#064e3b',
    marginBottom: 16,
    opacity: 0.85,
  }

  const sectionStyle = {
    marginBottom: 32,
  }

  const socialLinkStyle = {
    transition: 'opacity 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  return (
    <footer className="hidden md:block" style={{ 
      backgroundColor: '#ffffff',
      color: '#111827', 
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Main footer content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '56px 24px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40 }}>
          
          {/* Brand column */}
          <div style={{ minWidth: 220 }}>
            <button onClick={() => navigate('/')} aria-label="Go to home" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <img src={logo} alt="Follow God" style={{ height: 40, width: 'auto', marginBottom: 16 }} />
            </button>
            <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.7, maxWidth: 260 }}>
              Faith-inspired fashion for everyday wear. Shop curated collections made with care and purpose.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 20 }}>
              <a href="https://www.instagram.com/followgod.ng" target="_blank" rel="noreferrer" aria-label="Instagram" style={socialLinkStyle}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.6' }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
              >
                <img src="https://res.cloudinary.com/djdbcoyot/image/upload/v1781776704/seavzviiwkmbtj8los9h.png" alt="Instagram" style={{ width: 28, height: 28 }} />
              </a>
              <a href="https://www.tiktok.com/@intro840?_r=1&_t=ZS-91ziswsgTLx" target="_blank" rel="noreferrer" aria-label="TikTok" style={socialLinkStyle}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.6' }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
              >
                <img src="https://res.cloudinary.com/djdbcoyot/image/upload/v1781776704/pbk0dqwcybkbgxowpjo1.png" alt="TikTok" style={{ width: 28, height: 28 }} />
              </a>
              <a href="https://www.snapchat.com/add/nnebue2021?share_id=7YnRKIgbTnG3P9AJCCfNVQ&locale=en_001@rg=ngzzzz" target="_blank" rel="noreferrer" aria-label="Snapchat" style={socialLinkStyle}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.6' }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
              >
                <img src="https://res.cloudinary.com/djdbcoyot/image/upload/v1781776704/ttvtvkyijvf3k6ojljid.png" alt="Snapchat" style={{ width: 28, height: 28 }} />
              </a>
            </div>
          </div>

          {/* Shop column */}
          <div style={sectionStyle}>
            <h4 style={headingStyle}>Shop</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <li><button onClick={() => navigate('/shop')} style={linkStyle} onMouseEnter={handleLinkEnter} onMouseLeave={handleLinkLeave}>All Products</button></li>
              <li><button onClick={() => navigate('/shop?category=best-sellers')} style={linkStyle} onMouseEnter={handleLinkEnter} onMouseLeave={handleLinkLeave}>Best Sellers</button></li>
            </ul>
          </div>

          {/* Company column */}
          <div style={sectionStyle}>
            <h4 style={headingStyle}>Company</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <li><button onClick={() => setShowAbout(true)} style={linkStyle} onMouseEnter={handleLinkEnter} onMouseLeave={handleLinkLeave}>About Us</button></li>
            </ul>
          </div>

          {/* Support column */}
          <div style={sectionStyle}>
            <h4 style={headingStyle}>Support</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <li><button onClick={() => navigate('/faq')} style={linkStyle} onMouseEnter={handleLinkEnter} onMouseLeave={handleLinkLeave}>FAQs</button></li>
              <li><button onClick={() => setShowReturns(true)} style={linkStyle} onMouseEnter={handleLinkEnter} onMouseLeave={handleLinkLeave}>Returns & Refunds</button></li>
            </ul>
          </div>

          {/* Stay in touch column */}
          <div style={{ ...sectionStyle, minWidth: 260 }}>
            <h4 style={headingStyle}>Stay in Touch</h4>
            <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 14, lineHeight: 1.5 }}>
              Sign up for exclusive offers and new drops.
            </p>

            <form onSubmit={(e) => {
              e.preventDefault()
              setEmailError('')
              const re = /\S+@\S+\.\S+/
              if (!email || !re.test(email)) {
                setEmailError('Please enter a valid email address')
                return
              }
              setIsSubscribing(true)
              setShowTick(false)
              setThankYouHtml('')
              setTimeout(() => {
                setShowTick(true)
                setThankYouHtml('Thank you for subscribing!')
                setTimeout(() => setThankYouHtml(''), 4000)
              }, 1500)
              setTimeout(() => {
                setIsSubscribing(false)
                setEmail('')
                setTimeout(() => setShowTick(false), 2500)
              }, 3000)
            }} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 180, position: 'relative' }}>
                <input
                  aria-label="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: '#f9fafb', border: '1px solid #d1d5db', color: '#111827', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                />
                {emailError && <div style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>{emailError}</div>}
              </div>
              <button
                disabled={isSubscribing}
                style={{ padding: '10px 18px', borderRadius: 10, background: deepGreen, color: '#ffffff', fontSize: 13, fontWeight: 600, border: 'none', cursor: isSubscribing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap', transition: 'opacity 0.2s ease' }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.85' }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
              >
                {isSubscribing ? 'Subscribing...' : <><Send size={14} />Subscribe</>}
              </button>
              {showTick && (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="12" fill="#16A34A" />
                    <path d="M17 8L10 15L7 12" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </form>
            {thankYouHtml && <div style={{ marginTop: 8, fontSize: 13, color: deepGreen, fontWeight: 600 }}>{thankYouHtml}</div>}

            <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Mail size={15} style={{ color: '#9ca3af', flexShrink: 0 }} />
                <a
                  href="mailto:followgodng01@gmail.com"
                  onClick={(e) => { e.preventDefault(); openMail('followgodng01@gmail.com', 'Reaching out from folllowgod website'); }}
                  style={contactLinkStyle}
                  onMouseEnter={e => { e.currentTarget.style.color = deepGreen; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#4b5563'; }}
                  className="contact-link"
                >
                  followgodng01@gmail.com
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Phone size={15} style={{ color: '#9ca3af', flexShrink: 0 }} />
                <a
                  href="tel:+2349031161058"
                  style={contactLinkStyle}
                  onMouseEnter={e => { e.currentTarget.style.color = deepGreen; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#4b5563'; }}
                  className="contact-link"
                >
                  +234 903 116 1058
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <MapPinCheck size={15} style={{ color: '#9ca3af', flexShrink: 0 }} />
                <span style={{ color: '#4b5563', fontSize: 13 }}>Online Store</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ position: 'relative', borderTop: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button onClick={() => setShowTerms(true)} style={{ ...linkStyle, fontSize: 13 }} onMouseEnter={handleLinkEnter} onMouseLeave={handleLinkLeave}>Terms</button>
            <button onClick={() => setShowPrivacy(true)} style={{ ...linkStyle, fontSize: 13 }} onMouseEnter={handleLinkEnter} onMouseLeave={handleLinkLeave}>Privacy</button>
            <button onClick={() => setShowReturns(true)} style={{ ...linkStyle, fontSize: 13 }} onMouseEnter={handleLinkEnter} onMouseLeave={handleLinkLeave}>Returns</button>
          </div>

          <div style={{ fontSize: 13, color: '#9ca3af', textAlign: 'center' }}>
            © {new Date().getFullYear()} FOLLOW GOD. All rights reserved.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <span style={{ fontSize: 13, color: '#9ca3af' }}>Built with</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#111827', display: 'flex', alignItems: 'center', gap: 6 }}>
              <img src={eye} alt="Byund" style={{ width: 16, height: 16 }} />
              Byund Technologies
            </span>
            <a
              href="https://wa.me/2349162919586?text=Hello%20Enoch%2C%20Reaching%20out%20from%20followgod%20web"
              target="_blank"
              rel="noreferrer"
              style={{ padding: '7px 16px', borderRadius: 8, border: '1px solid #d1d5db', color: '#111827', fontSize: 13, textDecoration: 'none', fontWeight: 600, transition: 'border-color 0.2s ease, color 0.2s ease' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = deepGreen; e.currentTarget.style.color = deepGreen; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.color = '#111827'; }}
            >
              Reach Us
            </a>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAbout && (
        <ModalContent title="About FOLLOW GOD" onClose={() => setShowAbout(false)}>
          <p>Welcome to FOLLOW GOD, where faith meets fashion. We're a faith inspired apparel brand dedicated to creating high quality, thoughtfully designed pieces that celebrate purpose, identity, and self expression.</p>
          <p>Every collection we create is crafted with care and intention. From bold statement hoodies to timeless essentials, we prioritize ethical sourcing, transparent craftsmanship, and honest communication.</p>
          <p>Our vision is simple: create collections that resonate with people who value quality, meaning, and purpose in what they wear.</p>
          <p><strong>Questions? Let's connect.</strong><br />
            Email: <a href="mailto:followgodng01@gmail.com" style={{ color: '#111827' }}>followgodng01@gmail.com</a><br />
            Phone: <a href="tel:+2349031161058" style={{ color: '#111827' }}>+2349031161058</a>
          </p>
        </ModalContent>
      )}

      {showTerms && (
        <ModalContent title="Terms of Service" onClose={() => setShowTerms(false)}>
          <p><strong>1. Agreement to Terms</strong><br />By accessing and using the FOLLOW GOD website and services, you accept and agree to be bound by the terms and provision of this agreement.</p>
          <p><strong>2. Use License</strong><br />Permission is granted to temporarily download one copy of the materials for personal, non-commercial transitory viewing only.</p>
          <p><strong>3. Disclaimer</strong><br />The materials on our website are provided "as is". We make no warranties, expressed or implied.</p>
          <p><strong>4. Limitations</strong><br />In no event shall FOLLOW GOD or its suppliers be liable for any damages arising out of the use or inability to use the materials on our website.</p>
          <p><strong>5. Accuracy of Materials</strong><br />The materials appearing on our website could include technical, typographical, or photographic errors.</p>
          <p><strong>6. Links</strong><br />We have not reviewed all of the sites linked to our website and are not responsible for the contents of any such linked site.</p>
        </ModalContent>
      )}

      {showPrivacy && (
        <ModalContent title="Privacy Policy" onClose={() => setShowPrivacy(false)}>
          <p><strong>1. Introduction</strong><br />FOLLOW GOD ("we", "our", or "us") operates the website. This page informs you of our policies regarding the collection, use, and disclosure of personal data.</p>
          <p><strong>2. Information Collection and Use</strong><br />We collect several different types of information for various purposes to provide and improve our service to you.</p>
          <p><strong>3. Use of Data</strong><br />FOLLOW GOD uses the collected data for various purposes: to provide and maintain our service, to notify you about changes, to provide customer support, and to improve our service.</p>
          <p><strong>4. Security of Data</strong><br />The security of your data is important to us. We strive to use commercially acceptable means to protect your Personal Data.</p>
        </ModalContent>
      )}

      {showReturns && (
        <ModalContent title="Returns & Refunds" onClose={() => setShowReturns(false)}>
          <p><strong>1. Return Period</strong><br />Customers may return items within 14 days of purchase. Items must be unworn, unwashed, and in original packaging.</p>
          <p><strong>2. Return Process</strong><br />To initiate a return, contact us at followgodng01@gmail.com with your order number and reason for return.</p>
          <p><strong>3. Inspection & Refunds</strong><br />Once we receive your return, we will inspect the item(s) within 5-7 business days. If approved, we will process your refund within 10 business days.</p>
          <p><strong>4. Non-Returnable Items</strong><br />Items marked as clearance or final sale cannot be returned.</p>
          <p><strong>5. Defects & Damage</strong><br />If you receive a damaged or defective item, please contact us immediately with photos.</p>
        </ModalContent>
      )}
    </footer>
  )
}

export default Footer
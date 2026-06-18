# FOLLOW GOD

Faith-inspired fashion and streetwear brand. A curated e-commerce platform delivering exclusive drops, limited-edition collections, and early-access releases to a community-driven audience.

## Problem Statement

The streetwear and faith-inspired apparel market is fragmented. Consumers seeking meaningful, purpose-driven fashion often struggle to find brands that combine aesthetic quality with spiritual identity. Existing platforms lack curated discovery, early-access mechanics, and a seamless mobile-first shopping experience tailored to this niche.

FOLLOW GOD bridges this gap by providing:

- A dedicated marketplace for faith-inspired streetwear
- Early-access and exclusive drop mechanics for community members
- High-performance image delivery through Cloudinary CDN
- Responsive, mobile-first interface optimized for conversion
- Real-time cart management and checkout flow

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 with Vite 7 |
| **Styling** | Tailwind CSS 4 |
| **Routing** | React Router 7 |
| **Icons** | Lucide React |
| **Image CDN** | Cloudinary (automatic optimization, responsive delivery) |
| **Payment / PDF** | jsPDF (receipt generation) |
| **Deployment** | Vercel (with optimized caching headers) |
| **Static Assets** | Public directory with immutable cache policy |
| **Linting** | ESLint 9 with React Hooks plugin |

### Key Integrations

- **Cloudinary SDK** for image transformations, preloading, and responsive srcsets
- **Tailwind CSS Vite plugin** for zero-configuration utility-first styling
- **Vercel edge caching** with one-year immutable cache for images, one-hour cache for HTML

## Architecture

```
followgod/
├── public/
│   └── images/                 # Static assets, favicon
├── scripts/
│   └── upload-images.cjs       # Cloudinary bulk upload script
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── Checkout.jsx
│   │   ├── ConfirmModal.jsx
│   │   ├── Countdown.jsx
│   │   ├── Dynamic.jsx         # Product detail page with image gallery
│   │   ├── MountReveal.jsx     # Scroll-triggered animation wrapper
│   │   ├── Navbar.jsx
│   │   ├── ScrollToTop.jsx
│   │   └── WhatsAppFloat.jsx
│   ├── context/
│   │   └── CartContext.jsx      # Global cart state via React Context
│   ├── data/
│   │   └── products.js          # Product catalog data
│   ├── pages/
│   │   ├── Collections.jsx
│   │   ├── Contact.jsx
│   │   ├── Faq.jsx
│   │   ├── Footer.jsx
│   │   ├── Home.jsx
│   │   ├── NewArrival.jsx
│   │   └── Shop.jsx
│   ├── utils/
│   │   └── cloudinary.js        # Cloudinary helper utilities
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx                # Application entry point
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
└── eslint.config.js
```

## Performance Optimizations

- **Image preloading**: Priority-based `<link rel="preload">` injection for product images using `useLayoutEffect`
- **Eager decoding**: Product images flagged with `decoding="sync"` and `fetchpriority="high"` to eliminate layout shift
- **CDN caching**: One-year immutable cache headers for all image assets via Cloudinary and Vercel configuration
- **Client-side caching**: In-memory image preloader using JavaScript `Image()` constructor during layout phase
- **Mobile-first responsive design**: Adaptive layouts with Tailwind breakpoints

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

The site is deployed on Vercel with the following configuration:

- Automatic HTTPS and CDN distribution
- Custom cache headers for static assets (`max-age=31536000, immutable`)
- HTML caching with revalidation (`max-age=3600, must-revalidate`)
- Environment variables managed via Vercel dashboard

## License

All rights reserved. FOLLOW GOD and related branding are trademarks.
const cloudinary = require('cloudinary').v2
const path = require('path')
const fs = require('fs')
require('dotenv').config()

cloudinary.config({
  cloud_name: 'djdbcoyot',
  api_key: '169253162915976',
  api_secret: 'Llzt8cpvJrsriOfaRCqmVaJZBOU',
})

const PUBLIC_IMAGES = path.resolve(__dirname, '../public/images')
const ASSETS = path.resolve(__dirname, '../src/assets')

const masterFiles = []

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB Cloudinary limit

if (fs.existsSync(PUBLIC_IMAGES)) {
  // Upload hero em images (em1-em6)
  const heroImages = ['em1.jpg', 'em2.jpg', 'em3.jpg', 'em4.jpg', 'em5.jpg', 'em6.jpg']
  heroImages.forEach(name => {
    const p = path.join(PUBLIC_IMAGES, name)
    if (fs.existsSync(p)) {
      const stat = fs.statSync(p)
      if (stat.size <= MAX_FILE_SIZE) {
        masterFiles.push({ filePath: p, folder: 'followgod/public' })
      } else {
        console.log(`Skipping ${name} (${(stat.size/1024/1024).toFixed(1)}MB - too large)`)
      }
    }
  })

  // Also scan for other originals in public/images that have no size suffix
  const files = fs.readdirSync(PUBLIC_IMAGES)
  files.forEach(f => {
    if ((f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png')) && !f.match(/-\d+\./)) {
      if (!masterFiles.find(m => path.basename(m.filePath) === f)) {
        const p = path.join(PUBLIC_IMAGES, f)
        const stat = fs.statSync(p)
        if (stat.size <= MAX_FILE_SIZE) {
          masterFiles.push({ filePath: p, folder: 'followgod/public' })
        } else {
          console.log(`Skipping ${f} (${(stat.size/1024/1024).toFixed(1)}MB - too large)`)
        }
      }
    }
  })
}

const assetInclude = [
  'eye.png', 'lock.png', 'search.svg', 'soldout.png',
  'insta.svg', 'tiktok.svg', 'snapchat.svg', 'delete.png',
  'left.svg', 'right.svg', 'hum.svg', 'whatsapp.svg',
  'close.svg', 'env.svg', 'tick.svg'
]

if (fs.existsSync(ASSETS)) {
  assetInclude.forEach(name => {
    const p = path.join(ASSETS, name)
    if (fs.existsSync(p)) {
      const stat = fs.statSync(p)
      if (stat.size > MAX_FILE_SIZE) {
        console.log(`Skipping ${name} (${(stat.size/1024/1024).toFixed(1)}MB - too large)`)
        return
      }
      // SVGs go as raw, images as image
      if (name.endsWith('.svg')) {
        masterFiles.push({ filePath: p, folder: 'followgod/assets', resource_type: 'raw' })
      } else {
        masterFiles.push({ filePath: p, folder: 'followgod/assets' })
      }
    }
  })

  // Also include original JPEGs from assets without size suffix
  const assetFiles = fs.readdirSync(ASSETS)
  assetFiles.forEach(f => {
    if ((f.endsWith('.jpg') || f.endsWith('.jpeg')) && !f.match(/-\d+\./)) {
      if (!masterFiles.find(m => path.basename(m.filePath) === f)) {
        const p = path.join(ASSETS, f)
        const stat = fs.statSync(p)
        if (stat.size <= MAX_FILE_SIZE) {
          masterFiles.push({ filePath: p, folder: 'followgod/assets' })
        }
      }
    }
  })
}

const total = masterFiles.length
console.log(`\nFound ${total} master files to upload:\n`)
masterFiles.forEach(f => {
  const rt = f.resource_type === 'raw' ? ' [raw]' : ''
  console.log(`  - ${path.basename(f.filePath)}${rt} → ${f.folder}`)
})

async function uploadAll() {
  let done = 0
  for (const file of masterFiles) {
    const fileName = path.basename(file.filePath)
    const publicId = `${file.folder}/${path.parse(fileName).name}`
    try {
      console.log(`\n[${done+1}/${total}] Uploading: ${fileName}...`)
      const result = await cloudinary.uploader.upload(file.filePath, {
        public_id: publicId,
        overwrite: true,
        resource_type: file.resource_type || 'auto',
      })
      console.log(`  ✓ ${result.secure_url}`)
    } catch (err) {
      console.error(`  ✗ Failed: ${fileName} — ${err.message}`)
    }
    done++
  }
  console.log(`\n✅ Done! ${done}/${total} files uploaded.\n`)
}

uploadAll().catch(err => {
  console.error('Upload batch failed:', err)
  process.exit(1)
})
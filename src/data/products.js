// Product images served via Cloudinary CDN with auto format/quality
import { cld } from '../utils/cloudinary'

// Product image helpers - Cloudinary handles responsive sizing, format negotiation (AVIF/WebP/JPEG), and CDN delivery
const fg_army1 = cld('fg_army1', { width: 768 })
const fg_army2 = cld('fg_army2', { width: 768 })
const fg_black1 = cld('fg_black1', { width: 768 })
const fg_black2 = cld('fg_black2', { width: 768 })
const fg_grey1 = cld('fg_grey1', { width: 768 })
const fg_grey2 = cld('fg_grey2', { width: 768 })
const fg_orange1 = cld('fg_orange1', { width: 768 })
const fg_orange2 = cld('fg_orange2', { width: 768 })
const fg_red1 = cld('fg_red1', { width: 768 })
const fg_red2 = cld('fg_red2', { width: 768 })
const fg_violet1 = cld('fg_violet1', { width: 768 })
const fg_violet2 = cld('fg_violet2', { width: 768 })
const fg_mili1 = cld('fg_mili1', { width: 768 })
const fg_mili2 = cld('fg_mili2', { width: 768 })
const fg_bluee1 = cld('fg_bluee1', { width: 768 })
const fg_bluee2 = cld('fg_bluee2', { width: 768 })
const fg_red1_1 = cld('fg_red1.1', { width: 768 })
const fg_red1_2 = cld('fg_red1.2', { width: 768 })

const bean_army1 = cld('bean_army1', { width: 768 })
const bean_army2 = cld('bean_army2', { width: 768 })
const bean_black1 = cld('bean_black1', { width: 768 })
const bean_black2 = cld('bean_black2', { width: 768 })
const bean_brown1 = cld('bean_brown1', { width: 768 })
const bean_brown2 = cld('bean_brown2', { width: 768 })
const bean_green1 = cld('bean_green1', { width: 768 })
const bean_green2 = cld('bean_green2', { width: 768 })
const bean_grey1 = cld('bean_grey1', { width: 768 })
const bean_grey2 = cld('bean_grey2', { width: 768 })
const bean_indigo1 = cld('bean_indigo1', { width: 768 })
const bean_indigo2 = cld('bean_indigo2', { width: 768 })
const bean_purple1 = cld('bean_purple1', { width: 768 })
const bean_purple2 = cld('bean_purple2', { width: 768 })

const inspired1 = cld('inspired1', { width: 1024 })
const inspired2 = cld('inspired2', { width: 1024 })
const neverfly1 = cld('neverfly1', { width: 1024 })
const neverfly2 = cld('neverfly2', { width: 768 })
const nvblack1 = cld('nvblack1', { width: 1024 })
const nvblack2 = cld('nvblack2', { width: 1024 })
const _1percent2 = cld('1percent2', { width: 1024 })
const nonamee = cld('nonamee', { width: 1024 })
const highway = cld('highway', { width: 1024 })
const jesus = cld('jesus', { width: 1024 })
const tactical_camo = cld('tactical_camo', { width: 1024 })
const tactical_camo2 = cld('tactical_camo2', { width: 1024 })
const tactical_gray = cld('tactical_gray', { width: 1024 })
const tactical_gray2 = cld('tactical_gray2', { width: 1024 })
const tactical_navyblue = cld('tactical_navyblue', { width: 1024 })
const tactical_navyblue2 = cld('tactical_navyblue2', { width: 1024 })
const Signaturecap_black = cld('Signaturecap_black', { width: 1024 })
const Signaturecap_black2 = cld('Signaturecap_black2', { width: 1024 })
const Signaturecap_black3 = cld('Signaturecap_black3', { width: 1024 })
const Signaturecap_pink = cld('Signaturecap_pink', { width: 1024 })
const Signaturecap_pink2 = cld('Signaturecap_pink2', { width: 1024 })
const Signaturecap_pink3 = cld('Signaturecap_pink3', { width: 1024 })
const Signaturecap_gray = cld('Signaturecap_gray', { width: 1024 })
const Signaturecap_gray2 = cld('Signaturecap_gray2', { width: 1024 })
const Signaturecap_gray3 = cld('Signaturecap_gray3', { width: 1024 })
const Signaturecap_red = cld('Signaturecap_red', { width: 1024 })
const Signaturecap_red2 = cld('Signaturecap_red2', { width: 1024 })
const Signaturecap_red3 = cld('Signaturecap_red3', { width: 1024 })
const signred = cld('signred', { width: 1024 })

export const products = [
  { id:1, title:'CAMO YELLOW TRUCKER', price:15000, image:fg_army1, images:[fg_army1, fg_army2], rating:5 },
  { id:2, title:'CLASSIC BLACK TRUCKER', price:15000, image:fg_black1, images:[fg_black1, fg_black2], rating:4.5 },
  { id:3, title:'SKY BLUE TRUCKER', price:15000, image:fg_blue1, images:[fg_blue1, fg_blue2], rating:5 },
  { id:4, title:'SILVER GREY TRUCKER', price:15000, image:fg_grey1, images:[fg_grey1, fg_grey2], rating:4, soldOut: true },
  { id:5, title:'BURNT ORANGE TRUCKER', price:15000, image:fg_orange1, images:[fg_orange1, fg_orange2], rating:4.5 },
  { id:6, title:'DEEP RED TRUCKER', price:15000, image:fg_red1, images:[fg_red1, fg_red2], rating:5 },
  { id:21, title:'FG 1% BETTER TEE WHITE', price:30000, image:_1percent2, images:[_1percent2, neverfly1], rating:4 },
  { id:33, title:'FG 1% BETTER TEE BLACK', price:30000, image:nonamee, images:[nonamee, inspired1], rating:4 },
  { id:8, title:'FOREST CAMO TRUCKER', price:15000, image:fg_mili1, images:[fg_mili1, fg_mili2], rating:4.5 },
  { id:9, title:'ROYAL PURPLE TRUCKER', price:15000, image:fg_bluee1, images:[fg_bluee1, fg_bluee2], rating:5 },
  { id:10, title:'BRIGHT RED TRUCKER', price:15000, image:fg_red1_1, images:[fg_red1_1, fg_red1_2], rating:4.5 },
  { id:11, title:'CHARCOAL GREY BEANIE', price:20000, image:bean_army1, images:[bean_army1, bean_army2], rating:5, soldOut: true},
  { id:12, title:'JET BLACK BEANIE', price:20000, image:bean_black1, images:[bean_black1, bean_black2], rating:4, soldOut: true },
  { id:23, title:'FG LOGO TEE', price:30000, image:highway, images:[highway], rating:4 },
  { id:14, title:'LIGHT GREEN BEANIE', price:20000, image:bean_green2, images:[bean_green1, bean_green2], rating:5 },
  { id:15, title:'LIGHT GREY BEANIE', price:20000, image:bean_grey1, images:[bean_grey1, bean_grey2], rating:4 },
  { id:16, title:'NAVY BLUE BEANIE', price:20000, image:bean_indigo1, images:[bean_indigo1, bean_indigo2], rating:4.5 },
  { id:20, title:'FG 2FLY 2PRAY TEE WHITE', price:30000, image:neverfly2, images:[neverfly1, neverfly2], rating:4 },
  { id:19, title:'FG FEAR OF AVERAGE TEE', price:30000, image:inspired2, images:[inspired2, inspired1], rating:4 },
  { id:34, title:'FG  2FLY 2PRAY TEE BLACK', price:30000, image:nvblack2, images:[nvblack2, nvblack1], rating:4 },
  { id:17, title:'DEEP PURPLE BEANIE', price:20000, image:bean_purple1, images:[bean_purple1, bean_purple2], rating:5 },
  { id:7, title:'BURGUNDY CAMO TRUCKER', price:15000, image:fg_violet1, images:[fg_violet1, fg_violet2], rating:4 },
  { id:22, title:'FG HIGHWAY TO HEAVEN TEE', price:30000, image:jesus, images:[jesus], rating:5 },
  { id:13, title:'EARTH BROWN BEANIE', price:20000, image:bean_brown1, images:[bean_brown1, bean_brown2], rating:4.5, soldOut: true },
  { id:24, title:'FG TACTICAL CAP (CARMO)', price:22000, image:tactical_camo, images:[tactical_camo, tactical_camo2], rating:5},
  { id:25, title:'FG TACTICAL CAP (GREY)', price:20000, image:tactical_gray, images:[tactical_gray, tactical_gray2], rating:5},
  { id:26, title:'FG TACTICAL CAP (NAVY BLUE)', price:20000, image:tactical_navyblue, images:[tactical_navyblue, tactical_navyblue2], rating:5},
  { id:27, title:'FG SIGNATURE CAP (BLACK)', price:20000, image:Signaturecap_black, images:[Signaturecap_black, Signaturecap_black2, Signaturecap_black3], rating:5},
  { id:28, title:'FG SIGNATURE CAP (PINK)', price:20000, image:Signaturecap_pink, images:[Signaturecap_pink, Signaturecap_pink2, Signaturecap_pink3], rating:5},
  { id:29, title:'FG SIGNATURE CAP (GRAY)', price:20000, image:Signaturecap_gray, images:[Signaturecap_gray, Signaturecap_gray2, Signaturecap_gray3], rating:5},
  { id:32, title:'FG SIGNATURE CAP (RED)', price:20000, image:Signaturecap_red, images:[Signaturecap_red, Signaturecap_red2, Signaturecap_red3], rating:5},
  { id:30, title:'FG SIGNATURE BEANIE (RED)', price:10000, image:signred, images:[signred], rating:5},
]

export default products
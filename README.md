# RC PROF Website

RC PROF üçün korporativ veb-sayt. Next.js 14 (App Router) ilə qurulmuşdur.

## Xüsusiyyətlər

- ✅ Multi-page struktur (App Router)
- ✅ Responsive dizayn (mobil, planşet, desktop)
- ✅ Dropdown menyu (desktop hover, mobil tap)
- ✅ Azərbaycan dili
- ✅ SEO optimallaşdırılmış (meta tags)
- ✅ Next.js Image optimallaşdırması
- ✅ TypeScript
- ✅ Tailwind CSS

## Tələblər

- Node.js 18-26 (tövsiyə olunur: Node.js 20)
- npm və ya yarn

## Quraşdırma

```bash
npm install
```

və ya

```bash
yarn install
```

**NVM istifadə edirsinizsə:**
```bash
nvm use
```

## İnkişaf rejimi

```bash
npm run dev
```

Veb-sayt `http://localhost:3000` ünvanında açılacaq.

## Build

```bash
npm run build
npm start
```

## Struktur

```
/app
  /haqqimizda        - Haqqımızda səhifəsi
  /xidmetler         - Xidmətlər siyahısı
  /xidmetler/[slug]  - Xidmət detalları
  /layiheler         - Layihələr siyahısı
  /layiheler/[slug]  - Layihə detalları
  /xeberler          - Xəbərlər siyahısı
  /xeberler/[slug]   - Xəbər detalları
  /mehsullarimiz     - Məhsullar (tezliklə)
  /elaqe             - Əlaqə səhifəsi
  page.tsx           - Ana səhifə

/components
  Header.tsx         - Navbar komponenti (dropdown dəstəyi ilə)
  Footer.tsx         - Footer komponenti

/data
  navData.ts         - Naviqasiya məlumatları
  servicesData.ts    - Xidmətlər məlumatları
  projectsData.ts    - Layihələr məlumatları
```

## Şəkillər

Şəkillər `/public/images` qovluğunda yerləşdirilməlidir. Ətraflı məlumat üçün `/public/images/README.md` faylına baxın.

## Əlaqə

- Telefon: +994 55 998 19 85
- WhatsApp: https://wa.me/994559981985
- Ünvan: Bakı, Azərbaycan

## Texnologiyalar

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Node.js 18-26


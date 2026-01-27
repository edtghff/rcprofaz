export interface NavItem {
  title: string;
  href: string;
  dropdown?: DropdownItem[];
}

export interface DropdownItem {
  title: string;
  href: string;
}

export const navData: NavItem[] = [
  {
    title: 'Ana səhifə',
    href: '/',
  },
  {
    title: 'Haqqımızda',
    href: '/haqqimizda',
    dropdown: [
      {
        title: 'Şirkətimiz haqqında',
        href: '/haqqimizda',
      },
      {
        title: 'Niyə RC PROF?',
        href: '/haqqimizda#niye-rc-prof',
      },
    ],
  },
  {
    title: 'Məhsullarımız',
    href: '/mehsullarimiz',
    dropdown: [
      {
        title: 'Bütün məhsullar',
        href: '/mehsullarimiz',
      },
      {
        title: 'Liftlər',
        href: '/mehsullarimiz/liftler',
      },
      {
        title: 'Eskalatorlar',
        href: '/mehsullarimiz/eskalatorlar',
      },
      {
        title: 'İnşaat avadanlıqları',
        href: '/mehsullarimiz/insaat-avadanliqlari',
      },
      {
        title: 'Avtomatik giriş sistemləri',
        href: '/mehsullarimiz/avtomatik-giris-sistemleri',
      },
    ],
  },
  {
    title: 'Layihələrimiz',
    href: '/layiheler',
    dropdown: [
      {
        title: 'Bütün layihələr',
        href: '/layiheler',
      },
    ],
  },
  {
    title: 'Xidmətlərimiz',
    href: '/xidmetler',
    dropdown: [
      {
        title: 'Bütün xidmətlər',
        href: '/xidmetler',
      },
      {
        title: 'Tikinti və Təmir İşləri',
        href: '/xidmetler/tikinti-temir-isleri',
      },
      {
        title: 'Dizayn və Layihələndirmə',
        href: '/xidmetler/dizayn-layihelendirme',
      },
      {
        title: 'Lift Satışı və Servisi',
        href: '/xidmetler/lift-satisi-servisi',
      },
      {
        title: 'Qapı Sistemləri',
        href: '/xidmetler/qapi-sistemleri',
      },
      {
        title: 'Şüşə və Cam Balkon Sistemləri',
        href: '/xidmetler/suse-cam-balkon-sistemleri',
      },
      {
        title: 'Şüşə Satışı',
        href: '/xidmetler/suse-satisi',
      },
    ],
  },
  {
    title: 'Videolar',
    href: '/videolar',
  },
  {
    title: 'Bloglar',
    href: '/bloglar',
  },
];

export const contactPhone = '+994 55 998 19 85';
export const contactPhoneRaw = '994559981985';
export const contactAddress = 'Çinar Park Biznes Mərkəzi';
export const contactEmail = 'info@rcprof.az';


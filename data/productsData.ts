export interface Product {
  slug: string;
  title: string;
  category: string;
  description: string;
  image: string;
  features: string[];
  specifications?: {
    capacity?: string;
    speed?: string;
    height?: string;
    doorType?: string;
    motor?: string;
    standards?: string;
    [key: string]: string | undefined;
  };
  applications?: string[];
  advantages?: string[];
  variants?: string[];
  additionalInfo?: string;
}

export const productsData: Product[] = [
  {
    slug: 'liftler',
    title: 'Liftlər',
    category: 'Liftlər',
    description: 'Müasir və etibarlı lift sistemləri. Keyfiyyət, təhlükəsizlik, rahatlıq və estetik məhsullar məqbul qiymətə.',
    image: '/images/products/liftler.jpg',
    features: [
      'Maşın otaqsız mərkəz idarəedicili, yüksək effektivli lift dəsti',
      'Keyfiyyət, rahatlıq və minimum səs səviyyəsi',
      'Ən mürəkkəb şaxta tələblərinə cavab verən modul dizaynı',
      'Təsdiq edilmiş premium komponentlər',
      'Çoxüslublu lüks kabinə dizaynı',
      'Geniş diapazonlu qapı və kabinə seçimi',
      'EN81-21 normalarına uyğunluq',
    ],
    specifications: {
      capacity: '180 – 630 Kq',
      speed: '1,0 m/s',
      height: '30 m',
      doorType: 'Kənar və mərkəzdən açılma',
      motor: 'Leroy Somers E27L',
      standards: 'EN 81-20 / EN 81-50 / EN 81-21 / EN 81-28 / EN 81-70 / EN 81-71',
      cabinSize: 'Müxtəlif ölçülər',
      floorCount: '2 – 30 mərtəbə',
      power: '3,7 – 11 kW',
    },
    applications: [
      'Yaşayış binaları',
      'Ofis binaları',
      'Ticarət mərkəzləri',
      'Xəstəxanalar',
      'Hotellər',
      'Sənaye obyektləri',
    ],
    advantages: [
      'Yüksək keyfiyyət və etibarlılıq',
      'Enerji səmərəli işləmə',
      'Səsiz və rahat',
      'Müasir dizayn',
      'Uzunömürlü istifadə',
      '24/7 texniki dəstək',
    ],
    variants: [
      'Sərnişin liftləri',
      'Yük liftləri',
      'Xəstəxana liftləri',
      'Maşın otaqsız liftlər',
      'Premium liftlər',
    ],
    additionalInfo: 'RC PROF lift sistemləri müştərilərimizə təhlükəsiz, rahat və etibarlı hərəkət imkanı yaradır. Yüksək keyfiyyətli komponentlər və peşəkar quraşdırma ilə uzunömürlü işləmə təmin edirik.',
  },
  {
    slug: 'eskalatorlar',
    title: 'Eskalatorlar',
    category: 'Eskalatorlar',
    description: 'Yüksək keyfiyyətli eskalator sistemləri. Geniş yükləmə qabiliyyəti və enerji səmərəliliyi ilə. Ticarət mərkəzləri, metrolar və digər ictimai yerlər üçün ideal həll.',
    image: '/images/products/eskalatorlar.jpg',
    features: [
      'Müasir və etibarlı dizayn',
      'Yüksək yükləmə qabiliyyəti',
      'Enerji səmərəli sistem',
      'Asan quraşdırma və xidmət',
      'Geniş diapazonlu konfiqurasiya',
      'Avtomatik idarəetmə sistemi',
      'Təhlükəsizlik sistemləri',
      'Səsiz və rahat işləmə',
    ],
    specifications: {
      capacity: '4500 – 9000 nəfər/saat',
      speed: '0,5 – 0,65 m/s',
      height: '3 – 20 m',
      angle: '30° və 35°',
      width: '600, 800, 1000 mm',
      standards: 'EN 115-1 / EN 115-2',
    },
    applications: [
      'Ticarət mərkəzləri',
      'Metro və nəqliyyat qovşaqları',
      'Hava limanları',
      'Hotellər',
      'İctimai binalar',
    ],
    advantages: [
      'Yüksək keyfiyyət və etibarlılıq',
      'Enerji səmərəli işləmə',
      'Asan quraşdırma və xidmət',
      'Müasir dizayn',
      'Uzunömürlü istifadə',
    ],
    variants: [
      'Standart eskalatorlar',
      'Premium eskalatorlar',
      'Kompakt eskalatorlar',
      'Xarici istifadə üçün eskalatorlar',
    ],
    additionalInfo: 'RC PROF eskalator sistemləri müştərilərimizə rahat və təhlükəsiz hərəkət imkanı yaradır. Yüksək keyfiyyətli komponentlər və peşəkar quraşdırma ilə uzunömürlü işləmə təmin edirik.',
  },
  {
    slug: 'insaat-avadanliqlari',
    title: 'İnşaat Avadanlıqları',
    category: 'İnşaat Avadanlıqları',
    description: 'Peşəkar inşaat avadanlıqları və texniki həllər. Tikinti sahəsində geniş təcrübə ilə. Hər növ tikinti layihəsi üçün lazımi avadanlıqlar.',
    image: '/images/products/insaat-avadanliqlari.jpg',
    features: [
      'Yüksək keyfiyyətli avadanlıqlar',
      'Müasir texnologiyalar',
      'Peşəkar məsləhət və dəstək',
      'Geniş çeşid',
      'Kranlar və yükləmə avadanlıqları',
      'Beton nasosları və qarışdırıcıları',
      'Qazma və qazıntı avadanlıqları',
      'İşləmə və emal avadanlıqları',
      'Təhlükəsizlik avadanlıqları',
    ],
    specifications: {
      types: 'Kranlar, beton nasosları, qazma avadanlıqları, işləmə avadanlıqları',
      capacity: 'Müxtəlif ölçülər və güc seçimləri',
      standards: 'CE, ISO standartlarına uyğunluq',
    },
    applications: [
      'Yaşayış binalarının tikintisi',
      'Kommersiya obyektlərinin tikintisi',
      'Yol və körpü tikintisi',
      'Sənaye obyektlərinin tikintisi',
      'İnfrastruktur layihələri',
    ],
    advantages: [
      'Yüksək performans',
      'Təhlükəsizlik və etibarlılıq',
      'Enerji səmərəliliyi',
      'Asan istifadə',
      'Peşəkar dəstək və servis',
    ],
    variants: [
      'Mobil kranlar',
      'Tower kranlar',
      'Beton nasosları',
      'Qazma avadanlıqları',
      'İşləmə avadanlıqları',
    ],
    additionalInfo: 'RC PROF tikinti avadanlıqları sahəsində geniş çeşid təklif edir. Müştərilərimizə layihələrinin ehtiyaclarına uyğun avadanlıqları seçməkdə kömək edirik.',
  },
  {
    slug: 'avtomatik-giris-sistemleri',
    title: 'Avtomatik Giriş Sistemləri',
    category: 'Avtomatik Giriş Sistemləri',
    description: 'Müasir avtomatik qapı və giriş sistemləri. Rahatlıq və təhlükəsizlik üçün. Müasir binalar üçün ideal həll.',
    image: '/images/products/avtomatik-giris.jpg',
    features: [
      'Avtomatik açılma və bağlanma',
      'Sensor idarəetməsi',
      'Enerji səmərəli sistem',
      'Müasir dizayn',
      'Uzunömürlü və etibarlı',
      'Təhlükəsizlik sensorları',
      'Kilidləmə sistemləri',
      'Uzaqdan idarəetmə',
      'Enerji qənaətli işləmə',
    ],
    specifications: {
      types: 'Sürüşmə qapılar, dönər qapılar, qatlanan qapılar',
      width: 'Müxtəlif ölçülər',
      speed: 'Dəyişən sürət nəzarəti',
      sensors: 'Hərəkət, təzyiq, fotoelektrik sensorlar',
      standards: 'EN 16005, EN 12604',
    },
    applications: [
      'Ticarət mərkəzləri',
      'Ofis binaları',
      'Xəstəxanalar',
      'Hotellər',
      'Hava limanları',
      'Yaşayış binaları',
    ],
    advantages: [
      'Rahatlıq və asanlıq',
      'Enerji səmərəliliyi',
      'Təhlükəsizlik',
      'Müasir dizayn',
      'Uzunömürlü istifadə',
      'Asan qulluq',
    ],
    variants: [
      'Sürüşmə avtomatik qapılar',
      'Dönər avtomatik qapılar',
      'Qatlanan avtomatik qapılar',
      'Premium avtomatik sistemlər',
    ],
    additionalInfo: 'Avtomatik giriş sistemləri müasir binaların ayrılmaz hissəsidir. RC PROF müştərilərinə hər ehtiyaca uyğun avtomatik qapı sistemləri təklif edir.',
  },
];

export const productCategories = [
  {
    slug: 'liftler',
    title: 'Liftlər',
    description: 'Müasir və etibarlı lift sistemləri',
  },
  {
    slug: 'eskalatorlar',
    title: 'Eskalatorlar',
    description: 'Yüksək keyfiyyətli eskalator sistemləri',
  },
  {
    slug: 'insaat-avadanliqlari',
    title: 'İnşaat Avadanlıqları',
    description: 'Peşəkar inşaat avadanlıqları və texniki həllər',
  },
  {
    slug: 'avtomatik-giris-sistemleri',
    title: 'Avtomatik Giriş Sistemləri',
    description: 'Müasir avtomatik qapı və giriş sistemləri',
  },
];


#!/bin/bash

# Скрипт для помощи в замене изображений
# Использование: ./replace-images.sh

echo "=========================================="
echo "  Руководство по замене изображений"
echo "=========================================="
echo ""

echo "📁 Структура папок с изображениями:"
echo ""
echo "public/images/"
echo "├── logo.png                    # Логотип (Header/Footer)"
echo "├── hero-banner.jpg             # Главный баннер"
echo "├── about-preview.jpg           # О нас (главная)"
echo "├── about-main.jpg              # О нас (страница)"
echo "├── services/                   # Услуги"
echo "│   ├── tikinti-temir-isleri.jpg"
echo "│   ├── dizayn-layihelendirme.jpg"
echo "│   ├── lift-satisi-servisi.jpg"
echo "│   ├── qapi-sistemleri.jpg"
echo "│   ├── suse-cam-balkon-sistemleri.jpg"
echo "│   └── suse-satisi.jpg"
echo "├── products/                   # Продукты"
echo "│   ├── liftler.jpg"
echo "│   ├── eskalatorlar.jpg"
echo "│   ├── insaat-avadanliqlari.jpg"
echo "│   └── avtomatik-giris.jpg"
echo "├── projects/                   # Проекты"
echo "│   ├── project-1.jpg"
echo "│   ├── project-2.jpg"
echo "│   ├── project-3.jpg"
echo "│   └── project-4.jpg"
echo "└── news/                       # Новости"
echo "    ├── news-1.jpg"
echo "    └── news-2.jpg"
echo ""

echo "=========================================="
echo "  Текущие изображения:"
echo "=========================================="
echo ""

if [ -d "public/images" ]; then
    echo "📸 Найдены следующие изображения:"
    echo ""
    find public/images -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) | while read file; do
        size=$(ls -lh "$file" | awk '{print $5}')
        echo "  ✓ $(basename "$file") ($size) - $(dirname "$file" | sed 's|public/images||' | sed 's|^/||' || echo 'root')"
    done
else
    echo "❌ Папка public/images не найдена!"
fi

echo ""
echo "=========================================="
echo "  Инструкции:"
echo "=========================================="
echo ""
echo "1. Подготовьте новые изображения с теми же именами"
echo "2. Замените файлы в папке public/images/"
echo "3. Перезапустите dev-сервер: npm run dev"
echo "4. Очистите кеш браузера (Ctrl+Shift+R)"
echo ""
echo "📝 Подробная инструкция: см. IMAGE_REPLACEMENT_GUIDE.md"
echo ""


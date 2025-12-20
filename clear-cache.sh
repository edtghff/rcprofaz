#!/bin/bash

echo "🧹 Очистка кеша Next.js и изображений..."
echo ""

# Очистка кеша Next.js
if [ -d ".next" ]; then
    echo "✓ Удаление папки .next..."
    rm -rf .next
    echo "  ✓ Кеш Next.js очищен"
else
    echo "  ℹ Папка .next не найдена"
fi

# Очистка node_modules/.cache если есть
if [ -d "node_modules/.cache" ]; then
    echo "✓ Удаление node_modules/.cache..."
    rm -rf node_modules/.cache
    echo "  ✓ Кеш node_modules очищен"
fi

echo ""
echo "✅ Кеш полностью очищен!"
echo ""
echo "📝 Следующие шаги:"
echo "1. Перезапустите dev-сервер: npm run dev"
echo "2. В браузере нажмите Ctrl+Shift+R (или Cmd+Shift+R на Mac) для жесткой перезагрузки"
echo "3. Или откройте DevTools (F12) → вкладка Network → поставьте галочку 'Disable cache'"
echo ""


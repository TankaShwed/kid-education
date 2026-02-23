# Учимся читать

Веб-приложение для обучения детей чтению по слогам (русский язык). Первый сценарий: «Выбери слог» — голос называет слог, ребёнок выбирает его из нескольких вариантов.

## Стек

- React 18 + TypeScript
- Vite
- Storybook
- Playwright (E2E)

Озвучка — браузерный Speech Synthesis API (интерфейс TTS вынесен, позже можно подставить другой провайдер).

## Требования

- Node.js 18.19+ (для Playwright и ESM)
- npm

## Команды

```bash
# Установка
npm install

# Разработка
npm run dev          # http://localhost:5173

# Сборка
npm run build        # выход в dist/
npm run preview      # просмотр собранного приложения

# Типы и код
npm run typecheck
npm run lint          # ESLint
npm run lint:fix      # ESLint с автоисправлением
npm run format:check  # проверка форматирования (Prettier)
npm run format:write  # форматирование всех файлов

# Storybook
npm run storybook    # http://localhost:6006
npm run build-storybook

# E2E (нужен Node 18.19+)
npx playwright install chromium   # один раз — установка браузера
npm run test:e2e
```

## Структура

- `src/domain/` — типы, TTS, слоги, генерация раундов
- `src/components/` — UI (экран «выбери слог», выбор сложности)
- `docs/VOCABULARY.md` — словарь домена
- `e2e/` — тесты Playwright

## Деплой

Сборка — статика (`dist/`). Можно выложить на любой хостинг (GitHub Pages, Netlify, Vercel и т.д.). Позже планируется запуск на Samsung Tizen (TV).

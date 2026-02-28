# Документация по проекту

Краткий обзор структуры, стека, команд и точек входа. Описание каждого задания — в `src/tasks/<task>/README.md`.

## Стек

- React 18 + TypeScript
- Vite
- Redux Toolkit + Redux Saga
- Storybook
- Playwright (E2E)

Озвучка — через абстракцию в `src/domain/tts.ts` (по умолчанию браузерный Speech Synthesis API).

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

## Структура каталогов

| Каталог / файл | Назначение |
|----------------|------------|
| `src/domain/` | Типы заданий и раундов (`types.ts`), генерация раундов (`rounds.ts`), слоги (`syllables.ts`), TTS (`tts.ts`). См. `docs/VOCABULARY.md`. |
| `src/store/` | Глобальный store, `sessionSlice` (taskType, difficulty, currentRound, roundKey), thunk `nextRound`, rootSaga, запуск саг с контекстом (TTS, dispatchNextRound). |
| `src/tasks/<task>/` | Для каждого задания: slice, saga, View, Container, экспорт в `index.ts`. Описание задания — в `README.md` каталога. |
| `src/components/` | Общие UI-компоненты (например, DifficultyPicker). |
| `src/App.tsx` | Роутинг по типу задания: отображение контейнера по `currentRound.type`. |
| `e2e/` | Тесты Playwright. |

## Точки входа

- **Приложение:** `src/main.tsx` — создание store, `runSagas(tts)`, рендер App.
- **Новый раунд:** при `currentRound === null` App диспатчит `nextRound()`. В store функция `createRound(taskType, difficulty)` создаёт раунд; thunk `nextRound` кладёт его в session и сбрасывает slice текущего задания.

## Как добавить новое задание

1. Добавить типы конфига и раунда в `src/domain/types.ts`, фабрику раунда в `src/domain/rounds.ts`.
2. В `src/store/store.ts`: ветка в `createRound()` и вызов `slice.actions.reset(round)` в `nextRound`; зарегистрировать reducer в `configureStore` (и в `createStoreForStory` при использовании Storybook).
3. В `src/store/sagas/rootSaga.ts`: `fork(taskSaga, context)`.
4. В `src/App.tsx`: при необходимости кнопка переключения задания; ветка по `currentRound.type` с рендером контейнера задания.
5. Создать каталог `src/tasks/<task>/` с slice, saga, View, Container, `index.ts` и **README.md** (описание на языке предметной области и ссылки на код с TSDoc).
6. Добавить TSDoc в коде задания (типы, slice, сага, пропсы компонентов).

Подробное описание и контракты каждого существующего задания — в `src/tasks/pick-syllable/README.md` и `src/tasks/compose-syllable/README.md`.

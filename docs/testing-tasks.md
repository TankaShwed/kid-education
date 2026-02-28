# Тесты заданий: сценарии и соглашения

## Подход

Один уровень тестов — **интеграционные сценарии** контейнера задания (Container + store + сага с моками). Не пишем отдельные unit-тесты на слайс и сагу.

Цепочка в каждом тесте: **рендер контейнера → действие пользователя → проверка UI (data-testid, роль, текст) и вызовов моков (TTS) → следующее действие → проверки**.

Тесты мало привязаны к реализации: проверяем поведение и контракты (озвучка, смена раунда). Селекторы — только `data-testid`, `getByRole`, `getByLabelText`, видимый текст. Не используем классы и хрупкую структуру DOM, чтобы добавление стилей и анимаций не ломало тесты.

## Ветвящиеся сценарии

Один файл на задание: `*RoundContainer.test.tsx`. Внутри — вложенные `describe` по сценариям.

- **Один describe** = один сценарий (например «успешный путь» или «ошибка → повтор → успех»).
- Внутри — цепочка шагов: действие → ожидание UI и моков.
- Общая настройка: store через `createStoreForStory(mockTTS)`, предзаполненный раунд (как в сторисах), в `beforeEach`.

## Моки

- **TTS:** объект с `speak: vi.fn().mockResolvedValue(undefined)`, `cancel: vi.fn()`. После действий проверяем `expect(mockTTS.speak).toHaveBeenCalledWith(...)`.
- **Store:** `createStoreForStory(mockTTS)` из `@/store`, затем `sessionSlice.actions.setRound(round)` и `pickSyllableSlice.actions.reset(round)` / `composeSyllableSlice.actions.reset(round)`.
- **dispatchNextRound:** в тестах, где нужно проверить переход к следующему раунду, можно перехватывать вызов через мок контекста саги или проверять смену раунда в store (если тестируем в изоляции контейнера с одним раундом — проверяем только вызов TTS «Правильно» и при необходимости мок `dispatchNextRound`).

## Асинхронность

Сага вызывает TTS (async). После клика «Начать» или выбора варианта использовать `waitFor` или `findBy*` для появления ожидаемого UI или проверки вызовов моков после завершения саги.

## Размещение и структура файлов

- **Сценарии по заданию** — в каталоге задания в файле `SCENARIOS.md`: описание сценариев на языке предметной области и названия элементов интерфейса, в конце — привязка к data-testid для тестов.
  - [src/tasks/pick-syllable/SCENARIOS.md](src/tasks/pick-syllable/SCENARIOS.md) — «Выбери слог».
  - [src/tasks/compose-syllable/SCENARIOS.md](src/tasks/compose-syllable/SCENARIOS.md) — «Собери слог».
- **Тесты:** один файл на задание рядом с контейнером — `PickSyllableRoundContainer.test.tsx`, `ComposeSyllableRoundContainer.test.tsx`. Внутри — вложенные `describe` по сценариям из SCENARIOS.md, в `beforeEach` — store и мок TTS, в `it` — цепочка действий и проверок.

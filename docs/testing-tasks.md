# Тесты заданий: сценарии и соглашения

## Инструкция по написанию тестов заданий

Используется при добавлении или изменении тестов контейнера задания (файл `*RoundContainer.test.tsx`). Эталонная структура — [src/tasks/pick-syllable/PickSyllableRoundContainer.test.tsx](src/tasks/pick-syllable/PickSyllableRoundContainer.test.tsx).

### Вложенность и сценарии

- **Корневой `describe`** — по заданию (например `'PickSyllable task'`). В корневом `beforeEach`: мок TTS, создание store с раундом, `render(<Provider store={store}><TaskRoundContainer /></Provider>)`.
- **Вложенные `describe`** — по шагам сценария в порядке «как ведёт себя пользователь»:
  - `describe('success render')` — начальное состояние (например кнопка «Начать»).
  - `describe('click start button')` — после нажатия «Начать»; в его `beforeEach` — клик и ожидание появления следующего UI (слоты, варианты).
  - Дальше — ветвления: `describe('click correct button')`, `describe('click wrong button')` и т.д., в зависимости от сценариев из `SCENARIOS.md`.
- Каждый вложенный `describe` в своём `beforeEach` выполняет **только пользовательские действия** (клики, при необходимости симуляция результата через store) и **ожидание „успокоения“** (появление/исчезновение элементов, вызов TTS), чтобы к моменту выполнения `it` состояние уже установилось.

### Один `it` — одна логическая проверка

- В каждом `it` — **одно логическое утверждение** (или несколько тесно связанных, например два вызова TTS для одной фразы).
- Не объединять в один `it` проверку UI, TTS и следующего шага: разнести по разным `it` с понятными названиями (`should render options`, `should speak instruction`, `should speak correct feedback` и т.п.).

### Действия пользователя в `beforeEach`

- Всё, что делает пользователь (клик «Начать», выбор варианта, заполнение слотов и т.д.), выполняется в **`beforeEach`** того `describe`, который отвечает за этот шаг.
- После действия, которое запускает сагу (асинхронную озвучку), нужно **дождаться завершения** внутри `act()`:
  1. `act(() => { fireEvent.click(button); });`
  2. `await act(async () => { await screen.findByTestId('ожидаемый-элемент'); });` или `await act(async () => { await waitFor(() => { expect(mockTTS.speak).toHaveBeenCalledWith(...); }); });`
- Так все обновления от саги попадают в `act()`, и предупреждения React не возникают.

### Моки и store

- **TTS:** в корневом `beforeEach` создавать `mockTTS = { speak: vi.fn().mockResolvedValue(undefined), cancel: vi.fn() }` и передавать в `createStoreForStory(mockTTS)`. Проверки в `it`: `expect(mockTTS.speak).toHaveBeenCalledWith(...)`.
- **Store:** создавать в корневом `beforeEach`. Если для сценария нужно симулировать результат действия через store (например DnD в jsdom), сохранить store в переменную уровня `describe` и в нужном `beforeEach` вызывать `store.dispatch(...)` внутри `act()`.

### Задания с DnD (например «Собери слог»)

- В jsdom нет полноценного DragEvent/dataTransfer, поэтому «перетаскивание» не эмулируется. Вместо этого в соответствующем `beforeEach` вызывают экшены store (например `setSlots`, `setPool`, `chooseCorrect` / `chooseWrong`), имитируя уже совершённое пользователем действие. Проверяют озвучку и сброс состояния так же, как в заданиях с кликами.

### Чек-лист для нового задания

1. В каталоге задания есть `SCENARIOS.md` с сценариями на языке предметной области и привязкой к data-testid.
2. Файл `*RoundContainer.test.tsx`: корневой `describe`, мок TTS и render в корневом `beforeEach`.
3. Вложенные `describe` по сценариям; в каждом — свой `beforeEach` с действиями и ожиданием в `act()`.
4. В каждом `it` — одна логическая проверка (UI или вызов TTS).
5. Селекторы только по `data-testid`, ролям, видимому тексту — без классов.

---

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

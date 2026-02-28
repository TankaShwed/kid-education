# Задание «Собери слог»

Ребёнок перетаскивает буквы из области пула в слоты и собирает слог. После заполнения слотов проверяется правильность; при верном ответе — переход к следующему раунду.

## Назначение

Задание на составление слога из букв: на экране целевой слог (озвученный), буквы в случайном порядке и слоты под слог. Пользователь перетаскивает буквы в слоты. При неверном составе озвучивается фидбек и слоты сбрасываются; при верном — «Правильно! Молодец!» и загрузка следующего раунда.

## Сценарий раунда

1. При показе раунда озвучивается «Собери слог» и целевой слог.
2. Пользователь перетаскивает буквы из пула в слоты (можно перетаскивать между слотов и обратно в пул).
3. Когда все слоты заполнены, проверяется совпадение с целевым слогом. Если неверно — озвучка фидбека, слоты очищаются, буквы перемешиваются. Если верно — озвучка поощрения и вызов следующего раунда.

## Конфигурация и раунд

Параметров сложности пока нет (в планах — дистракторы). Раунд создаётся фабрикой: целевой слог из домена слогов, буквы — его символы в случайном порядке.

**Типы и фабрика:** см. `src/domain/types.ts` (ComposeSyllableRound, ComposeSyllableTaskConfig), `src/domain/rounds.ts` (createComposeSyllableRound).

## Состояние и события

В store под ключом `composeSyllable` хранятся слоты, пул букв, статус и флаги озвучки. Контейнер читает состояние из store и диспатчит экшены (startRound, setSlots, setPool, chooseCorrect, chooseWrong); сага обрабатывает озвучку и сброс при ошибке (wrongDone).

**Подробно:** экшены и поля состояния — в `composeSyllableSlice.ts` (TSDoc).

## Сага

- **startRound** — озвучивает «Собери слог» и целевой слог, диспатчит instructionDone.
- **chooseCorrect** — озвучивает «Правильно! Молодец!», вызывает dispatchNextRound().
- **chooseWrong** — озвучивает фидбек по собранному слогу, диспатчит wrongDone (сброс слотов и пула).

**Детали:** `composeSyllableSaga.ts` (TSDoc).

## UI

- **ComposeSyllableRoundView** — презентационный компонент: слоты, пул, DnD, кнопка «Начать». Принимает данные и колбэки из контейнера (без TTS и store).
- **ComposeSyllableRoundContainer** — подключает View к store (session.currentRound, composeSyllable), диспатчит экшены по действиям пользователя.

См. `ComposeSyllableRoundView.tsx`, `ComposeSyllableRoundContainer.tsx`.

## Подключение в приложении

- Типы и фабрика раунда: `src/domain/types.ts`, `src/domain/rounds.ts`.
- Store: reducer `composeSyllable`, в `createRound()` и `nextRound()` ветка для `composeSyllable` — `src/store/store.ts`.
- Сага: `fork(composeSyllableSaga, context)` в `src/store/sagas/rootSaga.ts`.
- App: переключение задания и ветка `currentRound.type === 'composeSyllable'` с рендером `<ComposeSyllableRoundContainer key={roundKey} />` — `src/App.tsx`.

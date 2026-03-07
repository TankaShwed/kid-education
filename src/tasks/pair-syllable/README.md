# Задание «Сложи слог»

Разбросанные гласные (красные) и согласные (синие); пользователь перетаскивает букву на букву так, чтобы получилась пара «согласная + гласная» (гласная справа). После склейки слог озвучивается. Когда все пары собраны — фаза «Найди слог X»: нужно кликнуть на нужный слог.

## Назначение

Закрепление понятия слога как пары «согласная, затем гласная»: визуально гласная всегда справа (по X). Два этапа: сборка пар букв DnD, затем поиск слога по озвученной команде.

## Сценарий раунда

1. Кнопка «Начать» → озвучивается «Сложи гласную и согласную в слог».
2. **Фаза 1:** буквы разбросаны по экрану (гласные — красные, согласные — синие). Пользователь подносит гласную к согласной или согласную к гласной. Важно: при дропе гласная должна оказаться справа (больше по X), иначе пара не принимается (фидбек «Гласная должна быть справа»). Валидная пара — слог из списка раунда; после склейки слог произносится. Когда все буквы в парах — переход в фазу 2.
3. **Фаза 2:** озвучивается «Найди слог» и целевой слог. Пользователь кликает по одному из собранных слогов. Верно — «Правильно», следующий раунд; неверно — фидбек и можно выбирать снова.

## Конфигурация и раунд

Раунд: 3–4 слога из `SYLLABLES`, один из них — `targetFind` для фазы 2. Буквы раунда — все буквы этих слогов вперемешку.

**Типы и фабрика:** `src/tasks/pair-syllable/types.ts` (PairSyllableRound, PairSyllableTaskConfig), `src/tasks/pair-syllable/rounds.ts` (createPairSyllableRound). Экспорт в `src/domain/types.ts`.

## Состояние и события

В store под ключом `pairSyllable`: фаза (`pairing` | `finding`), массив букв (с позициями), собранные слоги, флаги озвучки, статус фазы 2 (idle/correct/wrong), wrongSyllableId. События: startRound, **dropOccurred** (сырые данные: draggedId, targetId \| null, dropX, dropY — при targetId=null редьюсер обновляет позицию буквы; при targetId≠null сага валидирует порядок и диспатчит pairFormed или pairRejected), chooseSyllable (chooseCorrect/chooseWrong).

**Подробно:** `pairSyllableSlice.ts` (TSDoc).

## Сага

- startRound → инструкция, instructionDone.
- dropOccurred (targetId ≠ null) → по позициям цели и (dropX, dropY) определяет левую/правую букву; проверяет «согласная слева, гласная справа», полширины, слог в round.syllables; диспатчит pairFormed или pairRejected.
- pairFormed → озвучка слога; при нуле букв — setPhaseFinding и «Найди слог» + targetFind.
- pairRejected → фидбек по reason (wrongOrder / notInRound).
- chooseCorrect → «Правильно», dispatchNextRound.
- chooseWrong → озвучка выбранного слога, wrongDone.

**Детали:** `pairSyllableSaga.ts` (TSDoc).

## UI

- **PairSyllableRoundView** — презентационный компонент: фаза 1 (буквы с DnD, чипы собранных слогов), фаза 2 (подсказка «Найди слог X», кликабельные слоги). Колбэки onStart, **onDrop(payload)** — только сырые данные (draggedId, targetId \| null, dropX, dropY); при дропе на букву — targetId заполнен, при дропе в пустое место — targetId=null (буква остаётся на новой позиции). Тень при перетаскивании отключена (setDragImage прозрачного пикселя).
- **PairSyllableRoundContainer** — подписка на store, при дропе диспатчит только **dropOccurred(payload)**; валидация и склейка — в саге.

См. `PairSyllableRoundView.tsx`, `PairSyllableRoundContainer.tsx`, `PairSyllableRoundView.css`.

## Подключение в приложение

- Типы и фабрика: `src/tasks/pair-syllable/types.ts`, `rounds.ts`; экспорт в `src/domain/types.ts`.
- Store: reducer `pairSyllable`, ветки в createRound/nextRound — `src/store/store.ts`.
- Сага: `fork(pairSyllableSaga, context)` в `src/store/sagas/rootSaga.ts`.
- App: кнопка «Сложи слог» и рендер `<PairSyllableRoundContainer key={roundKey} />` при `currentRound.type === 'pairSyllable'` — `src/App.tsx`.

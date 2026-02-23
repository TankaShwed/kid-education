/**
 * Интерфейс озвучки (TTS).
 * Сейчас — браузерный speechSynthesis, позже можно подставить другой провайдер.
 */

export interface SpeakOptions {
  /** Скорость речи (0.1–10, 1 — норма). Меньше = медленнее, для акцента на слоге — ~0.55. */
  rate?: number;
}

export interface TTSProvider {
  /** Произнести текст. Ждём окончания воспроизведения (или отмены). */
  speak(text: string, options?: SpeakOptions): Promise<void>;
  /** Остановить текущую озвучку */
  cancel(): void;
}

const DEFAULT_RATE = 0.9;
/** Скорость для протяжного произнесения слога (акцент) */
export const SYLLABLE_RATE = 0.55;

/** Провайдер на базе SpeechSynthesis API */
export function createBrowserTTS(): TTSProvider {
  return {
    speak(text: string, options?: SpeakOptions): Promise<void> {
      return new Promise((resolve, reject) => {
        if (!window.speechSynthesis) {
          reject(new Error('SpeechSynthesis not supported'));
          return;
        }
        // Не вызываем cancel() здесь: в ряде браузеров это мешает воспроизведению.
        // Отмена только через явный вызов cancel() (например, в cleanup при смене раунда).
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'ru-RU';
        u.rate = options?.rate ?? DEFAULT_RATE;
        u.onend = () => resolve();
        u.onerror = (e) => {
          // Отмена (при смене раунда/размонтировании) не считаем ошибкой
          if (e.error === 'canceled') {
            resolve();
          } else {
            reject(e);
          }
        };
        window.speechSynthesis.speak(u);
      });
    },
    cancel() {
      window.speechSynthesis?.cancel();
    },
  };
}

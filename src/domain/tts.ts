/**
 * Интерфейс озвучки (TTS).
 * Сейчас — браузерный speechSynthesis, позже можно подставить другой провайдер.
 */

export interface TTSProvider {
  /** Произнести текст. Ждём окончания воспроизведения (или отмены). */
  speak(text: string): Promise<void>
  /** Остановить текущую озвучку */
  cancel(): void
}

/** Провайдер на базе SpeechSynthesis API */
export function createBrowserTTS(): TTSProvider {
  return {
    speak(text: string): Promise<void> {
      return new Promise((resolve, reject) => {
        if (!window.speechSynthesis) {
          reject(new Error('SpeechSynthesis not supported'))
          return
        }
        window.speechSynthesis.cancel()
        const u = new SpeechSynthesisUtterance(text)
        u.lang = 'ru-RU'
        u.rate = 0.9
        u.onend = () => resolve()
        u.onerror = (e) => reject(e)
        window.speechSynthesis.speak(u)
      })
    },
    cancel() {
      window.speechSynthesis?.cancel()
    },
  }
}

import { test, expect } from '@playwright/test';

test.describe('Выбери слог', () => {
  test('страница загружается и показывает заголовок', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('app')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Учимся читать' })
    ).toBeVisible();
  });

  test('есть кнопка сложности и кнопка Начать, после клика — варианты слогов', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page.getByTestId('difficulty-trigger')).toBeVisible();
    const startBtn = page.getByTestId('pick-syllable-start');
    await expect(startBtn).toBeVisible();
    await startBtn.click();
    const options = page.getByTestId('pick-syllable-options');
    await expect(options).toBeVisible();
    const buttons = options.getByRole('button');
    await expect(buttons).toHaveCount(4); // по умолчанию 4 варианта
  });

  test('при клике на правильный слог появляется следующий вопрос', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByTestId('pick-syllable-start').click();
    const options = page.getByTestId('pick-syllable-options');
    await expect(options).toBeVisible();
    const instruction = page.getByTestId('pick-syllable-instruction');
    await expect(instruction).toBeVisible();
    const targetText = await instruction.locator('strong').textContent();
    const target = targetText?.trim() ?? '';
    const correctButton = page.getByTestId(`pick-syllable-option-${target}`);
    await correctButton.click();
    // После правильного ответа TTS говорит "Правильно! Молодец!", затем загружается новый раунд с кнопкой «Начать»
    await expect(page.getByTestId('pick-syllable-start')).toBeVisible({
      timeout: 8000,
    });
    await page.getByTestId('pick-syllable-start').click();
    const optionsAfter = page.getByTestId('pick-syllable-options');
    await expect(optionsAfter.getByRole('button')).toHaveCount(4);
  });
});

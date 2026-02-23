import { test, expect } from '@playwright/test'

test.describe('Выбери слог', () => {
  test('страница загружается и показывает заголовок', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Учимся читать' })).toBeVisible()
  })

  test('есть кнопка сложности и варианты слогов', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('button', { name: /Сложность/ })).toBeVisible()
    const options = page.getByRole('group', { name: 'Варианты слогов' })
    await expect(options).toBeVisible()
    const buttons = options.getByRole('button')
    await expect(buttons).toHaveCount(4) // по умолчанию 4 варианта
  })

  test('при клике на правильный слог появляется следующий вопрос', async ({ page }) => {
    await page.goto('/')
    const group = page.getByRole('group', { name: 'Варианты слогов' })
    await expect(group).toBeVisible()
    const instruction = page.getByText(/Выбери слог/)
    await expect(instruction).toBeVisible()
    const targetText = await instruction.locator('strong').textContent()
    const target = targetText?.trim() ?? ''
    const correctButton = group.getByRole('button', { name: target })
    await correctButton.click()
    // После правильного ответа TTS говорит "Правильно! Молодец!", затем показывается новый раунд
    const groupAfter = page.getByRole('group', { name: 'Варианты слогов' })
    await expect(groupAfter.getByRole('button')).toHaveCount(4, { timeout: 8000 })
  })
})

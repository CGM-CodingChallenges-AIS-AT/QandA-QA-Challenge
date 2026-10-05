import { expect, test } from '@playwright/test'

test('speichert eine Frage und zeigt ihre Antworten an', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Frage', { exact: true }).fill('Was gibt es zum Mittagessen?')
  await page.getByLabel('Antworten (eine pro Zeile)').fill('Nudeln\nPizza')
  await page.getByRole('button', { name: 'Frage speichern' }).click()
  await expect(page.getByRole('status')).toHaveText('Frage gespeichert.')

  await page.getByLabel('Gesuchte Frage').fill('Was gibt es zum Mittagessen?')
  await page.getByRole('button', { name: 'Antworten anzeigen' }).click()
  await expect(page.getByRole('listitem')).toHaveText(['Nudeln', 'Pizza'])
})

test('liefert die Standardantwort für eine unbekannte Frage', async ({ request }) => {
  const response = await request.get('/api/questions', { params: { question: 'Unbekannt?' } })
  expect(response.ok()).toBeTruthy()
  expect(await response.json()).toEqual({
    answers: ['Die Antwort auf die Frage nach dem Leben, dem Universum und dem ganzen Rest ist 42.'],
  })
})

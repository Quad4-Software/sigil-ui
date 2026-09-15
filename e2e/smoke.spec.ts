import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('page renders the playground', async ({ page }) => {
  await expect(page.getByRole('button', { name: 'Open dialog' })).toBeVisible()
  await expect(page.getByRole('tab', { name: 'Usage' })).toBeVisible()
})

test('dialog opens, traps focus, and restores on Escape', async ({ page }) => {
  const trigger = page.getByRole('button', { name: 'Open dialog' })
  await trigger.click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog).toBeFocused()

  await page.keyboard.press('Escape')
  await expect(dialog).not.toBeVisible()
  await expect(trigger).toBeFocused()
})

test('tabs switch panels and follow arrow keys', async ({ page }) => {
  const usage = page.getByRole('tab', { name: 'Usage' })
  const billing = page.getByRole('tab', { name: 'Billing' })
  await expect(usage).toHaveAttribute('aria-selected', 'true')

  await billing.click()
  await expect(billing).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByRole('tabpanel')).toContainText('Billing')

  await billing.focus()
  await page.keyboard.press('ArrowLeft')
  await expect(usage).toBeFocused()
})

test('pane resizer adjusts sizes via pointer drag and keyboard', async ({ page }) => {
  const resizer = page.getByRole('separator').first()
  const firstPane = page.locator('.sig-pane').first()
  const before = (await firstPane.boundingBox())?.width ?? 0

  const box = await resizer.boundingBox()
  if (!box) throw new Error('resizer not visible')
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down()
  await page.mouse.move(box.x + 80, box.y + box.height / 2, { steps: 5 })
  await page.mouse.up()

  const after = (await firstPane.boundingBox())?.width ?? 0
  expect(after).toBeGreaterThan(before)

  await resizer.focus()
  const mid = (await firstPane.boundingBox())?.width ?? 0
  await page.keyboard.press('ArrowLeft')
  const final = (await firstPane.boundingBox())?.width ?? 0
  expect(final).toBeLessThan(mid)
})

import { test, expect } from '@playwright/test';

for (const [lang, route] of [['en', '/'], ['de', '/de/index.html'], ['tr', '/tr/index.html']]) {
  test(`${lang}: direct language page, responsive layout, and media assets`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(route);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('lang', lang);
    await expect(page.locator('.language-switch a[aria-current=page]')).toHaveText(lang.toUpperCase());
    for (const width of [1440, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    }
    await expect(page.locator('[data-project]')).toHaveCount(6);
    expect(await page.locator('.portrait img').evaluate(img => img.complete && img.naturalWidth > 0)).toBeTruthy();
    const video = page.locator('video');
    await video.scrollIntoViewIfNeeded();
    await expect.poll(() => video.evaluate(v => v.readyState)).toBeGreaterThanOrEqual(2);
    expect(await video.evaluate(v => v.controls && v.duration > 60 && !v.closest('details'))).toBeTruthy();
    expect(errors).toEqual([]);
  });
}

test('filters, study method selection, career keyboard control, and project navigation', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Backend', exact: true }).click();
  await expect(page.locator('[data-project]')).toHaveCount(3);
  await expect(page.locator('video')).toHaveCount(0);
  await page.getByRole('button', { name: 'Research & XR', exact: true }).click();
  await expect(page.locator('[data-project]')).toHaveCount(1);
  await page.getByRole('button', { name: 'CONTROLLER ONLY', exact: true }).click();
  await expect(page.locator('.method-output')).toContainText('Select with controller');
  await page.getByRole('button', { name: 'Games & simulation', exact: true }).click();
  await expect(page.locator('[data-project]')).toHaveCount(2);
  await page.getByRole('tab').first().focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('tab').nth(1)).toBeFocused();
  await expect(page.getByRole('tabpanel')).toContainText('Backend Developer');
  await page.getByRole('button', { name: 'See the project' }).click();
  await expect(page).toHaveURL(/#project-1$/);
  await expect(page.locator('[data-project]')).toHaveCount(6);
  await expect(page.locator('#project-1')).toBeFocused();
});

test('language navigation preserves the section and trailer actually plays', async ({ page }) => {
  await page.goto('/#contact');
  await page.getByRole('link', { name: 'Deutsch', exact: true }).click();
  await expect(page).toHaveURL('/de/index.html#contact');
  await expect(page.locator('#contact h2')).toContainText('Ein Projekt');
  await page.getByRole('link', { name: 'Türkçe', exact: true }).click();
  await expect(page).toHaveURL('/tr/index.html#contact');
  await expect(page.locator('#contact h2')).toContainText('Bir proje');
  const video = page.locator('video');
  await video.scrollIntoViewIfNeeded();
  await video.evaluate(async v => { v.muted = true; await v.play(); });
  await expect.poll(() => video.evaluate(v => v.currentTime)).toBeGreaterThan(0.2);
  await video.evaluate(v => v.pause());
});

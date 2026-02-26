import { test, expect } from '@playwright/test'

test.describe('Bottom navigation', () => {
  test('all nav tabs navigate correctly', async ({ page }) => {
    await page.goto('/awl/')
    await expect(page).toHaveURL(/\/beranda/)

    await page.getByTestId('nav-peta').click()
    await expect(page).toHaveURL(/\/peta/)

    await page.getByTestId('nav-monitoring').click()
    await expect(page).toHaveURL(/\/monitoring/)

    await page.getByTestId('nav-komparasi').click()
    await expect(page).toHaveURL(/\/komparasi/)

    await page.getByTestId('nav-info').click()
    await expect(page).toHaveURL(/\/info/)

    await page.getByTestId('nav-beranda').click()
    await expect(page).toHaveURL(/\/beranda/)
  })
})

test.describe('Beranda', () => {
  test('station buttons navigate to Analisa', async ({ page }) => {
    await page.goto('/awl/beranda')
    await page.getByTestId('station-1').click()
    await expect(page).toHaveURL(/\/analisa/)
    await expect(page.getByRole('heading', { name: 'Analisa' })).toBeVisible()
  })
})

test.describe('Analisa', () => {
  test('back button returns to previous page', async ({ page }) => {
    await page.goto('/awl/beranda')
    await page.getByTestId('station-1').click()
    await expect(page).toHaveURL(/\/analisa/)
    await page.getByTestId('analisa-back').click()
    await expect(page).toHaveURL(/\/beranda/)
  })

  test('tabs switch (Hari, Bulan, Tahun)', async ({ page }) => {
    await page.goto('/awl/analisa')
    await page.getByTestId('analisa-tab-hari').click()
    await expect(page.getByTestId('analisa-tab-hari')).toHaveClass(/border-blue-600/)
    await page.getByTestId('analisa-tab-bulan').click()
    await expect(page.getByTestId('analisa-tab-bulan')).toHaveClass(/border-blue-600/)
    await page.getByTestId('analisa-tab-tahun').click()
    await expect(page.getByTestId('analisa-tab-tahun')).toHaveClass(/border-blue-600/)
  })

  test('download button is clickable', async ({ page }) => {
    await page.goto('/awl/analisa')
    await expect(page.getByTestId('analisa-download')).toBeEnabled()
    await page.getByTestId('analisa-download').click()
    // No error = button works (download may do nothing in test env)
  })
})

test.describe('Peta', () => {
  test('search, refresh, legend, navigation buttons are clickable', async ({ page }) => {
    await page.goto('/awl/peta')
    await page.getByTestId('peta-search').click()
    await page.getByTestId('peta-refresh').click()
    await page.getByTestId('peta-legend').click()
    await expect(page.getByTestId('map-legend-toggle')).toBeVisible()
    await page.getByTestId('peta-legend').click()
    await page.getByTestId('peta-navigation').click()
  })

})

test.describe('Monitoring', () => {
  test('settings open, apply, close', async ({ page }) => {
    await page.goto('/awl/monitoring')
    await page.getByTestId('monitoring-settings').click()
    await expect(page.getByText('Konfigurasi Batas Siaga')).toBeVisible()
    await page.getByTestId('threshold-warning-up').click()
    await page.getByTestId('monitoring-apply').click()
    await expect(page.getByText('Konfigurasi Batas Siaga')).not.toBeVisible()
  })

  test('settings close (X) button', async ({ page }) => {
    await page.goto('/awl/monitoring')
    await page.getByTestId('monitoring-settings').click()
    await expect(page.getByText('Konfigurasi Batas Siaga')).toBeVisible()
    await page.getByTestId('monitoring-settings-close').click()
    await expect(page.getByText('Konfigurasi Batas Siaga')).not.toBeVisible()
  })

  test('log toggle expands and collapses', async ({ page }) => {
    await page.goto('/awl/monitoring')
    await expect(page.getByText('Log Pembacaan')).toBeVisible()
    await page.getByTestId('monitoring-log-toggle').click()
    await expect(page.locator('table')).not.toBeVisible()
    await page.getByTestId('monitoring-log-toggle').click()
    await expect(page.locator('table')).toBeVisible()
  })
})

import { test, expect } from '@playwright/test';

test.describe('Naver Mail Interface Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Naver Mail
    await page.goto('https://mail.naver.com');
    // Add login steps here if needed
  });

  test('should display main mail interface elements', async ({ page }) => {
    // Check header elements
    await expect(page.locator('.main_header')).toBeVisible();
    await expect(page.locator('.logo_naver')).toBeVisible();
    await expect(page.locator('.menu_title')).toHaveText('받은메일함');
    
    // Check mail list container
    await expect(page.locator('.mail_list_wrap')).toBeVisible();
    await expect(page.locator('.mail_list')).toBeVisible();
  });

  test('should display mail items with correct structure', async ({ page }) => {
    // Check first mail item structure
    const firstMailItem = page.locator('.mail_item').first();
    await expect(firstMailItem.locator('.button_checkbox_wrap')).toBeVisible();
    await expect(firstMailItem.locator('.toggle_bookmark_wrap')).toBeVisible();
    await expect(firstMailItem.locator('.mail_sender')).toBeVisible();
    await expect(firstMailItem.locator('.mail_title')).toBeVisible();
  });

  test('should show correct mail metadata', async ({ page }) => {
    const firstMailItem = page.locator('.mail_item').first();
    
    // Check sender information
    await expect(firstMailItem.locator('.button_sender')).toBeVisible();
    
    // Check date and size
    await expect(firstMailItem.locator('.mail_date')).toBeVisible();
    await expect(firstMailItem.locator('.mail_volume')).toBeVisible();
  });

  test('should have working navigation elements', async ({ page }) => {
    // Check left navigation
    await expect(page.locator('.lnb_mailbox')).toBeVisible();
    await expect(page.locator('.mailbox_label')).toContainText(['전체메일', '받은메일함', '보낸메일함']);
    
    // Check pagination
    await expect(page.locator('.pagination')).toBeVisible();
    await expect(page.locator('.page_list')).toBeVisible();
  });

  test('should display unread mail count', async ({ page }) => {
    // Check unread mail count in header
    const unreadCount = page.locator('.menu_count .count');
    await expect(unreadCount).toBeVisible();
    
    // Verify count format (should be a number)
    const countText = await unreadCount.textContent();
    expect(countText).toMatch(/^\d+$/);
  });

  test('should have working mail actions', async ({ page }) => {
    // Check mail action buttons
    await expect(page.locator('.button_checkbox_wrap')).toBeVisible();
    await expect(page.locator('.toggle_bookmark_wrap')).toBeVisible();
    await expect(page.locator('.button_preview')).toBeVisible();
    await expect(page.locator('.button_popup')).toBeVisible();
  });
}); 
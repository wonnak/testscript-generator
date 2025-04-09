import { test, expect } from '@playwright/test';

test.describe('TC0001_Send_NaverMail', () => {
  test.beforeEach(async ({ page }) => {
    // Set viewport size
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // Login steps from login-naver-mail-3.spec.ts
    await page.goto('https://nid.naver.com');
    
    // Language selection if needed
    const languageSelector = page.getByRole('combobox');
    const currentLanguage = await languageSelector.inputValue();
    if (currentLanguage !== 'ko_KR') {
      await languageSelector.selectOption('한국어');
    }
    
    // Login
    await page.locator('#id').fill('kimilsuk1310');
    const pwField = page.locator('#pw, input[type="password"]').first();
    await pwField.fill('Dlftjr*520');
    
    const loginButton = page.getByRole('button', { name: '로그인' });
    await loginButton.click();
    
    // Wait for login to complete
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
  });

  test('네이버 메일 보내기 테스트', async ({ page }) => {
    // Step-01: 네이버 메일 페이지 열기
    await page.goto('https://mail.naver.com');
    await page.waitForLoadState('networkidle');
    // Step-02: '메일 쓰기' 버튼 클릭
    const writeMailButton = page.getByRole('button', { name: '메일 쓰기' });
    await writeMailButton.click();
    await page.waitForLoadState('networkidle');
    
    // Step-03: 받는 사람 입력
    const recipientInput = page.getByRole('textbox', { name: '받는 사람' });
    await recipientInput.fill('kimilsuk1310@hanmail.net');
    
    // Step-04: 제목 입력
    const subjectInput = page.getByRole('textbox', { name: '제목' });
    await subjectInput.fill('자동화테스트 제목');
    
    // Step-05: 본문 입력
    const contentFrame = page.frameLocator('iframe[name="CONTENT_IFRAME"]');
    const contentEditor = contentFrame.getByRole('textbox');
    await contentEditor.fill('자동화테스트 본문');
    
    // Step-06: 보내기 버튼 클릭
    const sendButton = page.getByRole('button', { name: '보내기' });
    await sendButton.click();
    
    // Step-07: 전송 완료 메시지 확인
    const successMessage = page.getByText('메일이 전송되었습니다');
    await expect(successMessage).toBeVisible({ timeout: 10000 });
  });
}); 
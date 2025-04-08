import { test, expect } from '@playwright/test';
import { gotoAndSave, clickAndSave, fillAndSave, savePageHtml, selectOptionAndSave } from '../new/page-utils';

test('TC0001_Send_NaverMail', async ({ page }) => {
  // 테스트 환경 설정: 뷰포트 크기 설정
  await page.setViewportSize({ width: 1280, height: 720 });

  // 로그인 과정 (기존 코드 재사용)
  await gotoAndSave(page, 'https://nid.naver.com', 'naver-login');
  
  const loginButton = page.getByRole('button', { name: '로그인' });
  await expect(loginButton).toBeVisible();
  
  const languageSelector = page.getByRole('combobox');
  const currentLanguage = await languageSelector.inputValue();
  
  if (currentLanguage !== 'ko_KR') {
    await selectOptionAndSave(languageSelector, '한국어', 'language-to-korean');
    await expect(languageSelector).toHaveValue('ko_KR');
  }
  
  const idInput = page.getByRole('textbox', { name: '아이디' });
  if (!(await idInput.isVisible())) {
    await page.locator('#id').fill('kimilsuk1310');
  } else {
    await idInput.fill('kimilsuk1310');
  }
  
  const pwField = page.locator('#pw, input[type="password"]').first();
  await pwField.fill('Dlftjr*520');
  
  await savePageHtml(page, 'credentials-filled');
  await clickAndSave(loginButton, 'login-click');
  
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);

  // Step-01: 네이버 메일 페이지 열기
  await gotoAndSave(page, 'https://mail.naver.com', '../page-snapshot/Step-01.html');
  await page.waitForLoadState('networkidle');

  // Step-02: '메일 쓰기' 버튼 클릭
  const writeMailButton = page.getByRole('button', { name: '메일 쓰기' });
  await clickAndSave(writeMailButton, '../page-snapshot/Step-02.html');
  await page.waitForLoadState('networkidle');

  // Step-03: 받는 사람 입력
  const recipientInput = page.getByRole('textbox', { name: '받는 사람' });
  await fillAndSave(recipientInput, 'kimilsuk1310@hanmail.net', '../page-snapshot/Step-03.html');

  // Step-04: 제목 입력
  const subjectInput = page.getByRole('textbox', { name: '제목' });
  await fillAndSave(subjectInput, '자동화테스트 제목', '../page-snapshot/Step-04.html');

  // Step-05: 본문 입력
  const bodyInput = page.frameLocator('iframe[name="CONTENT_IFRAME"]').getByRole('textbox');
  await fillAndSave(bodyInput, '자동화테스트 본문', '../page-snapshot/Step-05.html');

  // Step-06: '보내기' 버튼 클릭
  const sendButton = page.getByRole('button', { name: '보내기' });
  await clickAndSave(sendButton, '../page-snapshot/Step-06.html');
  await page.waitForLoadState('networkidle');

  // Step-07: '메일이 전송되었습니다' 문구 확인
  const successMessage = page.getByText('메일이 전송되었습니다');
  await expect(successMessage).toBeVisible();
  await savePageHtml(page, '../page-snapshot/Step-07.html');
});
import { test, expect } from '@playwright/test';
import { gotoAndSave, clickAndSave, selectOptionAndSave, savePageHtml } from '../new/page-utils';

test('네이버 로그인 테스트', async ({ page }) => {
  // 테스트 환경 설정: 뷰포트 크기 설정
  await page.setViewportSize({ width: 1280, height: 720 });
  
  // 1. 네이버 로그인 페이지 접속
  await gotoAndSave(page, 'https://nid.naver.com', 'naver-login');
  
  // 로그인 버튼 존재 확인
  const loginButton = page.getByRole('button', { name: '로그인' });
  await expect(loginButton).toBeVisible();
  
  // 2. 언어 변경 (English -> 한국어)
  // 언어 선택 요소 찾기
  const languageSelector = page.getByRole('combobox');
  
  // 현재 언어 확인
  const currentLanguage = await languageSelector.inputValue();
  console.log(`현재 언어: ${currentLanguage}`);
  
  // 만약 언어가 한국어로 설정되어 있지 않다면 한국어로 변경
  if (currentLanguage !== 'ko_KR') {
    await selectOptionAndSave(languageSelector, '한국어', 'language-to-korean');
    
    // 언어 변경 확인
    await expect(languageSelector).toHaveValue('ko_KR');
  }
  
  // 3. 로그인
  // 아이디 입력
  const idInput = page.getByRole('textbox', { name: '아이디' });
  // 아이디 입력 필드가 바로 찾아지지 않으면 ID를 통해 접근
  if (!(await idInput.isVisible())) {
    await page.locator('#id').fill('kimilsuk1310');
  } else {
    await idInput.fill('kimilsuk1310');
  }
  
  // 비밀번호 입력
  // 비밀번호 필드는 일반적으로 password 타입이므로 다른 방법으로 선택
  const pwField = page.locator('#pw, input[type="password"]').first();
  await pwField.fill('Dlftjr*520');
  
  // 로그인 정보 입력 후 상태 저장
  await savePageHtml(page, 'credentials-filled');
  
  // 로그인 버튼 클릭
  await clickAndSave(loginButton, 'login-click');
  
  // 로그인 성공 확인 - 네이버ID 요소 존재 확인
  // 페이지 로딩 대기
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000); // 추가 대기 시간
  
  // 로그인 성공 확인 (네이버 로그인 후 보이는 요소 확인)
  //await expect(page.getByText('네이버를 시작페이지로', { exact: false })).toBeVisible({ timeout: 10000 });
}); 
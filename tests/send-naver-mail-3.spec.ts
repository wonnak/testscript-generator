import { test, expect } from '@playwright/test';
import { gotoAndSave, clickAndSave, selectOptionAndSave, savePageHtml } from '../new/page-utils';

// 로그인을 위한 beforeEach 함수
test.beforeEach(async ({ page }) => {
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
  
  // 로그인 성공 확인
  // 페이지 로딩 대기
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000); // 추가 대기 시간
});

// 메일 쓰기 및 전송 테스트
test('네이버 메일 보내기 테스트', async ({ page }) => {
  // 1. 네이버 메일 페이지 접속
  await gotoAndSave(page, 'https://mail.naver.com', 'naver-mail');
  
  // 메일 쓰기 버튼 존재 확인
  const writeMailButton = page.getByRole('link', { name: '메일 쓰기' });
  await expect(writeMailButton).toBeVisible();
  
  // 2. 메일 쓰기
  // 메일 쓰기 버튼 클릭
  await clickAndSave(writeMailButton, 'write-mail-click');
  
  // 받는 사람 입력
  const recipientField = page.getByRole('textbox', { name: '받는사람' });
  await recipientField.fill('kimilsuk1310@hanmail.net');
  
  // 제목 입력
  const subjectField = page.getByRole('textbox', { name: '제목' });
  await subjectField.fill('자동화테스트');
  
  // 본문 iframe 찾기 및 내용 입력
  // 프레임 요소 찾기
  const frameElement = page.frameLocator('iframe.se2_input_wysiwyg').first();
  
  // 프레임 내부의 본문 요소 찾기 및 내용 입력
  await frameElement.locator('body').fill('테스트');
  
  // 입력 상태 저장
  await savePageHtml(page, 'mail-inputs-filled');
  
  // 보내기 버튼 클릭
  const sendButton = page.getByRole('button', { name: '보내기' });
  await clickAndSave(sendButton, 'send-mail-click');
  
  // 3. 전송 완료 메시지 확인
  const successMessage = page.getByText('메일이 전송되었습니다');
  await expect(successMessage).toBeVisible({ timeout: 10000 });
  
  // 결과 페이지 저장
  await savePageHtml(page, 'mail-sent-confirmation');
});
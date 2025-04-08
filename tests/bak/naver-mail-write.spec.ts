import { test, expect } from '@playwright/test';

test('네이버 메일 작성 테스트', async ({ page }) => {
  // 1. 브라우저 뷰포트 설정
  await page.setViewportSize({ width: 1280, height: 720 });

  // 2. 네이버 로그인 페이지 접속 및 언어 설정
  await page.goto('https://mail.naver.com');
  await page.locator('#locale_switch').selectOption('ko_KR');
  
  // 로그인 페이지 확인
  await expect(page.getByRole('heading', { name: 'NAVER' })).toBeVisible();
  
  // 3. 로그인 정보 입력
  await page.getByRole('textbox', { name: '아이디 또는 전화번호' }).fill('kimilsuk1310');
  await page.getByRole('textbox', { name: '비밀번호' }).fill('Dlftjr*520');
  await page.getByRole('button', { name: '로그인' }).click();

  // 로그인 완료 확인
  await expect(page.getByRole('link', { name: '메일 쓰기' })).toBeVisible();

  // 4. 메일 작성 페이지로 이동
  await page.getByRole('link', { name: '메일 쓰기' }).click();

  // 5. 메일 작성 폼 요소들의 존재 확인
  // 메일 작성 폼이 로드될 때까지 대기
  await page.waitForSelector('.mail_write_form');
  
  // 제목 필드와 보내기 버튼 확인
  const subjectField = page.getByRole('textbox', { name: '제목' });
  const contentFrame = page.frameLocator('.iframe_area iframe').first();
  const sendButton = page.getByRole('button', { name: '보내기' });

  await expect(subjectField).toBeVisible();
  await expect(contentFrame).toBeTruthy();
  await expect(sendButton).toBeVisible();

  // 6. 메일 내용 입력
  const testData = {
    recipient: 'kimilsuk1310@hanmail.net',
    subject: '자동화테스트',
    content: '이 메일은 자동화 테스트로 작성되었습니다.'
  };

  // 받는 사람 영역
  const recipientArea = page.locator('.addresses_wrap .to_area .user_input');
  await recipientArea.click();
  
  // 입력창이 나타날 때까지 대기 (명시적 대기보다 더 안정적)
  await page.waitForSelector('.layer_addmail');
  
  // 받는 사람 입력 필드 선택 후 입력
  const inputField = page.locator('.layer_addmail .emailinput');
  await inputField.fill(testData.recipient);
  await page.keyboard.press('Enter');
  
  // 제목 입력
  await subjectField.fill(testData.subject);
  
  // iframe 내의 본문 에디터에 텍스트 입력
  await contentFrame.getByRole('textbox').fill(testData.content);

  // 7. 보내기 버튼 클릭
  await sendButton.click();

  // 8. 전송 완료 메시지 확인
  await expect(page.getByText('메일을 발송했습니다')).toBeVisible();
}); 
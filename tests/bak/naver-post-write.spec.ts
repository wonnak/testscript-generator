import { test, expect } from '@playwright/test';

test('네이버 메일 작성 테스트', async ({ page }) => {
  // 1. 브라우저 뷰포트 설정
  await page.setViewportSize({ width: 1280, height: 720 });

  // 2. 네이버 메일 로그인
  await page.goto('https://mail.naver.com');
  await page.locator('#locale_switch').selectOption('ko_KR');
  
  // 로그인 정보 입력
  await page.getByRole('textbox', { name: '아이디 또는 전화번호' }).fill('kimilsuk1310');
  await page.getByRole('textbox', { name: '비밀번호' }).fill('Dlftjr*520');
  await page.getByRole('button', { name: '로그인' }).click();

  // 3. 메일 작성 페이지로 이동
  await page.getByRole('link', { name: '메일 쓰기' }).click();

  // 4. 메일 작성 폼 요소들의 존재 확인
  const recipientField = page.getByRole('combobox', { name: '받는사람' });
  const subjectField = page.getByRole('textbox', { name: '제목' });
  const contentFrame = page.getByRole('main').locator('iframe').contentFrame();
  const sendButton = page.getByRole('button', { name: '보내기' });

  await expect(recipientField).toBeVisible();
  await expect(subjectField).toBeVisible();
  await expect(contentFrame.getByLabel('본문 내용')).toBeVisible();
  await expect(sendButton).toBeVisible();

  // 5. 메일 내용 입력
  const testData = {
    recipient: 'kimilsuk1310@hanmail.net',
    subject: '자동화테스트',
    content: '테스트'
  };

  await recipientField.click();
  await page.getByRole('option', { name: testData.recipient }).click();
  await subjectField.fill(testData.subject);
  await contentFrame.getByLabel('본문 내용').fill(testData.content);

  // 6. 메일 전송
  await sendButton.click();

  // 7. 전송 완료 확인
  await expect(page.getByText('메일을 발송했습니다')).toBeVisible();
}); 
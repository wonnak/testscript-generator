import { test, expect } from '@playwright/test';

test('네이버 포스트 작성 테스트', async ({ page }) => {
  // 1. 브라우저 뷰포트 설정
  await page.setViewportSize({ width: 1280, height: 720 });

  // 2. 네이버 로그인 페이지 접속 및 언어 설정
  await page.goto('https://naver.com');
  
  // 로그인 페이지로 이동
  await page.getByRole('link', { name: '로그인' }).click();
  
  // 로그인 페이지 확인
  await expect(page.getByRole('heading', { name: 'NAVER' })).toBeVisible();
  
  // 3. 로그인 정보 입력
  await page.getByRole('textbox', { name: '아이디' }).fill('kimilsuk1310');
  await page.getByRole('textbox', { name: '비밀번호' }).fill('Dlftjr*520');
  await page.getByRole('button', { name: '로그인' }).click();

  // 4. 네이버 블로그로 이동
  await page.goto('https://blog.naver.com');
  
  // 내 블로그로 이동
  await page.getByRole('link', { name: '내 블로그' }).click();
  
  // 5. 글 작성 버튼 클릭
  await page.getByRole('link', { name: '글쓰기' }).click();
  
  // 글 작성 폼으로 전환
  await page.waitForSelector('iframe#mainFrame');
  const mainFrame = page.frameLocator('#mainFrame');
  
  // 6. 글 작성 폼 요소들의 존재 확인
  const titleField = mainFrame.getByRole('textbox', { name: '제목' });
  const editorFrame = mainFrame.frameLocator('.se2_input_area iframe');
  const publishButton = mainFrame.getByRole('button', { name: '발행' });

  await expect(titleField).toBeVisible();
  await expect(editorFrame).toBeTruthy();
  await expect(publishButton).toBeVisible();

  // 7. 포스트 내용 입력
  const testData = {
    title: '자동화 테스트 포스트',
    content: '이 글은 자동화 테스트로 작성되었습니다.'
  };

  await titleField.fill(testData.title);
  
  // iframe 내의 본문 에디터에 텍스트 입력
  await editorFrame.getByRole('textbox').fill(testData.content);

  // 8. 발행 버튼 클릭
  await publishButton.click();
  
  // 발행 설정 모달에서 확인 버튼 클릭
  await mainFrame.getByRole('button', { name: '확인' }).click();

  // 9. 발행 완료 확인
  await expect(mainFrame.getByText('포스트를 발행했습니다')).toBeVisible();
}); 
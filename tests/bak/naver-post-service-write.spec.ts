import { test, expect } from '@playwright/test';

test('네이버 포스트 서비스 글 작성 테스트', async ({ page }) => {
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

  // 4. 네이버 포스트로 이동
  await page.goto('https://post.naver.com/my.naver');
  
  // 포스트 서비스 접속 확인
  await expect(page.getByRole('heading', { name: '포스트' })).toBeVisible();
  
  // 5. 글 작성 버튼 클릭
  await page.getByRole('button', { name: '글쓰기' }).click();
  
  // 6. 글 작성 폼 요소들의 존재 확인
  const titleField = page.getByRole('textbox', { name: '제목' });
  const contentEditor = page.locator('.se-container');
  const publishButton = page.getByRole('button', { name: '발행' });

  await expect(titleField).toBeVisible();
  await expect(contentEditor).toBeVisible();
  await expect(publishButton).toBeVisible();

  // 7. 포스트 내용 입력
  const testData = {
    title: '네이버 포스트 자동화 테스트',
    content: '이 글은 자동화 테스트로 작성된 네이버 포스트입니다.'
  };

  await titleField.fill(testData.title);
  
  // 본문 에디터에 텍스트 입력
  await contentEditor.click();
  await page.keyboard.type(testData.content);
  
  // 8. 태그 추가
  const tagField = page.getByPlaceholder('태그 입력');
  await tagField.fill('테스트');
  await page.keyboard.press('Enter');
  await tagField.fill('자동화');
  await page.keyboard.press('Enter');

  // 9. 발행 버튼 클릭
  await publishButton.click();
  
  // 10. 발행 완료 확인
  await expect(page.getByText('포스트가 발행되었습니다.')).toBeVisible();
}); 
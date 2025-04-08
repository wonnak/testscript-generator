import { test, expect } from '@playwright/test';

test.describe('네이버 메일 전송 테스트', () => {
  test.beforeEach(async ({ page }) => {
    // 테스트 시작 전 기본 설정
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('네이버 메일 전송 테스트', async ({ page }) => {
    // 1. 네이버 메인 페이지 접속
    await page.goto('https://www.naver.com');
    
    // 메인 페이지 로드 확인
    await expect(page).toHaveTitle('NAVER');

    // 2. 로그인 버튼 클릭
    const loginButton = page.getByRole('link', { name: 'NAVER 로그인' });
    await loginButton.click();

    // 로그인 iframe 찾기
    const loginFrame = page.frameLocator('iframe[name="iframeLogin"]');
    
    // 3. 로그인 정보 입력
    await loginFrame.getByLabel('아이디').fill('kimilsuk1310');
    await loginFrame.getByLabel('비밀번호').fill('Dlftjr*520');
    
    // 로그인 버튼 클릭
    await loginFrame.getByRole('button', { name: '로그인' }).click();

    // 로그인 성공 확인 (메인 페이지 로드)
    await expect(page).toHaveTitle('NAVER');

    // 4. 메일 페이지로 이동
    const mailButton = page.getByRole('link', { name: '메일' });
    await mailButton.click();

    // 메일 페이지 로드 확인
    await expect(page.getByRole('heading', { name: '메일' })).toBeVisible();

    // 5. 메일 작성 페이지로 이동
    const writeMailButton = page.getByRole('button', { name: '메일쓰기' });
    await writeMailButton.click();

    // 메일 작성 페이지 로드 확인
    await expect(page.getByRole('heading', { name: '메일쓰기' })).toBeVisible();

    // 6. 받는 사람, 제목과 본문 입력
    await page.getByLabel('받는 사람').fill('kimilsuk1310@hanmail.net');
    await page.getByLabel('제목').fill('자동화테스트');
    await page.getByLabel('본문').fill('테스트');

    // 입력 필드 값 확인
    await expect(page.getByLabel('받는 사람')).toHaveValue('kimilsuk1310@hanmail.net');
    await expect(page.getByLabel('제목')).toHaveValue('자동화테스트');
    await expect(page.getByLabel('본문')).toHaveValue('테스트');

    // 7. 보내기 버튼 클릭
    const sendButton = page.getByRole('button', { name: '보내기' });
    await sendButton.click();

    // 전송 중 상태 표시 확인
    await expect(page.getByText('전송 중...')).toBeVisible();

    // 8. 전송 완료 메시지 확인
    await expect(page.getByText('메일이 전송되었습니다')).toBeVisible();
  });
}); 
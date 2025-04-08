import { test, expect } from '@playwright/test';

test.describe('네이버 로그인 테스트', () => {
  test('네이버 로그인 성공 테스트', async ({ page }) => {
    // 브라우저 설정 - 테스트 환경에 맞게 뷰포트 크기 설정
    await page.setViewportSize({ width: 1280, height: 720 });

    // 1. 네이버 로그인 페이지 접속
    await page.goto('https://nid.naver.com');
    
    // 로그인 버튼 존재 확인
    const loginButton = page.getByRole('button', { name: '로그인' });
    await expect(loginButton).toBeVisible();

    // 2. 언어 변경
    // 오른쪽 상단의 select 요소 찾기
    const languageSelector = page.getByRole('combobox');
    await languageSelector.click();
    
    // 언어 드롭다운이 표시될 때까지 대기
    await page.waitForTimeout(1000);
    
    // 한국어 옵션 선택
    await languageSelector.selectOption('ko_KR');
    
    // 한국어로 변경됐는지 확인
    await expect(languageSelector).toHaveValue('ko_KR');
    
    // 3. 로그인
    // 아이디 입력
    const idInput = page.getByRole('textbox', { name: '아이디' });
    await idInput.fill('kimilsuk1310');
    
    // 패스워드 입력
    const passwordInput = page.getByRole('textbox', { name: '비밀번호' });
    await passwordInput.fill('Dlftjr*520');
    
    // 입력이 완료될 때까지 잠시 대기
    await page.waitForTimeout(1000);
    
    // 로그인 버튼 클릭
    await loginButton.click();
    
    // 페이지 전환 대기
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000); // 추가 대기 시간
    
    // 로그인 성공 검증 - 여러 가능한 요소로 검증
    // URL 변경 여부 확인 (로그인 후 리디렉션)
    const currentUrl = page.url();
    console.log('Current URL after login:', currentUrl);
    
    // 로그인 페이지가 아닌지 확인 (로그인 성공의 간접적 증거)
    const loginForm = page.locator('#log\\.login');
    await expect(loginForm).not.toBeVisible({ timeout: 3000 });
  });
}); 
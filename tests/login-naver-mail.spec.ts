import { test, expect } from '@playwright/test';
import { gotoAndSave, clickAndSave, selectOptionAndSave } from '../new/page-utils';

test.describe('네이버 로그인 테스트', () => {
  test.beforeEach(async ({ page }) => {
    // 브라우저 설정
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('네이버 로그인 성공 테스트', async ({ page }) => {
    // 1. 네이버 로그인 페이지 접속 (랩핑 함수 사용)
    await gotoAndSave(page, 'https://nid.naver.com', 'naver-login-page');
    
    // // 로그인 버튼 존재 확인
    // const loginButton = page.getByRole('button', { name: '로그인' });
    // await expect(loginButton).toBeVisible();

    // // 2. 언어 변경
    // // 오른쪽 상단의 언어 선택 드롭다운 클릭
    // //await page.getByRole('option', { name: '한국어' }).click();
    // //await expect(languageDropdown).toHaveValue('ko');
    
    // const languageDropdown = page.getByRole('combobox', { name: '언어선택' });
    // await languageDropdown.click();
    
    // // 드롭다운이 열릴 때까지 잠시 대기
    // await page.waitForTimeout(1000);
    
    // // 한국어 선택 (select 요소의 value 직접 설정)
    
    // await languageDropdown.selectOption('ko_KR');
    
    // // 언어 변경 확인
    // await expect(languageDropdown).toHaveValue('ko_KR');

    // // 3. 로그인 정보 입력
    // await page.getByLabel('아이디').fill('kimilsuk1310');
    // await page.getByLabel('비밀번호').fill('Dlftjr*520');
    // await page.waitForTimeout(1000);
    
    // // 로그인 버튼 클릭
    // await loginButton.click();

    // // 4. 로그인 성공 검증
    // // 페이지 로딩 완료 대기
    // await page.waitForLoadState('networkidle');
    
    // // 왼쪽 상단의 네이버ID 요소 확인
    // const naverIdElement = page.getByRole('link', { name: '네이버ID' });
    // await expect(naverIdElement).toBeVisible({ timeout: 10000 });
  });
}); 


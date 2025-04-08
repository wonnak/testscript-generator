import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// HTML 저장 유틸리티 함수
export async function savePageHtml(page, filename) {
  // 저장할 디렉토리 경로
  const snapshotDir = path.join(process.cwd(), 'page-snapshots');
  
  // 디렉토리가 없으면 생성
  if (!fs.existsSync(snapshotDir)) {
    fs.mkdirSync(snapshotDir, { recursive: true });
  }
  
  try {
    // 페이지가 안정화될 때까지 짧게 대기
    await page.waitForTimeout(500);
    
    // HTML 컨텐츠 가져오기
    const html = await page.content();
    
    // 파일 저장
    const filePath = path.join(snapshotDir, filename);
    fs.writeFileSync(filePath, html, 'utf8');
    
    console.log(`HTML saved to: ${filePath}`);
  } catch (error) {
    console.error(`Error saving HTML: ${error.message}`);
  }
}

test('test', async ({ page }) => {
  await page.goto('https://nid.naver.com');
  await page.waitForTimeout(5000)
  await page.locator('#locale_switch').click();
  await page.locator('#locale_switch').selectOption('ko_KR');
  await page.getByRole('textbox', { name: '아이디 또는 전화번호' }).fill('kimilsuk1310');
  await page.getByRole('textbox', { name: '비밀번호' }).fill('Dlftjr*520');
  await page.getByRole('button', { name: '로그인' }).click();
  await page.waitForTimeout(5000)
  
  await page.goto('https://mail.naver.com');
  await page.waitForTimeout(1000)
  await savePageHtml(page, '../page-snapshots/Step-01.html');
  await page.getByRole('link', { name: '메일 쓰기' }).click();
  await page.waitForTimeout(1000)
  await savePageHtml(page, '../page-snapshots/Step-02.html');
  await page.getByRole('combobox', { name: '받는사람' }).fill('kimilsuk1310@hanmail.net');
  await page.waitForTimeout(1000)
  await savePageHtml(page, '../page-snapshots/Step-03.html');
  await page.getByRole('textbox', { name: '제목' }).fill('자동화테스트 제목');
  await page.waitForTimeout(1000)
  await savePageHtml(page, '../page-snapshots/Step-04.html');
  await page.getByRole('main').locator('iframe').contentFrame().getByLabel('본문 내용').fill('자동화테스트 본문');
  await page.waitForTimeout(1000)
  await savePageHtml(page, '../page-snapshots/Step-05.html');
  await page.getByRole('button', { name: '보내기' }).click();
  await page.waitForTimeout(1000)
  await savePageHtml(page, '../page-snapshots/Step-06.html');
});


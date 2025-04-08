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

// 랩핑 함수들 - 각 동작 후 HTML 저장
export async function gotoAndSave(page, url, snapshotName) {
  await page.goto(url);
  // 페이지 로딩이 완료될 때까지 대기
  await page.waitForLoadState('networkidle');
  await savePageHtml(page, `${snapshotName || new URL(url).hostname}-goto.html`);
  // 가장 최근 스냅샷 저장
  await savePageHtml(page, 'latest-snapshot.html');
}

export async function clickAndSave(element, snapshotName) {
  const page = element.page();
  await element.click();
  // 클릭 후 발생할 수 있는 네비게이션이나 AJAX 요청 대기
  try {
    await page.waitForLoadState('networkidle', { timeout: 5000 });
  } catch (error) {
    // 네트워크 요청이 없거나 이미 완료된 경우 타임아웃 무시
    console.log('No navigation detected after click');
  }
  // 안정화를 위한 추가 대기
  await page.waitForTimeout(1000);
  
  await savePageHtml(page, `${snapshotName || 'click'}-snapshot.html`);
  // 가장 최근 스냅샷 저장
  await savePageHtml(page, 'latest-snapshot.html');
}

export async function selectOptionAndSave(element, value, snapshotName) {
  const page = element.page();
  await element.selectOption(value);
  
  // 선택 옵션 변경 후 페이지 업데이트 대기
  try {
    await page.waitForLoadState('networkidle', { timeout: 5000 });
  } catch (error) {
    // 네트워크 요청이 없거나 이미 완료된 경우 타임아웃 무시
    console.log('No navigation detected after select option');
  }
  // 안정화를 위한 추가 대기
  await page.waitForTimeout(1000);
  
  await savePageHtml(page, `${snapshotName || `select-${value}`}-snapshot.html`);
  // 가장 최근 스냅샷 저장
  await savePageHtml(page, 'latest-snapshot.html');
}

export async function fillAndSave(element, value, snapshotName) {
  const page = element.page();
  await element.fill(value);
  
  // 입력 후 페이지 업데이트 대기
  try {
    await page.waitForLoadState('networkidle', { timeout: 5000 });
  } catch (error) {
    // 네트워크 요청이 없거나 이미 완료된 경우 타임아웃 무시
    console.log('No navigation detected after fill');
  }
  // 안정화를 위한 추가 대기
  await page.waitForTimeout(1000);
  
  await savePageHtml(page, `${snapshotName || `fill-${value}`}-snapshot.html`);
  // 가장 최근 스냅샷 저장
  await savePageHtml(page, 'latest-snapshot.html');
} 
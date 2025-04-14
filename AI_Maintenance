# AI 유지보수 프롬프트

---

### 🔧 목적:

아래 명령어로 테스트 스크립를 실행합니다. 웹 페이지의 변경으로 인해 Playwright 테스트가 실패할 경우, 아래의 정보를 바탕으로 **테스트 스크립트를 수정**하여 **동일한 테스트 목적을 달성하도록** 코드를 유지보수해 주세요.

```
npx playwright test tests/TC_0001_login_naverWebSite.ts
```

---

### 📌 테스트 스크립트 설명:

```
TC_0001_login_naverWebSite : 네이버 웹 사이트에 로그인 합니다.
```

---

### ✅ 테스트 스크립트 유지보수를 위한 레퍼런스

- 마지막 성공한 테스트 스크립트: tests/TC_0001_login_naverWebSite.ts
- 마지막 성공 시점의 html 파일들: htmls/TC_0001_login_naverWebSite/lastSucessHtmls/ (최근에 성공한 시점의 HTML 파일들 폴더)
- 마지막 실패한 테스트 스크립트 라인 정보: fails/TC_0001_login_naverWebSite/lastFailedLine (Playwright 에러 메시지 포함한)
- 마지막으로 실패한 테스트의 html (가장 마지막 html 1개): htmls/TC_0001_login_naverWebSite/lastFailedHtmls/lastFailedHtml (실패한 테스트의 html 파일들 중에서도 실패한 지점에 해당되는 가장 마지막 파일.)

---

### 🛠 요청사항:

- 웹페이지의 변화로 인해 실패한 테스트 코드의 **해당 부분만 수정**해 주세요.
- 테스트의 목적은 **그대로 유지**되어야 합니다.
- 주어진 성공/실패 시점 HTML과 실패 라인 정보를 기반으로 **변화된 selector, DOM 구조, 조건 등을 반영**해 주세요.
- 필요 시 다음을 적용해 주세요:
    - selector 수정
    - `waitForSelector`, `locator`, `timeout`, `getByRole` 등의 조건 추가
    - 클릭 방식, 대기 방식 등

---

## 📤 출력 포맷:

- 수정 이후 아래의 정보를 보여줘야 합니다.

```
// ✅ 수정된 Playwright 테스트 코드 (전체 또는 수정된 함수/섹션)
[수정된 코드]
```

```
// ✨ 수정 요약
- 어떤 코드 라인을 어떤 이유로 수정했는지 간단하게 설명
- 실패 원인과 HTML 구조 변화에 대한 설명
```

---

## 부가 참고사항

- 테스트 스크립트 이름은 “테스트케이스 이름.ts” 형식을 따릅니다.
- 각 테스트가 실행될 때마다 HTML 스냅샷은 `htmls/<테스트케이스명>/YYYY-MM-DD_HH-mm-ss/` 경로에 저장됩니다.
- 성공 시 `lastSuccessHtmls` 심볼릭 링크가 해당 HTML 폴더를 가리키고,
- 실패 시 `lastFailedHtmls` 심볼릭 링크가 가장 마지막 실패 시점의 HTML 폴더를 가리킵니다.
- 또한 실패 시 `lastFailedHtmls` 안의 `lastFailedHtml` 은 실패 시점의 HTML 파일 하나를 가리킵니다.

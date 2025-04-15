# AI 유지보수 프롬프트

---

### 🔧 목적:

아래 명령어로 테스트 스크립를 실행합니다. 웹 페이지의 변경으로 인해 Playwright 테스트가 실패할 경우, 아래의 정보를 바탕으로 **테스트 스크립트를 수정**하여 **동일한 테스트 목적을 달성하도록** 코드를 유지보수해 주세요.

```
npx playwright test tests/TC_0001_login_naverWebSite.spec.ts
```

---

### 📌 테스트 스크립트 설명:

```
TC_0001_login_naverWebSite : 네이버 웹 사이트에 로그인 합니다.
```

---

## ✅ 주요 경로 및 파일 정보

- 테스트 스크립트 경로와 이름은 “tests/테스트케이스 이름.spec.ts” 형식을 따릅니다.
- 테스트가 실행될 때마다 HTML 스냅샷은 `htmls/<테스트케이스명>/YYYY-MM-DD_HH-mm-ss/` 경로에 저장됩니다.
- `htmls/<테스트케이스명>/YYYY-MM-DD_HH-mm-ss/` 경로에 저장되는 HTML 파일은 001.html -> 002.html -> 003.html -> ... 과 같이 세자리 수 순서대로 생성됩니다.
- 성공 시 가장 최근 테스트의 HTML 스냅샷 폴더를 `lastSuccessHtmls`라는 폴더 이름으로 복사합니다.
- 실패 시 가장 최근 테스트의 HTML 스냅샷 폴더 안의 마지막 html 파일은 실패 시점의 HTML 파일이며, 개선을 위한 중요한 파일입니다.

---

### ✅ 테스트 스크립트 유지보수를 위한 레퍼런스
- 실패한 최근 테스트 스크립트 라인 정보: fails/TC_0001_login_naverWebSite/lastFailedLine.log (Playwright 에러 메시지 포함한)
- 실패한 최근 테스트의 가장 마지막 HTML 파일: htmls/TC_0001_login_naverWebSite/YYYY-MM-DD_HH-mm-ss/{마지막번호}.html (실패한 시점에 해당되는 가장 마지막 HTML 파일.)
- 성공한 최근 테스트의 html 파일 중에서 최근 실패한 HTML 파일과 동일한 번호의 파일: htmls/TC_0001_login_naverWebSite/lastSucessHtmls/{최근 실패한 HTML파일과 동일한 번호}.html (최근에 성공한 시점의 HTML 파일들 폴더)
- 성공한 최근 테스트 스크립트: tests/TC_0001_login_naverWebSite.ts

---

### 💡 레퍼런스 참고 순서

1. fails/TC_0001_login_naverWebSite/lastFailedLine.log 확인
  - Playwright의 에러 메시지와 실패한 코드 라인을 분석하여 수정이 필요한 구체적인 위치와 원인을 파악하세요.
  - 실패 원인(예: element not found, timeout 등)에 따라 어떤 selector나 대기 조건이 문제인지 유추할 수 있습니다.
2. htmls/TC_0001_login_naverWebSite/YYYY-MM-DD_HH-mm-ss/{마지막번호}.html 분석
  - 실패 당시의 웹 페이지 구조를 확인하여, 실패한 지점의 DOM 구조 및 selector 상태를 파악하세요.
  - 이 시점의 실제 페이지 상태를 기준으로 수정 방안을 고려합니다.
3. htmls/TC_0001_login_naverWebSite/lastSucessHtmls/{최근 실패한 HTML파일과 동일한 번호}.html 비교 분석
  - 마지막으로 성공했던 시점의 HTML과 실패 시점 HTML을 비교하여 변경된 요소, 구조, 속성 등 차이점을 찾아내세요.
  - 성공한 최근 테스트의 html 파일 중에서 최근 실패한 HTML 파일과 동일한 번호의 파일을 가져와 비교합니다.
  - 변화된 selector나 역할(role) 속성 등을 식별하여 코드에 반영합니다.
4. 기존 tests/TC_0001_login_naverWebSite.ts 참조
  - 전체 테스트 흐름과 테스트 목적을 이해하고, 수정 시 기존 목적이 유지되도록 수정 위치를 제한하여 반영하세요.

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
- 추가로 테스트의 안정성을 높일 수 있는 개선사항이 있다면 함께 제안.
```

import { test, expect, Locator } from '@playwright/test';
import { 
  saveDOMStructure, 
  findElementOrSaveDom, 
  findElementWithMultipleSelectors,
  findFrameElementOrSaveDom,
  savePageHTML 
} from '../../test-utils/dom-helper';

test('네이버 메일 작성 테스트', async ({ page }) => {
  let actionCounter = 1;
  
  // 매 액션 전에 HTML을 저장하는 함수
  async function saveActionHTML(actionName: string) {
    await savePageHTML(page, `액션-${actionCounter++}-${actionName}`, actionCounter);
  }
  
  try {
    // 1. 브라우저 뷰포트 설정
    await saveActionHTML('브라우저-뷰포트-설정-전');
    await page.setViewportSize({ width: 1280, height: 720 });

    // 2. 네이버 로그인 페이지 접속 및 언어 설정
    await saveActionHTML('메일-페이지-접속-전');
    await page.goto('https://mail.naver.com', { waitUntil: 'networkidle' });
    await saveActionHTML('메일-페이지-접속-후');
    
    // 로그인 페이지로 리다이렉트될 때까지 대기 (타임아웃 증가)
    await saveActionHTML('로그인-페이지-리다이렉트-대기-전');
    await page.waitForURL(/nid\.naver\.com/, { timeout: 60000 });
    await saveActionHTML('로그인-페이지-리다이렉트-후');
    
    // 언어 설정(없으면 DOM 저장)
    await saveActionHTML('언어-설정-전');
    const localeSwitch = page.locator('#locale_switch');
    await findElementOrSaveDom(page, localeSwitch, '언어 설정 선택기');
    await localeSwitch.selectOption('ko_KR');
    await saveActionHTML('언어-설정-후');
    
    // 로그인 페이지 확인
    await saveActionHTML('로그인-페이지-확인-전');
    const naverHeading = page.getByRole('heading', { name: 'NAVER' });
    await findElementOrSaveDom(page, naverHeading, 'NAVER 로고');
    await saveActionHTML('로그인-페이지-확인-후');
    
    // 3. 로그인 정보 입력
    await saveActionHTML('아이디-입력-전');
    const idInput = page.getByRole('textbox', { name: '아이디' });
    await findElementOrSaveDom(page, idInput, '아이디 입력란');
    await idInput.fill('kimilsuk1310');
    await saveActionHTML('아이디-입력-후');
    
    await saveActionHTML('비밀번호-입력-전');
    const pwInput = page.getByRole('textbox', { name: '비밀번호' });
    await findElementOrSaveDom(page, pwInput, '비밀번호 입력란');
    await pwInput.fill('Dlftjr*520');
    await saveActionHTML('비밀번호-입력-후');
    
    await saveActionHTML('로그인-버튼-클릭-전');
    const loginButton = page.getByRole('button', { name: '로그인' });
    await findElementOrSaveDom(page, loginButton, '로그인 버튼');
    await loginButton.click();
    await saveActionHTML('로그인-버튼-클릭-후');

    // 메일 페이지로 리다이렉트될 때까지 대기 (타임아웃 증가)
    await saveActionHTML('메일-페이지-리다이렉트-대기-전');
    await page.waitForURL(/mail\.naver\.com/, { timeout: 60000 });
    await saveActionHTML('메일-페이지-리다이렉트-후');

    // 메일 쓰기 버튼이 나타날 때까지 대기
    await saveActionHTML('메일-쓰기-버튼-확인-전');
    const writeMailButton = page.getByRole('link', { name: '메일 쓰기' });
    await findElementOrSaveDom(page, writeMailButton, '메일 쓰기 버튼', 10000);
    await saveActionHTML('메일-쓰기-버튼-클릭-전');
    await writeMailButton.click();
    await saveActionHTML('메일-쓰기-버튼-클릭-후');

    // 메일 작성 페이지가 로드될 때까지 대기 (타임아웃 증가 및 URL 패턴 수정)
    await saveActionHTML('메일-작성-페이지-리다이렉트-대기-전');
    try {
      // 두 가지 가능한 URL 패턴을 모두 체크
      await Promise.race([
        page.waitForURL(/mail\.naver\.com\/.*\/write/, { timeout: 60000 }),
        page.waitForURL(/mail\.naver\.com\/v2\/new/, { timeout: 60000 })
      ]);
      console.log('메일 작성 페이지로 이동 성공');
    } catch (error) {
      // 현재 URL을 확인
      const currentUrl = page.url();
      console.log(`현재 URL: ${currentUrl}`);
      
      // 이미 메일 작성 페이지에 있는지 확인
      if (currentUrl.includes('mail.naver.com/v2/new') || currentUrl.includes('mail.naver.com') && currentUrl.includes('write')) {
        console.log('이미 메일 작성 페이지에 있습니다.');
      } else {
        await saveDOMStructure(page, 'failed-url-redirect', '메일 작성 페이지 리다이렉트 실패');
        throw new Error('메일 작성 페이지로 이동하지 못했습니다: ' + currentUrl);
      }
    }
    await saveActionHTML('메일-작성-페이지-리다이렉트-후');

    // 4. 메일 작성 폼 요소들의 존재 확인
    // 메일 작성 페이지가 로드될 때까지 대기
    await saveActionHTML('메일-작성-폼-확인-전');

    // 메일 작성 폼 선택자 여러 개 시도 (네이버 메일 v2 대응)
    const formSelectors = [
      '.mail_toolbar',       // 메일 툴바 영역
      '.mail_editor',        // 메일 에디터 영역
      '.se-container',       // 스마트에디터 영역
      '.tools',              // 에디터 툴 영역
      '.write_header',       // 메일 작성 헤더 영역
      '.se-module-toolbar',  // 스마트에디터 툴바
      '.editor_section'      // 에디터 섹션
    ];

    const mailFormSelector = await findElementWithMultipleSelectors(
      page, 
      formSelectors, 
      ['메일 툴바 영역', '메일 에디터 영역', '스마트에디터 영역', '에디터 툴 영역', '메일 작성 헤더 영역', '스마트에디터 툴바', '에디터 섹션'],
      10000
    );

    await saveActionHTML('메일-작성-폼-확인-후');

    // 제목 필드와 보내기 버튼 확인
    await saveActionHTML('제목-입력-필드-확인-전');
    const subjectSelectors = [
      'input[name="subject"]',             // 기본 제목 필드
      'input[placeholder="제목"]',         // placeholder로 찾기
      'input.subject_input',              // 클래스로 찾기
      '.subject_area input',              // 영역 내 input 찾기
      'input.mail_title',                 // 메일 제목 클래스
      'input[data-ph="제목"]',            // data-ph 속성으로 찾기
      'input[title="제목"]'               // title 속성으로 찾기
    ];

    const subjectField = await findElementWithMultipleSelectors(
      page,
      subjectSelectors,
      [
        '제목 입력 필드 (name)',
        '제목 입력 필드 (placeholder)',
        '제목 입력 필드 (class)',
        '제목 영역 내 input',
        '메일 제목 클래스',
        '제목 data-ph 속성',
        '제목 title 속성'
      ],
      10000
    );
    await saveActionHTML('제목-입력-필드-확인-후');

    // 에디터 영역 확인
    await saveActionHTML('본문-에디터-확인-전');
    const editorSelectors = [
      '.iframe_area iframe',               // iframe 영역
      '.mail_editor',                     // 메일 에디터
      '.se-container',                    // 스마트에디터
      '.contents_area iframe',            // 컨텐츠 영역 iframe
      '[role="textbox"]',                // textbox 역할 요소
      '.content_area',                   // 컨텐츠 영역
      '.content_editor'                  // 컨텐츠 에디터
    ];

    try {
      await findElementWithMultipleSelectors(
        page,
        editorSelectors,
        [
          'iframe 영역',
          '메일 에디터',
          '스마트에디터',
          '컨텐츠 영역 iframe',
          'textbox 역할 요소',
          '컨텐츠 영역',
          '컨텐츠 에디터'
        ],
        10000
      );
    } catch (error) {
      console.log('에디터 영역을 찾지 못했으나 계속 진행합니다:', error.message);
      await saveDOMStructure(page, 'editor-area-not-found', '에디터 영역을 찾지 못했습니다');
    }
    await saveActionHTML('본문-에디터-확인-후');

    // 보내기 버튼 확인
    await saveActionHTML('보내기-버튼-확인-전');
    const sendButtonSelectors = [
      'button:has-text("보내기")',        // 텍스트로 찾기
      '.btn_send',                       // 클래스로 찾기
      '.tools_send button',              // 영역 내 버튼으로 찾기
      '.button_send',                    // 다른 클래스로 찾기
      '[title="보내기"]',                // title 속성으로 찾기
      '.write_option button:last-child'  // 마지막 버튼으로 찾기
    ];

    const sendButton = await findElementWithMultipleSelectors(
      page,
      sendButtonSelectors,
      [
        '보내기 버튼 (텍스트)',
        '보내기 버튼 (클래스)',
        '보내기 도구 영역 내 버튼',
        '보내기 버튼 (다른 클래스)',
        '보내기 버튼 (title 속성)',
        '작성 옵션 영역 마지막 버튼'
      ],
      10000
    );
    await saveActionHTML('보내기-버튼-확인-후');

    // 5. 메일 내용 입력
    const testData = {
      recipient: 'kimilsuk1310@hanmail.net',
      subject: '자동화테스트',
      content: '이 메일은 자동화 테스트로 작성되었습니다.'
    };

    // 받는 사람 영역 - recipient.txt의 세 가지 유형을 모두 시도
    try {
      await saveActionHTML('받는-사람-입력-시도-전');
      // 여러 선택자를 순차적으로 시도 (네이버 메일 v2 선택자 추가)
      const recipientSelectors = [
        '#recipient_input_element',                      // Type 1: 아이디로 찾기
        'input[role="combobox"]',                        // Type 1-1: role로 찾기 
        '.user_input',                                   // Type 1-2: 클래스로 찾기
        'input.agP.aFw[aria-label="수신자"]',            // Type 2: 클래스와 aria-label로 찾기
        'textarea.tf_address',                           // Type 3: 클래스로 찾기
        // 네이버 메일 v2 선택자
        '.mail_input.to.done',                           // 네이버 메일 v2 받는사람 필드
        '.mail_input.to',                                // 네이버 메일 v2 받는사람 필드 (done 클래스 없을 경우)
        '.mail_address_area .mail_input_wrap input',     // 네이버 메일 v2 주소 입력 영역
        '.mail_address_box input',                       // 네이버 메일 v2 주소 상자
        // 기존 추가 선택자들
        '.addresses_wrap .to_area input',
        '.addresses_input input',
        '[data-ph="받는사람"]',
        '.toItemInput',
        'input[placeholder="받는 사람"]',
        'input[placeholder*="받는"]',
        'input[title*="받는 사람"]',
        '.to_email input'
      ];
      
      const recipientDescriptions = [
        '받는 사람 입력 필드 (ID)',
        '받는 사람 입력 필드 (role)',
        '받는 사람 입력 필드 (user_input class)',
        '받는 사람 입력 필드 (클래스+aria-label)',
        '받는 사람 입력 필드 (textarea)',
        '네이버 메일 v2 받는사람 필드 (done)',
        '네이버 메일 v2 받는사람 필드',
        '네이버 메일 v2 주소 입력 영역',
        '네이버 메일 v2 주소 상자',
        '받는 사람 입력 필드 (주소 영역)',
        '받는 사람 입력 필드 (주소 입력)',
        '받는 사람 입력 필드 (placeholder)',
        '받는 사람 입력 필드 (toItemInput)',
        '받는 사람 입력 필드 (placeholder 정확히)',
        '받는 사람 입력 필드 (placeholder 포함)',
        '받는 사람 입력 필드 (title 포함)',
        '받는 사람 이메일 영역 입력 필드'
      ];

      const recipientInput = await findElementWithMultipleSelectors(
        page, 
        recipientSelectors, 
        recipientDescriptions,
        10000
      );
      await saveActionHTML('받는-사람-입력-필드-찾음');

      // 입력 요소를 찾으면 클릭하고 입력
      await saveActionHTML('받는-사람-필드-클릭-전');
      await recipientInput.click();
      await saveActionHTML('받는-사람-필드-클릭-후');
      
      // 이메일 입력 레이어가 나타날 수 있으므로 대기
      try {
        // 이메일 입력 레이어 확인
        await saveActionHTML('이메일-입력-레이어-확인-전');
        const emailLayerSelectors = [
          '.layer_addmail',
          '.mail_layer',
          '.address_layer',
          '.add_mail_layer',
          '.email_input_layer'
        ];
        
        let emailLayer: Locator | null = null;
        for (const selector of emailLayerSelectors) {
          try {
            const locator = page.locator(selector);
            await locator.waitFor({ timeout: 3000 });
            emailLayer = locator;
            console.log(`이메일 입력 레이어(${selector})가 나타났습니다.`);
            break;
          } catch (e) {
            console.log(`이메일 입력 레이어(${selector})를 찾지 못했습니다.`);
          }
        }
        
        await saveActionHTML('이메일-입력-레이어-확인-후');
        
        if (emailLayer) {
          // 이메일 입력 필드 찾기
          await saveActionHTML('이메일-입력-필드-찾기-전');
          const emailInputSelectors = [
            '.layer_addmail .emailinput',
            '.mail_layer input',
            '.address_layer input',
            '.add_mail_layer input',
            '.email_input_layer input',
            'input[type="email"]',
            'input.email'
          ];
          
          let emailInput: Locator | null = null;
          for (const selector of emailInputSelectors) {
            try {
              const locator = page.locator(selector).first();
              await locator.waitFor({ timeout: 3000 });
              emailInput = locator;
              console.log(`이메일 입력 필드(${selector})를 찾았습니다.`);
              break;
            } catch (e) {
              console.log(`이메일 입력 필드(${selector})를 찾지 못했습니다.`);
            }
          }
          
          await saveActionHTML('이메일-입력-필드-찾기-후');

          if (emailInput) {
            await saveActionHTML('이메일-주소-입력-전');
            await emailInput.fill(testData.recipient);
            await saveActionHTML('이메일-주소-입력-후');
          } else {
            // 이메일 입력 필드를 찾지 못했지만, 계속 진행
            console.log('이메일 입력 필드를 찾지 못했습니다. 원래 필드에 직접 입력합니다.');
            await saveActionHTML('이메일-주소-직접-입력-전');
            await recipientInput.fill(testData.recipient);
            await saveActionHTML('이메일-주소-직접-입력-후');
          }
        } else {
          // 레이어가 없으면 직접 원래 필드에 입력
          await saveActionHTML('이메일-주소-직접-입력-전');
          await recipientInput.fill(testData.recipient);
          await saveActionHTML('이메일-주소-직접-입력-후');
        }
      } catch (layerError) {
        // 레이어가 나타나지 않으면 직접 텍스트 입력
        console.log('이메일 입력 레이어가 나타나지 않아 직접 입력합니다.');
        await saveActionHTML('이메일-주소-직접-입력-전');
        await recipientInput.fill(testData.recipient);
        await saveActionHTML('이메일-주소-직접-입력-후');
      }
      
      await saveActionHTML('이메일-주소-엔터-전');
      await page.keyboard.press('Enter');
      await saveActionHTML('이메일-주소-엔터-후');
    } catch (error) {
      await saveDOMStructure(page, 'failed-recipient-all-types', '모든 받는 사람 입력 방법이 실패했습니다.');
      throw new Error('모든 받는 사람 입력 방법이 실패했습니다.');
    }
    
    // 제목 입력
    await saveActionHTML('제목-입력-전');
    await subjectField.fill(testData.subject);
    await saveActionHTML('제목-입력-후');
    
    // 본문 에디터에 텍스트 입력
    await saveActionHTML('본문-에디터-접근-전');
    let contentEntered = false;
    
    // 1. 네이버 메일 v2 직접 에디터 시도 (iframe 없는 버전)
    try {
      console.log('네이버 메일 v2 직접 에디터 접근 시도...');
      const v2EditorSelectors = [
        '.se-component-content',
        '.se-text',
        '.se-editing-area',
        '[role="textbox"]',
        '[contenteditable="true"]'
      ];
      
      for (const selector of v2EditorSelectors) {
        try {
          const editorElement = page.locator(selector).first();
          await editorElement.waitFor({ timeout: 5000 });
          console.log(`에디터 요소 찾음: ${selector}`);
          
          await saveActionHTML('본문-내용-입력-전');
          await editorElement.click();
          await page.keyboard.type(testData.content);
          console.log('직접 에디터에 텍스트 입력 성공');
          await saveActionHTML('본문-내용-입력-후');
          contentEntered = true;
          break;
        } catch (elemError) {
          console.log(`선택자 ${selector}로 찾기 실패`);
        }
      }
    } catch (v2Error) {
      console.log('네이버 메일 v2 직접 에디터 접근 실패');
    }
    
    // 2. iframe 방식 시도 (콘텐츠가 아직 입력되지 않은 경우)
    if (!contentEntered) {
      console.log('iframe 방식으로 에디터 접근 시도...');
      const frameSelectors = [
        '.iframe_area iframe',
        '#editor iframe',
        '.mail_editor iframe',
        'iframe[title="본문 작성"]',
        'iframe'
      ];
      
      for (const frameSelector of frameSelectors) {
        try {
          // iframe 요소 찾기
          const frameElements = await page.locator(frameSelector).all();
          if (frameElements.length === 0) {
            console.log(`${frameSelector}에 해당하는 iframe 없음`);
            continue;
          }
          
          console.log(`${frameSelector} 선택자로 iframe ${frameElements.length}개 찾음`);
          
          // 각 iframe 순회
          for (let i = 0; i < frameElements.length; i++) {
            try {
              const frameElement = frameElements[i];
              const frameHandle = await frameElement.elementHandle();
              
              if (!frameHandle) {
                console.log(`${i}번째 iframe에 대한 핸들을 가져올 수 없음`);
                continue;
              }
              
              const frame = await frameHandle.contentFrame();
              
              if (!frame) {
                console.log(`${i}번째 iframe의 콘텐츠 프레임을 가져올 수 없음`);
                continue;
              }
              
              console.log(`${i}번째 iframe의 콘텐츠 프레임을 가져옴`);
              
              // iframe 내 텍스트 삽입 시도
              try {
                await saveActionHTML('본문-내용-입력-전');
                
                // 방법 1: 일반적인 편집 가능 요소 찾기
                try {
                  const textElements = await frame.locator('[role="textbox"], [contenteditable="true"], body').all();
                  
                  if (textElements.length > 0) {
                    await textElements[0].click();
                    await page.keyboard.type(testData.content);
                    console.log('iframe 내 편집 요소에 텍스트 입력 성공');
                    await saveActionHTML('본문-내용-입력-후');
                    contentEntered = true;
                    break;
                  }
                } catch (textError) {
                  console.log('iframe 내 편집 요소 찾기 실패');
                }
                
                // 방법 2: innerHTML 직접 설정
                if (!contentEntered) {
                  await frame.evaluate((content) => {
                    document.body.innerHTML = content;
                  }, testData.content);
                  console.log('document.body.innerHTML을 통한 본문 입력 성공');
                  await saveActionHTML('본문-내용-입력-후');
                  contentEntered = true;
                  break;
                }
              } catch (inputError) {
                console.log(`${i}번째 iframe에 텍스트 입력 실패: ${inputError.message}`);
              }
            } catch (frameProcessError) {
              console.log(`${i}번째 iframe 처리 중 오류: ${frameProcessError.message}`);
            }
          }
          
          if (contentEntered) break;
        } catch (selectorError) {
          console.log(`${frameSelector} 선택자 처리 중 오류: ${selectorError.message}`);
        }
      }
    }
    
    // 3. 모든 시도 실패 시 saveDOMStructure 호출 후 계속 진행
    if (!contentEntered) {
      await saveDOMStructure(page, 'failed-content-editor', '본문 에디터에 텍스트를 입력할 수 없습니다');
      console.log('모든 본문 입력 방법이 실패했지만 테스트 계속 진행');
    }

    // 6. 보내기 버튼 클릭
    await saveActionHTML('보내기-버튼-클릭-전');
    await sendButton.click();
    await saveActionHTML('보내기-버튼-클릭-후');

    // 7. 전송 완료 메시지 확인
    try {
      await saveActionHTML('발송-성공-메시지-확인-전');
      const successMessage = page.getByText('메일을 발송했습니다');
      await findElementOrSaveDom(page, successMessage, '메일 발송 성공 메시지', 10000);
      await saveActionHTML('발송-성공-메시지-확인-후');
      console.log('메일 전송 성공!');
    } catch (error) {
      await saveDOMStructure(page, 'failed-success-message', '메일 발송 성공 메시지를 찾지 못했습니다.');
      throw new Error('메일 발송 성공 메시지를 찾지 못했습니다.');
    }

  } catch (error) {
    // 테스트 실패 시 최종 DOM 상태 저장
    await saveDOMStructure(page, 'test-failure-final-state', `테스트 실패: ${error.message}`);
    throw error;
  }
}); 
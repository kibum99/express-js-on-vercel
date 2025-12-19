# merged-webview

React Native WebView에서 사용할 수 있는 정적 사주 분석 리포트 렌더러입니다.

## 개요

이 프로젝트는 `merged/`를 기반으로 하되, **데이터를 웹에서 직접 로드하지 않고** React Native에서 주입받아 렌더링하는 구조로 설계되었습니다. 이를 통해 개인정보 보안을 강화하고, 운영 편의성을 높였습니다.

## 주요 특징

- **데이터 주입 방식**: 웹은 정적 렌더러로만 동작하며, 모든 데이터는 RN에서 주입
- **iOS/Android 호환**: 두 플랫폼 모두 지원하는 메시지 프로토콜
- **정적 사이트**: 빌드 없이 배포 가능한 순수 HTML/CSS/JS
- **원격 배포**: CDN이나 정적 호스팅에 배포하여 앱과 독립적으로 업데이트 가능

## 프로젝트 구조

```
merged-webview/
├── public/
│   ├── index.html          # 메인 HTML 파일
│   ├── style.css           # 스타일시트
│   ├── script.js           # 렌더링 로직 및 RN 통신
│   └── images/             # 이미지 자산
│       └── 강아지/
│           ├── 천간/
│           ├── 지지/
│           └── ...
└── README.md
```

## 배포 방법

### 정적 호스팅 옵션

이 프로젝트는 정적 사이트이므로 다양한 호스팅 서비스에 배포할 수 있습니다:

#### 1. AWS S3 + CloudFront
```bash
# S3 버킷에 업로드
aws s3 sync public/ s3://your-bucket-name/ --delete

# CloudFront 배포 (선택)
# CloudFront 콘솔에서 배포 생성
```

#### 2. Vercel
```bash
# Vercel CLI 설치 후
vercel --prod
```

#### 3. Netlify
```bash
# Netlify CLI 설치 후
netlify deploy --prod --dir=public
```

#### 4. GitHub Pages
```bash
# public 폴더를 gh-pages 브랜치로 푸시
git subtree push --prefix public origin gh-pages
```

#### 5. Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/merged-webview/public;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 캐시 설정 (정적 자산)
    location ~* \.(css|js|png|jpg|jpeg|gif|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 캐시 권장사항

- **정적 자산 (HTML/CSS/JS/이미지)**: 장기 캐시 가능 (1년)
  - 파일명에 해시를 포함하거나, 버전 쿼리 파라미터 사용 권장
- **데이터 (JSON)**: RN이 API로 받으므로 웹 캐시 이슈 없음

## React Native 통합

### 1. 기본 설정

```tsx
import React, { useRef, useMemo } from 'react';
import { Platform } from 'react-native';
import WebView from 'react-native-webview';

interface ReportData {
  persona: any;
  saju: any;
  report_contents: any[];
  mode?: string;
}

export function ReportWebView({ reportData }: { reportData: ReportData }) {
  const webViewRef = useRef<WebView>(null);

  // WebView URL (배포된 정적 사이트 주소)
  const webViewUrl = 'https://your-domain.com/index.html';

  // 데이터를 주입하기 위한 부트스트랩 스크립트
  const injectedJavaScript = useMemo(() => {
    const payload = JSON.stringify(reportData);
    const safe = JSON.stringify(payload); // 이중 JSON.stringify로 안전화

    return `
      (function () {
        // 메시지 리스너가 이미 설정되어 있으므로, 데이터만 전송
        window.postMessage(JSON.stringify({
          type: 'INIT_REPORT',
          id: '${Date.now()}',
          payload: JSON.parse(${safe})
        }), '*');
      })();
      true;
    `;
  }, [reportData]);

  return (
    <WebView
      ref={webViewRef}
      source={{ uri: webViewUrl }}
      injectedJavaScriptBeforeContentLoaded={injectedJavaScript}
      javaScriptEnabled
      originWhitelist={['*']}
      onMessage={(event) => {
        // 웹에서 보낸 ACK/ERROR 메시지 처리
        try {
          const msg = JSON.parse(event.nativeEvent.data);
          if (msg.type === 'ACK') {
            console.log('렌더링 완료:', msg.id);
          } else if (msg.type === 'ERROR') {
            console.error('렌더링 오류:', msg.message);
          }
        } catch (e) {
          console.error('메시지 파싱 실패:', e);
        }
      }}
    />
  );
}
```

### 2. 데이터 업데이트

```tsx
// 데이터를 업데이트하고 싶을 때
const updateReport = (newData: ReportData) => {
  const id = String(Date.now());
  webViewRef.current?.postMessage(
    JSON.stringify({
      type: 'UPDATE_REPORT',
      id,
      payload: newData,
    })
  );
};
```

### 3. 직접 API 호출 (권장)

```tsx
// window.ReportApp API 직접 호출
const injectedJavaScript = `
  (function () {
    const data = ${JSON.stringify(JSON.stringify(reportData))};
    window.ReportApp.start(JSON.parse(data));
  })();
  true;
`;
```

## 메시지 프로토콜

### RN → Web

#### INIT_REPORT
```json
{
  "type": "INIT_REPORT",
  "id": "unique-request-id",
  "payload": {
    "persona": [...],
    "saju": [...],
    "report_contents": [...],
    "mode": "사주"
  }
}
```

#### UPDATE_REPORT
```json
{
  "type": "UPDATE_REPORT",
  "id": "unique-request-id",
  "payload": { ... }
}
```

### Web → RN

#### ACK (성공)
```json
{
  "type": "ACK",
  "id": "request-id",
  "timestamp": 1234567890
}
```

#### ERROR (실패)
```json
{
  "type": "ERROR",
  "id": "request-id",
  "message": "에러 메시지",
  "timestamp": 1234567890
}
```

## API 참조

### window.ReportApp

웹에서 직접 호출할 수 있는 공식 API입니다.

#### `start(data)`
데이터로 렌더링을 시작합니다.

```javascript
window.ReportApp.start({
  persona: [...],
  saju: [...],
  report_contents: [...]
});
```

#### `update(data)`
기존 데이터를 업데이트하고 재렌더링합니다.

```javascript
window.ReportApp.update(newData);
```

#### `getState()`
현재 상태를 조회합니다.

```javascript
const state = window.ReportApp.getState();
// { started: true, lastData: {...} }
```

## 보안 권장사항

### 서버 측 (데이터 제공)

1. **마스킹**: 이름, 생년월일 등 개인정보는 서버에서 마스킹 처리
2. **이미지 URL**: 프로필 이미지는 서명된 URL(Signed URL) 사용, 짧은 만료 시간 설정
3. **API 인증**: 데이터 API는 인증된 사용자만 접근 가능하도록 설정
4. **캐시 제어**: 데이터 API 응답에 `Cache-Control: no-store` 헤더 설정

### 클라이언트 측 (RN)

1. **HTTPS**: WebView는 반드시 HTTPS로 로드
2. **도메인 제한**: `originWhitelist`로 허용된 도메인만 로드
3. **디버깅 비활성화**: 배포 빌드에서는 WebView 디버깅 비활성화
   - iOS: Xcode에서 `WKWebView` 디버깅 비활성화
   - Android: `setWebContentsDebuggingEnabled(false)`

### 웹 측 (merged-webview)

1. **CSP 헤더**: Content Security Policy 설정 권장
2. **XSS 방지**: 사용자 입력은 이미 서버에서 처리되므로 추가 XSS 방지 불필요
3. **로깅 최소화**: 콘솔 로그는 개발 환경에서만 활성화

## 트러블슈팅

### iOS에서 메시지가 전달되지 않음

iOS의 경우 `injectedJavaScriptBeforeContentLoaded`가 실행되는 타이밍이 다를 수 있습니다. 대신 `postMessage`를 사용하세요:

```tsx
useEffect(() => {
  if (webViewRef.current && reportData) {
    // 약간의 지연 후 전송
    setTimeout(() => {
      webViewRef.current?.postMessage(
        JSON.stringify({
          type: 'INIT_REPORT',
          id: Date.now().toString(),
          payload: reportData,
        })
      );
    }, 500);
  }
}, [reportData]);
```

### Android에서 이미지가 로드되지 않음

Android WebView는 상대 경로 해석이 다를 수 있습니다. 이미지 경로가 올바른지 확인하세요:

```javascript
// script.js에서 이미지 경로는 상대 경로로 설정됨
'images/강아지/천간/갑.png'
```

### 데이터가 렌더링되지 않음

1. 브라우저 콘솔에서 에러 확인
2. `window.ReportApp.getState()`로 데이터가 주입되었는지 확인
3. 데이터 구조가 올바른지 확인 (`persona`, `report_contents` 필수)

## 개발 환경

로컬에서 테스트하려면 간단한 HTTP 서버를 실행하세요:

```bash
# Python 3
cd public
python3 -m http.server 8000

# Node.js (http-server)
npx http-server public -p 8000

# PHP
cd public
php -S localhost:8000
```

그 후 브라우저에서 `http://localhost:8000`으로 접속하여 테스트할 수 있습니다.

## 라이선스

이 프로젝트는 원본 `merged/` 프로젝트를 기반으로 합니다.

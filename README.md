# 🎯 Toss UI - 이진 트리 기반 그리드 레이아웃 시스템

> 토스 기술 블로그의 [자료구조를 활용한 복잡한 프론트엔드 컴포넌트 제작하기](https://toss.tech/article/frontend-tree-structure) 글을 참고하여 구현한 이진 트리 기반의 동적 그리드 레이아웃 시스템입니다.

## 📋 프로젝트 개요

이 프로젝트는 토스증권 PC의 종목 상세 페이지에서 사용되는 그리드 레이아웃 시스템을 **라이브러리 없이 직접 구현**한 React 컴포넌트입니다. 이진 트리 자료구조를 활용하여 패널의 동적 배치, 크기 조절, 드래그 앤 드롭 등의 복잡한 UI 인터랙션을 구현했습니다.

## ✨ 주요 기능

- 🎨 **동적 패널 배치**: 마우스 드래그로 패널 위치 변경
- 📏 **실시간 크기 조절**: 드래그로 패널 크기 조정
- 🌳 **이진 트리 구조**: 효율적인 레이아웃 관리
- 💾 **레이아웃 저장/복원**: 사용자 설정 유지
- 🎯 **Headless 컴포넌트**: 디자인 자유도 보장
- 📱 **반응형 지원**: 다양한 화면 크기 대응

## 🏗️ 아키텍처

### 핵심 컴포넌트

```
src/
├── components/
│   ├── layout/
│   │   └── LayoutComp/           # 메인 레이아웃 컴포넌트
│   │       ├── LayoutMoveBar/    # 크기 조절 바
│   │       └── LayoutMoveBox/    # 드래그 가능한 패널
│   └── card/                     # 예시 패널 컴포넌트
├── type/
│   └── type-layout.ts           # 타입 정의
└── utils/
    └── layout.ts                # 레이아웃 유틸리티 함수
```

### 이진 트리 구조

```typescript
interface LayoutNode {
  id: string;
  type: "split" | "panel";
  orientation?: "H" | "W"; // H: 수평 분할, W: 수직 분할
  ratio?: number; // 분할 비율
  children?: LayoutNode[];
}
```

## 🚀 시작하기

### 설치

```bash
npm install
```

### 실행

```bash
npm start
```

### 빌드

```bash
npm run build
```

## 💡 핵심 아이디어

### 1. 이진 트리로 레이아웃 표현

화면을 이진 트리로 분할하여 각 노드가 화면의 영역을 나타내도록 구현했습니다.

```
화면 (900x700)
├── 왼쪽 영역 (450x700)
│   ├── 상단 (450x350)
│   └── 하단 (450x350)
└── 오른쪽 영역 (450x700)
```

### 2. 전위 순회로 좌표 계산

이진 트리를 전위 순회하면서 각 노드의 위치와 크기를 계산합니다.

```typescript
const preOrderTraversal = ({ node, x, y, width, height, callback }) => {
  callback(node, x, y, width, height);

  if (node.type === "split") {
    // 자식 노드들에 대해 재귀 호출
  }
};
```

### 3. Headless 컴포넌트 패턴

레이아웃 로직과 UI 렌더링을 분리하여 재사용성을 높였습니다.

```typescript
<LayoutComp
  initialLayout={sampleLayout}
  layoutComponentList={[
    { id: "panel-1", component: <ChartPanel /> },
    { id: "panel-2", component: <QuotePanel /> },
  ]}
/>
```

## 🛠️ 기술 스택

- **React 18** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Styled Components** - CSS-in-JS
- **Lodash** - 유틸리티 함수

## 📚 참고 자료

- [토스 기술 블로그 - 자료구조를 활용한 복잡한 프론트엔드 컴포넌트 제작하기](https://toss.tech/article/frontend-tree-structure)
- 이진 트리 자료구조
- React Headless 컴포넌트 패턴

---

**토스의 기술적 접근 방식을 학습하고 구현한 프로젝트입니다.** 🚀

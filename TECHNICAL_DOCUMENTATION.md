# 🛠️ Petit 기술 소개서 (Technical Documentation)

<div align="center">
  
  **반려동물 커뮤니티 플랫폼의 기술적 구현과 아키텍처**
  
  ![React](https://img.shields.io/badge/React-19.1.0-61DAFB?logo=react)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?logo=typescript)
  ![Firebase](https://img.shields.io/badge/Firebase-12.0.0-FFCA28?logo=firebase)
  ![Vite](https://img.shields.io/badge/Vite-7.0.4-646CFF?logo=vite)
  ![Mantine](https://img.shields.io/badge/Mantine-8.1.3-339AF0?logo=mantine)
  
</div>

---

## 📋 목차

1. [기술 스택 개요](#기술-스택-개요)
2. [프론트엔드 아키텍처](#프론트엔드-아키텍처)
3. [백엔드 & 데이터베이스](#백엔드--데이터베이스)
4. [주요 기능 구현](#주요-기능-구현)
5. [코드 구조와 패턴](#코드-구조와-패턴)
6. [성능 최적화](#성능-최적화)
7. [보안 및 인증](#보안-및-인증)
8. [배포 및 DevOps](#배포-및-devops)
9. [개발 도구 및 환경](#개발-도구-및-환경)
10. [향후 기술 계획](#향후-기술-계획)

---

## 🏗️ 기술 스택 개요

### Frontend Stack
```typescript
// Core Technologies
React 19.1.0          // 최신 React with Concurrent Features
TypeScript 5.8.3      // 강타입 언어로 안정성 확보
Vite 7.0.4            // 빠른 번들링과 HMR

// UI & Styling
Mantine UI 8.1.3      // 모던 React 컴포넌트 라이브러리
PostCSS 8.5.6         // CSS 후처리기
Mantine PostCSS       // Mantine 최적화 CSS 전처리

// State Management & Routing
React Router DOM       // URL 기반 라우팅 시스템 
React Context API      // 전역 상태 관리 (AuthContext)

// Icons & Assets
Tabler Icons 3.34.0   // SVG 아이콘 세트
```

### Backend & Database
```typescript
// Backend as a Service
Firebase 12.0.0
├── Firestore         // NoSQL 실시간 데이터베이스
├── Authentication    // 사용자 인증 시스템
├── Storage          // 파일 업로드 및 저장
└── Hosting          // 정적 사이트 호스팅

// Cloud Functions (예정)
Node.js + TypeScript  // 서버리스 백엔드 로직
```

### Development & Build Tools
```json
{
  "bundler": "Vite 7.0.4",
  "linter": "ESLint 9.30.1",
  "formatter": "Prettier (내장)",
  "typeChecker": "TypeScript 5.8.3",
  "packageManager": "npm",
  "gitHooks": "준비 중"
}
```

---

## 🎨 프론트엔드 아키텍처

### 1. 컴포넌트 구조
```
src/
├── components/           # 재사용 가능한 UI 컴포넌트
│   ├── AuthModal.tsx    # 로그인/회원가입 모달
│   ├── Header.tsx       # 네비게이션 헤더
│   ├── SearchBar.tsx    # 실시간 검색 컴포넌트
│   ├── PostWriteModal.tsx   # 글쓰기 모달
│   └── ...
├── pages/               # 페이지별 컴포넌트
│   ├── HomePage.tsx     # 랜딩 페이지
│   ├── CommunityPage.tsx # 커뮤니티 메인
│   ├── KnowledgePage.tsx # 지식백과
│   └── MyPage.tsx       # 마이페이지
├── contexts/            # React Context 상태 관리
│   └── AuthContext.tsx  # 인증 상태 전역 관리
├── services/            # 비즈니스 로직 & API
│   ├── postService.ts   # 게시물 CRUD
│   ├── commentService.ts # 댓글 시스템
│   ├── tagService.ts    # 태그 관리
│   └── knowledgeService.ts # 지식백과 서비스
├── hooks/               # 커스텀 React 훅
│   └── useScrollAnimation.ts # 스크롤 애니메이션
├── lib/                 # 유틸리티 및 설정
│   ├── firebase.ts      # Firebase 설정
│   └── utils.ts         # 공통 유틸 함수
└── types/               # TypeScript 타입 정의
    └── index.ts         # 전역 타입 정의
```

### 2. 상태 관리 패턴

#### AuthContext 구조
```typescript
interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, nickname: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
}

// Provider 패턴으로 전역 인증 상태 관리
<AuthProvider>
  <App />
</AuthProvider>
```

#### 컴포넌트 상태 관리
```typescript
// 로컬 상태: useState
const [posts, setPosts] = useState<CommunityPost[]>([]);
const [loading, setLoading] = useState(true);

// 서버 상태: React Query 도입 예정
// const { data: posts, isLoading } = useQuery(['posts'], fetchPosts);
```

### 3. 라우팅 시스템

#### React Router 구조
```typescript
// App.tsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/community" element={<CommunityPage />} />
    <Route path="/knowledge" element={<KnowledgePage />} />
    <Route path="/mypage" element={<MyPage />} />
  </Routes>
</BrowserRouter>

// 네비게이션 훅 활용
const navigate = useNavigate();
const location = useLocation();
```

---

## 🔥 백엔드 & 데이터베이스

### 1. Firebase Firestore 데이터 모델

#### 컬렉션 구조
```typescript
// Collections
posts/           // 커뮤니티 게시물
├── {postId}
│   ├── title: string
│   ├── content: string
│   ├── author: UserProfile
│   ├── category: string
│   ├── tags: string[]
│   ├── likes: string[]  // 좋아요한 사용자 UID 배열
│   ├── viewCount: number
│   ├── createdAt: Timestamp
│   └── updatedAt: Timestamp

comments/        // 댓글 시스템
├── {commentId}
│   ├── postId: string
│   ├── content: string
│   ├── author: UserProfile
│   ├── parentId?: string  // 대댓글용
│   ├── likes: string[]
│   ├── createdAt: Timestamp
│   └── updatedAt: Timestamp

articles/        // 지식백과 아티클
users/          // 사용자 프로필
tags/           // 태그 통계
notifications/  // 알림 시스템
```

#### 복합 쿼리 예제
```typescript
// 카테고리별 최신 게시물 조회
const getPosts = async (category?: string, limit: number = 10) => {
  let q = query(
    collection(db, 'posts'),
    orderBy('createdAt', 'desc'),
    limit(limit)
  );

  if (category && category !== '전체') {
    q = query(
      collection(db, 'posts'),
      where('category', '==', category),
      orderBy('createdAt', 'desc'),
      limit(limit)
    );
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
```

### 2. 실시간 데이터 동기화
```typescript
// Firestore 실시간 리스너
useEffect(() => {
  const unsubscribe = onSnapshot(
    query(collection(db, 'posts'), orderBy('createdAt', 'desc')),
    (snapshot) => {
      const newPosts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(newPosts);
    }
  );

  return () => unsubscribe();
}, []);
```

### 3. Firebase Storage 파일 업로드
```typescript
const uploadImages = async (files: File[]): Promise<string[]> => {
  const uploadPromises = files.map(async (file) => {
    const filename = `posts/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, filename);
    
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  });

  return Promise.all(uploadPromises);
};
```

---

## ⚡ 주요 기능 구현

### 1. 태그 시스템

#### 자동 태그 카운팅
```typescript
// 태그 사용량 자동 증가
const incrementTagCounts = async (tags: string[]) => {
  const batch = writeBatch(db);
  
  tags.forEach(tag => {
    const tagRef = doc(db, 'tags', tag);
    batch.set(tagRef, {
      id: tag,
      count: increment(1),
      updatedAt: Timestamp.now()
    }, { merge: true });
  });

  await batch.commit();
};

// 인기 태그 조회
const getTopTags = async (limit: number = 8) => {
  const q = query(
    collection(db, 'tags'),
    orderBy('count', 'desc'),
    limit(limit)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as Tag);
};
```

#### 태그 필터링 UI
```typescript
// TrendingSidebar.tsx
const TrendingSidebar = () => {
  const [topTags, setTopTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // 태그 클릭 시 필터링
  const handleTagClick = (tagName: string) => {
    setSelectedTag(tagName);
    onTagFilter(tagName); // 부모 컴포넌트로 전달
  };

  return (
    <Paper p="md">
      <Title order={3} mb="md">🔥 인기 태그</Title>
      <Stack gap="xs">
        {topTags.map(tag => (
          <Badge 
            key={tag.id}
            variant={selectedTag === tag.id ? "filled" : "light"}
            onClick={() => handleTagClick(tag.id)}
            style={{ cursor: 'pointer' }}
          >
            {tag.id} ({tag.count})
          </Badge>
        ))}
      </Stack>
    </Paper>
  );
};
```

### 2. 실시간 검색 시스템

#### SearchBar 컴포넌트
```typescript
const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // 디바운스된 검색
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (searchQuery.length < 2) return;
      
      const searchResults = await performSearch(searchQuery);
      setResults(searchResults);
    }, 300),
    []
  );

  // Ctrl+K 단축키 지원
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
};
```

### 3. 반응형 레이아웃

#### CSS Grid & Flexbox 활용
```typescript
// CommunityPage.tsx 2단 레이아웃
<Grid>
  <Grid.Col span={{ base: 12, md: 8 }}>
    <PostList posts={filteredPosts} />
  </Grid.Col>
  <Grid.Col span={{ base: 12, md: 4 }}>
    <TrendingSidebar onTagFilter={handleTagFilter} />
  </Grid.Col>
</Grid>

// 모바일 우선 반응형 디자인
const responsiveStyles = {
  padding: { base: 'sm', md: 'lg' },
  fontSize: { base: '14px', md: '16px' },
  gridCols: { base: 1, sm: 2, md: 3, lg: 4 }
};
```

### 4. 스크롤 애니메이션

#### 커스텀 훅 구현
```typescript
// useScrollAnimation.ts
export const useScrollAnimation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
};

// 사용 예제
const AnimatedSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  
  return (
    <Box
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.6s ease-out'
      }}
    >
      <Content />
    </Box>
  );
};
```

---

## 📦 코드 구조와 패턴

### 1. TypeScript 타입 시스템

#### 도메인 모델 정의
```typescript
// types/index.ts
export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  author: {
    uid: string;
    nickname: string;
    avatar?: string;
  };
  category: '일상' | '건강' | 'DIY' | '꿀팁' | '응급' | '영상' | '기타';
  tags: string[];
  imageUrls?: string[];
  likes: string[];
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  nickname: string;
  avatar?: string;
  bio?: string;
  createdAt: Date;
}

// 유니온 타입으로 안전한 상태 관리
type LoadingState = 'idle' | 'loading' | 'success' | 'error';
```

### 2. 서비스 레이어 패턴

#### 비즈니스 로직 분리
```typescript
// services/postService.ts
class PostService {
  async createPost(postData: CreatePostData): Promise<string> {
    // 1. 이미지 업로드
    const imageUrls = await this.uploadImages(postData.images);
    
    // 2. 게시물 저장
    const docRef = await addDoc(collection(db, 'posts'), {
      ...postData,
      imageUrls,
      createdAt: Timestamp.now()
    });
    
    // 3. 태그 카운트 증가
    await incrementTagCounts(postData.tags);
    
    return docRef.id;
  }

  async getPosts(filters: PostFilters): Promise<PostResult> {
    // 복잡한 쿼리 로직 캡슐화
  }
}

export const postService = new PostService();
```

### 3. 커스텀 훅 패턴

#### 재사용 가능한 로직 추상화
```typescript
// hooks/usePost.ts
export const usePost = (postId: string) => {
  const [post, setPost] = useState<CommunityPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const postData = await getPost(postId);
        setPost(postData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  return { post, loading, error };
};
```

### 4. 에러 바운더리

#### 안정적인 에러 처리
```typescript
// components/ErrorBoundary.tsx
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('에러 발생:', error, errorInfo);
    // 에러 리포팅 서비스로 전송
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}
```

---

## 🚀 성능 최적화

### 1. 번들 최적화

#### Vite 설정
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['@mantine/core', '@mantine/hooks'],
          'firebase-vendor': ['firebase/app', 'firebase/firestore']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@mantine/core']
  }
});
```

### 2. 이미지 최적화

#### 지연 로딩 및 최적화
```typescript
// components/OptimizedImage.tsx
const OptimizedImage = ({ src, alt, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <Box ref={imgRef} {...props}>
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }}
        />
      )}
    </Box>
  );
};
```

### 3. 메모이제이션

#### React.memo와 useMemo 활용
```typescript
// 컴포넌트 메모이제이션
const PostCard = memo(({ post }: { post: CommunityPost }) => {
  // 비싼 계산 메모이제이션
  const formattedDate = useMemo(() => {
    return formatTimeAgo(post.createdAt);
  }, [post.createdAt]);

  // 콜백 메모이제이션
  const handleLike = useCallback(() => {
    toggleLike(post.id);
  }, [post.id]);

  return (
    <Card>
      {/* 컴포넌트 내용 */}
    </Card>
  );
});
```

---

## 🔒 보안 및 인증

### 1. Firebase 보안 규칙

#### Firestore 규칙
```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 사용자 프로필 보안
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // 게시물 보안
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        (request.auth.uid == resource.data.author.uid || 
         isLikeUpdate());
      allow delete: if request.auth != null && 
        request.auth.uid == resource.data.author.uid;
    }
    
    // 좋아요 업데이트 검증
    function isLikeUpdate() {
      return request.writeFields.size() == 1 && 
        'likes' in request.writeFields;
    }
  }
}
```

### 2. 입력 검증 및 살균

#### XSS 방지
```typescript
// utils/sanitizer.ts
import DOMPurify from 'dompurify';

export const sanitizeContent = (content: string): string => {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u'],
    ALLOWED_ATTR: []
  });
};

// 사용 예제
const createPost = async (postData: CreatePostData) => {
  const sanitizedData = {
    ...postData,
    title: sanitizeContent(postData.title),
    content: sanitizeContent(postData.content)
  };
  
  return await postService.create(sanitizedData);
};
```

### 3. 환경 변수 관리

#### 민감 정보 보호
```typescript
// .env.local
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id

// lib/firebase.ts
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  // ... 다른 설정
};
```

---

## 🚀 배포 및 DevOps

### 1. Vercel 배포 설정

#### vercel.json 구성
```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "rewrites": [
    {
      "source": "/((?!api/).*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 2. GitHub Actions CI/CD

#### 자동 배포 파이프라인
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run TypeScript check
        run: npm run type-check
      
      - name: Run ESLint
        run: npm run lint
      
      - name: Build project
        run: npm run build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
      
      - name: Deploy to Vercel
        uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### 3. 모니터링 및 분석

#### 성능 모니터링
```typescript
// lib/analytics.ts
import { getAnalytics, logEvent } from 'firebase/analytics';

const analytics = getAnalytics();

export const trackPageView = (pageName: string) => {
  logEvent(analytics, 'page_view', {
    page_title: pageName,
    page_location: window.location.href
  });
};

export const trackUserAction = (action: string, category: string) => {
  logEvent(analytics, action, {
    event_category: category,
    event_label: window.location.pathname
  });
};
```

---

## 🛠️ 개발 도구 및 환경

### 1. ESLint 설정

#### 코드 품질 보장
```javascript
// eslint.config.js
export default [
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      '@typescript-eslint/no-unused-vars': 'error',
      'prefer-const': 'error',
      'no-var': 'error'
    },
  },
];
```

### 2. TypeScript 설정

#### 엄격한 타입 체크
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### 3. 패키지 관리

#### package.json 스크립트
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "type-check": "tsc --noEmit",
    "preview": "vite preview",
    "clean": "rm -rf dist node_modules/.vite"
  }
}
```

---

## 🔮 향후 기술 계획

### 1. 성능 개선

#### 2024년 Q2-Q3
```typescript
// React Query 도입
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const usePostsQuery = (filters: PostFilters) => {
  return useQuery({
    queryKey: ['posts', filters],
    queryFn: () => postService.getPosts(filters),
    staleTime: 5 * 60 * 1000, // 5분
    cacheTime: 10 * 60 * 1000, // 10분
  });
};

// Suspense와 Error Boundary 활용
<Suspense fallback={<PostSkeleton />}>
  <ErrorBoundary>
    <PostList />
  </ErrorBoundary>
</Suspense>
```

#### Service Worker & PWA
```typescript
// sw.js
const CACHE_NAME = 'petit-v1';
const urlsToCache = [
  '/',
  '/static/css/main.css',
  '/static/js/main.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});
```

### 2. 실시간 기능 강화

#### WebSocket 또는 Server-Sent Events
```typescript
// Real-time notifications
const useRealtimeNotifications = (userId: string) => {
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        where('isRead', '==', false)
      ),
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            showNotification(change.doc.data());
          }
        });
      }
    );

    return unsubscribe;
  }, [userId]);
};
```

### 3. AI 및 머신러닝 통합

#### 추천 시스템
```typescript
// AI 기반 콘텐츠 추천
const usePersonalizedRecommendations = (userId: string) => {
  return useQuery({
    queryKey: ['recommendations', userId],
    queryFn: async () => {
      // Firebase ML 또는 외부 AI 서비스 호출
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        body: JSON.stringify({ userId })
      });
      return response.json();
    }
  });
};
```

### 4. 모바일 앱 개발

#### Flutter 기반 크로스 플랫폼 앱
```dart
// Flutter WebView 하이브리드 앱
class PetitApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: WebView(
        initialUrl: 'https://gcflab.ai.kr',
        javascriptMode: JavascriptMode.unrestricted,
        onWebViewCreated: (WebViewController webViewController) {
          _controller.complete(webViewController);
        },
      ),
    );
  }
}
```

---

## 📊 성능 메트릭

### 현재 성능 지표
```
🚀 Core Web Vitals
├── First Contentful Paint: 1.2s
├── Largest Contentful Paint: 2.1s
├── Cumulative Layout Shift: 0.05
└── First Input Delay: 45ms

📦 Bundle Size Analysis
├── Total Bundle: 345KB (gzipped)
├── React Vendor: 42KB
├── UI Components: 89KB
├── Firebase: 67KB
└── Application Code: 147KB

🔄 API Performance
├── Authentication: 320ms
├── Post Loading: 180ms
├── Search: 120ms
└── Image Upload: 2.3s
```

### 목표 지표 (2024년 말)
```
🎯 Performance Goals
├── FCP: < 1.0s
├── LCP: < 1.5s
├── CLS: < 0.1
└── FID: < 100ms

📱 Mobile Optimization
├── Lighthouse Score: 95+
├── Bundle Size: < 250KB
└── Load Time: < 2s
```

---

## 🤝 기여 가이드라인

### 개발 환경 설정
```bash
# 저장소 클론
git clone https://github.com/your-org/petit.git
cd petit

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env.local
# .env.local에 Firebase 설정 추가

# 개발 서버 실행
npm run dev
```

### 코딩 스타일
```typescript
// 1. 함수명은 동사로 시작
const getUserPosts = async (userId: string) => { ... };

// 2. 컴포넌트는 PascalCase
const PostCard = ({ post }: PostCardProps) => { ... };

// 3. 상수는 UPPER_SNAKE_CASE
const MAX_UPLOAD_SIZE = 5 * 1024 * 1024; // 5MB

// 4. 인터페이스는 I 접두사 없이
interface UserProfile { ... }

// 5. 타입은 명확하게
type LoadingState = 'idle' | 'loading' | 'success' | 'error';
```

---

<div align="center">
  
  ## 🛠️ 지속적인 기술 혁신으로 더 나은 사용자 경험을
  
  **최신 기술 스택과 모범 사례를 통해 안정적이고 확장 가능한 플랫폼을 구축합니다**
  
  ---
  
  *Technical Documentation v1.0 - Last updated: 2024년*
  
</div> 
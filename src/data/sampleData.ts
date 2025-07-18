import type { CommunityPost, KnowledgeArticle, UserProfile } from '../types';

// MVP용 샘플 사용자 데이터
export const sampleUsers: UserProfile[] = [
  {
    uid: 'sample-user-1',
    email: 'hamzzi.lover@petit.com',
    nickname: '햄찌사랑',
    avatar: '🐹',
    bio: '2년차 햄스터 집사입니다. 젤리와 함께 행복한 일상을 보내고 있어요!',
    createdAt: new Date('2024-01-15')
  },
  {
    uid: 'sample-user-2',
    email: 'parrot.doctor@petit.com',
    nickname: '앵무박사',
    avatar: '🦜',
    bio: '앵무새 전문 수의사입니다. 새들의 건강한 삶을 위해 노력하고 있어요.',
    createdAt: new Date('2023-11-20')
  },
  {
    uid: 'sample-user-3',
    email: 'reptile.king@petit.com',
    nickname: '렙타일킹',
    avatar: '🦎',
    bio: '도마뱀, 거북이, 뱀 등 파충류를 키우는 20년 경력의 베테랑입니다.',
    createdAt: new Date('2023-08-10')
  },
  {
    uid: 'sample-user-4',
    email: 'hedgehog.family@petit.com',
    nickname: '밤송이네',
    avatar: '🦔',
    bio: '고슴도치 밤송이와 함께하는 소소한 일상을 공유합니다.',
    createdAt: new Date('2024-02-28')
  },
  {
    uid: 'sample-user-5',
    email: 'bunny.mom@petit.com',
    nickname: '토순이맘',
    avatar: '🐰',
    bio: '토끼 토순이의 엄마입니다. 토끼 건강 관리에 관심이 많아요.',
    createdAt: new Date('2024-03-05')
  }
];

// MVP용 샘플 커뮤니티 게시물
export const samplePosts: CommunityPost[] = [
  {
    id: 'sample-post-1',
    title: '우리 햄찌 젤리 자랑해요! 너무 귀엽지 않나요? 💕',
    content: `젤리가 오늘 처음으로 제 손에서 간식을 받아먹었어요! 감동의 순간이었습니다 ㅠㅠ

평소에는 경계심이 많아서 손 근처에도 안 왔는데, 오늘 아침에 해바라기씨를 주려고 손을 내밀었더니 조심스럽게 다가와서 받아먹더라구요!

정말 신기하고 감동적이었어서 영상도 찍었는데 너무 귀여워요. 햄스터 키우시는 분들은 이런 경험 있으신가요?`,
    author: sampleUsers[0],
    category: '일상',
    imageUrls: [
      'https://images.unsplash.com/photo-1583337130417-2346a1be284c?q=80&w=800',
      'https://images.unsplash.com/photo-1548767797-d8c844163c4c?q=80&w=800'
    ],
    likes: ['sample-user-2', 'sample-user-3', 'sample-user-4', 'sample-user-5'],
    viewCount: 156,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2시간 전
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: 'sample-post-2',
    title: '앵무새 깃털 색이 이상해요 - 건강 문제일까요?',
    content: `안녕하세요, 코뉴어를 키우고 있는데 최근에 깃털 색깔이 조금 변한 것 같아서 걱정이 됩니다.

원래는 선명한 빨간색이었는데 약간 바래진 것 같고, 일부 깃털은 검은 점들이 생겼어요. 

먹이는 평소와 동일하게 주고 있고, 활동성도 괜찮은 편인데... 혹시 질병의 신호일까요?

전문가분들이나 비슷한 경험 있으신 분들의 조언 부탁드립니다!`,
    author: sampleUsers[1],
    category: '건강',
    likes: ['sample-user-1', 'sample-user-3'],
    viewCount: 89,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4시간 전
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
  },
  {
    id: 'sample-post-3',
    title: '도마뱀을 위한 최고의 사육장 DIY 후기 🛠️',
    content: `3개월에 걸쳐 완성한 맞춤형 도마뱀 사육장입니다!

재료비는 총 15만원 정도 들었고, 직접 설계해서 만들었어요.

주요 특징:
- 온도 구배 시스템 (cool side 24°C, warm side 32°C)
- 자동 분무 시스템으로 습도 조절
- LED 조명으로 자연스러운 주야간 사이클
- 숨을 수 있는 동굴 2개소
- 등반할 수 있는 나무 가지들

우리 비어디드래곤 '킹'이 정말 좋아해요! 설계도와 제작 과정도 공유할게요.`,
    author: sampleUsers[2],
    category: 'DIY',
    imageUrls: [
      'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?q=80&w=800',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800',
      'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?q=80&w=800'
    ],
    likes: ['sample-user-1', 'sample-user-4', 'sample-user-5'],
    viewCount: 203,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6시간 전
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
  },
  {
    id: 'sample-post-4',
    title: '고슴도치 목욕 꿀팁 공유해요! (사진 많음) 🛁',
    content: `고슴도치 목욕시키는 방법과 주의사항들을 정리해봤어요.

특히 온도 조절이 정말 중요한데, 37-38도 정도의 미지근한 물을 사용해야 해요.

준비물:
- 작은 세면대나 대야
- 고슴도치 전용 샴푸 (베이비 샴푸도 OK)
- 부드러운 칫솔
- 마른 수건 여러 장

과정:
1. 물 온도 체크 (손목으로 확인)
2. 천천히 발가락부터 적시기
3. 등 부분은 손으로 살살 문지르기
4. 가시 부분은 칫솔로 조심스럽게
5. 충분히 헹구고 바로 말리기

밤송이는 목욕을 싫어했는데 이 방법으로 하니까 순해졌어요!`,
    author: sampleUsers[3],
    category: '꿀팁',
    imageUrls: [
      'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=800'
    ],
    likes: ['sample-user-1', 'sample-user-2'],
    viewCount: 167,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1일 전
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
  },
  {
    id: 'sample-post-5',
    title: '토끼가 갑자기 음식을 안 먹어요 ㅠㅠ 응급상황인가요?',
    content: `어제까지는 평소처럼 잘 먹었는데 오늘 아침부터 아무것도 안 먹네요...

펠릿도, 건초도, 좋아하는 당근도 거들떠보지도 않아요. 물은 조금 마시는 것 같은데...

다른 증상:
- 평소보다 활동량 감소
- 몸을 웅크리고 있음
- 똥도 평소보다 적게 나옴

혹시 응급처치 방법이나 즉시 병원에 가야 할 증상인지 아시는 분 계신가요?

너무 걱정돼서 잠을 못 잤어요 😭`,
    author: sampleUsers[4],
    category: '응급',
    likes: ['sample-user-2'],
    viewCount: 134,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1일 전
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
  },
  {
    id: 'sample-post-6',
    title: '친칠라 모래목욕 ASMR 영상 찍어봤어요 ✨',
    content: `보들보들한 친칠라 '구름이'의 모래목욕 영상이에요!

정말 힐링되는 모습이라 여러분과 공유하고 싶었어요. 모래 속에서 뒹굴뒹굴하는 모습이 너무 귀여워요 💕

친칠라는 물로 목욕하면 안 되고, 전용 모래로만 목욕해야 하는데 정말 즐거워하는 것 같아요.

ASMR 좋아하시는 분들한테 추천드려요!

#친칠라 #모래목욕 #ASMR #힐링`,
    author: sampleUsers[0],
    category: '영상',
    likes: ['sample-user-1', 'sample-user-2', 'sample-user-3', 'sample-user-4'],
    viewCount: 312,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2일 전
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  }
];

// MVP용 샘플 지식백과 데이터
export const sampleKnowledgeArticles: KnowledgeArticle[] = [
  {
    id: 'sample-article-1',
    title: '햄스터 기본 사육법 완전 정복',
    content: `햄스터는 작지만 매우 활발하고 귀여운 반려동물입니다. 올바른 사육법을 알아보세요.

## 1. 사육장 환경
- 최소 크기: 60cm x 40cm (더 클수록 좋음)
- 바닥재: 펜 우드칩, 종이 깔개 (솔잎은 금지)
- 온도: 18-24°C 유지
- 습도: 40-60% 유지

## 2. 먹이
- 햄스터 전용 펠릿 (하루 10-15g)
- 신선한 채소 (당근, 브로콜리, 오이)
- 금지 음식: 양파, 마늘, 초콜릿, 감귤류

## 3. 운동과 놀이
- 휠: 직경 20cm 이상
- 터널과 숨을 곳 필수
- 하루 1-2시간 플레이타임

## 4. 건강 관리
- 정기적인 체중 체크
- 털 상태 관찰
- 이상 증상 시 즉시 수의사 상담`,
    author: sampleUsers[1],
    category: '사육법',
    tags: ['햄스터', '기초사육', '초보자', '환경설정'],
    imageUrls: [
      'https://images.unsplash.com/photo-1548767797-d8c844163c4c?q=80&w=800'
    ],
    viewCount: 1250,
    likes: ['sample-user-1', 'sample-user-3', 'sample-user-4'],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-25')
  },
  {
    id: 'sample-article-2',
    title: '앵무새 건강 체크포인트 10가지',
    content: `앵무새의 건강 상태를 확인하는 방법을 알아보세요.

## 1. 깃털 상태
- 광택이 나고 매끄러워야 함
- 대칭적으로 자라야 함
- 과도한 털 빠짐은 스트레스나 질병 신호

## 2. 눈과 코
- 맑고 깨끗해야 함
- 분비물이나 부종 없어야 함

## 3. 부리와 발가락
- 부리: 매끄럽고 균등한 성장
- 발가락: 모든 발가락 사용 가능

## 4. 체중과 식욕
- 정기적인 체중 측정
- 평소와 같은 식욕 유지

## 5. 행동 패턴
- 활발한 움직임
- 평소와 같은 소리

정기적인 건강 체크로 우리 새친구들의 건강을 지켜주세요!`,
    author: sampleUsers[1],
    category: '건강관리',
    tags: ['앵무새', '건강체크', '예방', '질병'],
    viewCount: 890,
    likes: ['sample-user-2', 'sample-user-5'],
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-12')
  },
  {
    id: 'sample-article-3',
    title: '도마뱀 사육장 온도 관리 완전 가이드',
    content: `파충류에게 온도는 생명과 직결되는 중요한 요소입니다.

## 온도 구배 시스템
파충류는 변온동물이므로 사육장 내에 온도 차이가 있어야 합니다.

### Warm Side (따뜻한 쪽)
- 낮: 30-35°C
- 밤: 25-28°C
- Basking Spot: 40-45°C

### Cool Side (서늘한 쪽)
- 낮: 22-26°C  
- 밤: 18-22°C

## 필요한 장비
1. **세라믹 히터**: 24시간 사용 가능
2. **할로겐 전구**: 자연광 모방
3. **온도계**: 디지털 타입 2개 이상
4. **서모스탯**: 온도 자동 조절

## 주의사항
- 히트록은 화상 위험으로 비추천
- 야간 온도 급강하 방지
- 정기적인 온도계 검증

올바른 온도 관리로 건강한 파충류 라이프를!`,
    author: sampleUsers[2],
    category: '사육법',
    tags: ['도마뱀', '파충류', '온도관리', '히터'],
    imageUrls: [
      'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?q=80&w=800'
    ],
    viewCount: 567,
    likes: ['sample-user-1', 'sample-user-3'],
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15')
  }
];

// 샘플 데이터인지 확인하는 함수
export const isSampleData = (id: string): boolean => {
  return id.startsWith('sample-');
};

// 개발 환경에서만 샘플 데이터 표시 여부
export const shouldShowSampleData = (): boolean => {
  return import.meta.env.DEV; // Vite 개발 환경에서만 true
}; 
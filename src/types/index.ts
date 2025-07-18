// 사용자 프로필 타입
export interface UserProfile {
  uid: string;
  email: string | null;
  nickname: string;
  avatar?: string; // 이모지나 이미지 URL
  bio?: string;
  createdAt: Date;
}

// 커뮤니티 게시물 타입
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
  imageUrls?: string[]; // 첨부 이미지들
  likes: string[]; // 좋아요한 사용자들의 UID 배열
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// 댓글 타입
export interface Comment {
  id: string;
  postId: string;
  content: string;
  author: {
    uid: string;
    nickname: string;
    avatar?: string;
  };
  parentId?: string; // 대댓글인 경우 부모 댓글 ID
  replies?: Comment[]; // 대댓글 목록 (UI에서만 사용)
  likes: string[]; // 좋아요한 사용자들의 UID 배열
  createdAt: Date;
  updatedAt: Date;
}

// 지식백과 글 타입
export interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  author: {
    uid: string;
    nickname: string;
    avatar?: string;
  };
  category: '사육법' | '건강관리' | '용품리뷰' | '응급처치' | '기타';
  tags: string[];
  imageUrls?: string[];
  viewCount: number;
  likes: string[];
  createdAt: Date;
  updatedAt: Date;
}

// 알림 타입
export interface Notification {
  id: string;
  userId: string; // 알림을 받을 사용자
  type: 'COMMENT' | 'LIKE' | 'MENTION' | 'SYSTEM';
  fromUser?: {
    uid: string;
    nickname: string;
    avatar?: string;
  };
  postId?: string;
  postTitle?: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

// Firestore 컬렉션 이름 상수
export const COLLECTIONS = {
  USERS: 'users',
  POSTS: 'posts',
  COMMENTS: 'comments',
  ARTICLES: 'articles',
  NOTIFICATIONS: 'notifications'
} as const;

// 카테고리 상수
export const POST_CATEGORIES = [
  '일상', '건강', 'DIY', '꿀팁', '응급', '영상', '기타'
] as const;

export const ARTICLE_CATEGORIES = [
  '사육법', '건강관리', '용품리뷰', '응급처치', '기타'
] as const; 
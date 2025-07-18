// 🎨 카테고리별 색상 매핑 (의미론적 색상 시스템)
export function getCategoryColor(category: string): string {
  switch (category) {
    case '건강':
    case '건강관리':
      return 'health-red'; // 건강 = 빨간색 (주의, 중요함)
    case '응급':
    case '응급처치':
      return 'safety-orange'; // 응급 = 주황색 (경고, 긴급)
    case 'DIY':
    case '사육법':
      return 'soft-sky'; // 사육법 = 하늘색 (차분, 전문적)
    case '꿀팁':
      return 'fresh-green'; // 팁 = 초록색 (도움, 성장)
    case '영상':
      return 'comfort-purple'; // 영상 = 보라색 (엔터테인먼트)
    case '용품리뷰':
      return 'sunny-yellow'; // 리뷰 = 노랑색 (정보, 밝음)
    case '일상':
      return 'warm-coral'; // 일상 = 코랄색 (따뜻, 일상적)
    default:
      return 'warm-coral';
  }
}

// 📅 시간 포맷팅 유틸리티
export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return '방금 전';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}일 전`;
  return `${Math.floor(diffInSeconds / 2592000)}개월 전`;
}

// 🎯 카드 호버 효과 헬퍼
export const cardHoverProps = {
  className: "petit-card",
  style: {
    cursor: 'pointer',
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const
  }
};

// 💖 좋아요 버튼 props 헬퍼
export const likeButtonProps = (isLiked: boolean, loading: boolean) => ({
  className: `like-button ${isLiked ? 'liked' : ''}`,
  variant: 'subtle' as const,
  color: isLiked ? 'red' : 'gray',
  loading,
  style: {
    transform: isLiked ? 'scale(1.1)' : 'scale(1)',
    transition: 'all 0.2s ease',
  }
}); 
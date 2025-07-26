import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 🕐 시간 포맷팅 함수
export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMilliseconds = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
  const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) {
    return '방금 전';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`;
  } else if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  } else if (diffInDays < 7) {
    return `${diffInDays}일 전`;
  } else {
    return date.toLocaleDateString('ko-KR');
  }
}

// 🎨 카테고리 색상 반환 함수
export function getCategoryColor(category: string): string {
  const colors: { [key: string]: string } = {
    '강아지': 'bg-petit-primary text-white',
    '고양이': 'bg-petit-secondary text-white',
    '기타': 'bg-petit-accent text-white',
    '건강': 'bg-petit-success text-white',
    '행동': 'bg-purple-500 text-white',
    '영양': 'bg-orange-500 text-white',
    '용품': 'bg-pink-500 text-white',
    '일반': 'bg-gray-500 text-white'
  };
  return colors[category] || 'bg-gray-500 text-white';
}

// 🎭 카드 호버 효과 props
export function cardHoverProps() {
  return {
    className: "transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
  };
}

// 👍 좋아요 버튼 props  
export function likeButtonProps(isLiked: boolean = false, loading: boolean = false) {
  return {
    className: cn(
      "flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-all duration-200",
      loading && "opacity-50 cursor-not-allowed",
      isLiked 
        ? "bg-petit-primary text-white hover:bg-petit-primary-dark" 
        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    ),
    disabled: loading
  };
}

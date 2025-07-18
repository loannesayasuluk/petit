import { createTheme, type MantineColorsTuple } from '@mantine/core';

// 🎨 Petit 애완동물 테마 색상 팔레트
const warmCoral: MantineColorsTuple = [
  '#fff0ec', '#fde2d9', '#f9c3b4', '#f6a28d', '#f3856d',
  '#f17258', '#f1684f', '#d55640', '#be4b36', '#a63f2c'
];

const softSky: MantineColorsTuple = [
  '#f0f9ff', '#e0f2fe', '#bae6fd', '#7dd3fc', '#38bdf8',
  '#0ea5e9', '#0284c7', '#0369a1', '#075985', '#0c4a6e'
];

const sunnyYellow: MantineColorsTuple = [
  '#fefce8', '#fef3c7', '#fde68a', '#fcd34d', '#facc15',
  '#eab308', '#ca8a04', '#a16207', '#854d0e', '#713f12'
];

const freshGreen: MantineColorsTuple = [
  '#f0fdf4', '#dcfce7', '#bbf7d0', '#86efac', '#4ade80',
  '#22c55e', '#16a34a', '#15803d', '#166534', '#14532d'
];

const neutralGray: MantineColorsTuple = [
  '#fafafa', '#f5f5f5', '#e5e5e5', '#d4d4d4', '#a3a3a3',
  '#737373', '#525252', '#404040', '#262626', '#171717'
];

export const theme = createTheme({
  colors: { 
    'warm-coral': warmCoral,
    'soft-sky': softSky,
    'sunny-yellow': sunnyYellow,
    'fresh-green': freshGreen,
    'neutral-gray': neutralGray,
  },
  primaryColor: 'warm-coral',

  // 🎭 폰트 시스템
  fontFamily: 'NanumSquareRound, sans-serif',
  headings: {
    fontWeight: '800',
  },

  // 🏗️ 디자인 토큰
  defaultRadius: 'lg',
  shadows: {
    xs: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
    sm: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    md: '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.12)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.15)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.15), 0 10px 10px rgba(0, 0, 0, 0.1)'
  },

  // 📱 컴포넌트 기본값
  components: {
    Button: { 
      defaultProps: { 
        size: 'md', 
        radius: 'xl' 
      } 
    },
    Card: { 
      defaultProps: { 
        shadow: 'sm', 
        padding: 'lg', 
        radius: 'lg', 
        withBorder: true 
      } 
    },
    TextInput: { 
      defaultProps: { 
        radius: 'lg' 
      } 
    },
    Badge: {
      defaultProps: {
        variant: 'light',
        radius: 'xl'
      }
    }
  },

  // 🎨 전역 스타일
  other: {
    // 배경 그라데이션
    backgroundGradient: 'linear-gradient(135deg, #fff9f3 0%, #fef3e2 100%)',
    // 카드 호버 효과
    cardHover: 'translateY(-3px)',
    // 애니메이션 설정
    transition: {
      fast: '0.15s ease',
      normal: '0.3s ease',
      slow: '0.6s ease'
    }
  }
}); 
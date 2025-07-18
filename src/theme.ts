import { createTheme, type MantineColorsTuple } from '@mantine/core';

const warmCoral: MantineColorsTuple = [
  '#fff0eC', '#fde2d9', '#f9c3b4', '#f6a28d', '#f3856d',
  '#f17258', '#f1684f', '#d55640', '#be4b36', '#a63f2c'
];

export const theme = createTheme({
  colors: { 'warm-coral': warmCoral },
  primaryColor: 'warm-coral',

  // 최소한의 폰트 설정 (CSS에서 강제 적용)
  fontFamily: 'NanumSquareRound, sans-serif',
  headings: {
    fontWeight: '800',
  },

  defaultRadius: 'lg',
  components: {
    Button: { defaultProps: { size: 'md', radius: 'xl' } },
    Card: { defaultProps: { shadow: 'sm', padding: 'lg', radius: 'lg', withBorder: true, borderColor: '#f1f3f5' } },
    TextInput: { defaultProps: { radius: 'lg' } },
  },
}); 
import { Stack, Text, Button, Box } from '@mantine/core';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  illustration?: 'posts' | 'comments' | 'knowledge' | 'search' | 'profile';
  size?: 'sm' | 'md' | 'lg';
}

function getIllustration(type: string) {
  switch (type) {
    case 'posts':
      return (
        <Box style={{ fontSize: '4rem', filter: 'sepia(20%) saturate(150%) hue-rotate(15deg)' }}>
          🏠✨
        </Box>
      );
    case 'comments':
      return (
        <Box style={{ fontSize: '3.5rem', filter: 'sepia(20%) saturate(150%) hue-rotate(30deg)' }}>
          💬🐾
        </Box>
      );
    case 'knowledge':
      return (
        <Box style={{ fontSize: '4rem', filter: 'sepia(20%) saturate(150%) hue-rotate(45deg)' }}>
          📚🔍
        </Box>
      );
    case 'search':
      return (
        <Box style={{ fontSize: '3.5rem', filter: 'sepia(20%) saturate(150%) hue-rotate(60deg)' }}>
          🔍❓
        </Box>
      );
    case 'profile':
      return (
        <Box style={{ fontSize: '4rem', filter: 'sepia(20%) saturate(150%) hue-rotate(75deg)' }}>
          📝💭
        </Box>
      );
    default:
      return (
        <Box style={{ fontSize: '4rem', filter: 'sepia(20%) saturate(150%) hue-rotate(0deg)' }}>
          🐾💫
        </Box>
      );
  }
}

export function EmptyState({ 
  icon, 
  title, 
  description, 
  actionText, 
  onAction, 
  illustration = 'posts',
  size = 'md' 
}: EmptyStateProps) {
  const sizes = {
    sm: { padding: 'xl', titleSize: 'lg', descSize: 'sm' },
    md: { padding: '4rem', titleSize: 'xl', descSize: 'md' },
    lg: { padding: '6rem', titleSize: '2xl', descSize: 'lg' }
  };

  const currentSize = sizes[size];

  return (
    <Stack 
      align="center" 
      gap="lg" 
      py={currentSize.padding}
      style={{
        textAlign: 'center',
        background: 'linear-gradient(135deg, #fff9f3 0%, #fef8f0 100%)',
        borderRadius: 'var(--mantine-radius-lg)',
        border: '2px dashed var(--petit-primary-light)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* 배경 장식 */}
      <Box
        style={{
          position: 'absolute',
          top: '10%',
          right: '10%',
          fontSize: '1.5rem',
          opacity: 0.1,
          transform: 'rotate(15deg)',
          animation: 'float 3s ease-in-out infinite'
        }}
      >
        🐾
      </Box>
      <Box
        style={{
          position: 'absolute',
          bottom: '15%',
          left: '15%',
          fontSize: '1.2rem',
          opacity: 0.1,
          transform: 'rotate(-10deg)',
          animation: 'float 3s ease-in-out infinite 1.5s'
        }}
      >
        ✨
      </Box>

      {/* 메인 일러스트 */}
      <Box
        style={{
          animation: 'bounce 2s ease-in-out infinite',
          transformOrigin: 'center bottom'
        }}
      >
        {icon ? (
          <Text size="4rem" style={{ lineHeight: 1 }}>
            {icon}
          </Text>
        ) : (
          getIllustration(illustration)
        )}
      </Box>

      {/* 제목 */}
      <Text 
        size={currentSize.titleSize} 
        fw={700} 
        c="warm-coral.7"
        style={{
          background: 'linear-gradient(135deg, var(--petit-primary) 0%, var(--petit-accent) 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}
      >
        {title}
      </Text>

      {/* 설명 */}
      <Text 
        size={currentSize.descSize} 
        c="dimmed" 
        maw={400} 
        style={{ lineHeight: 1.6 }}
      >
        {description}
      </Text>

      {/* 행동 버튼 */}
      {actionText && onAction && (
        <Button
          onClick={onAction}
          size="md"
          className="floating-button"
          mt="md"
          style={{
            transform: 'scale(1)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1) translateY(0px)';
          }}
        >
          {actionText}
        </Button>
      )}


    </Stack>
  );
} 
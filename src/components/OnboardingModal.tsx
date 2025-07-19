import { Modal, Button, Group, Text, Stack, Stepper, Box, Card, Image, Badge, ThemeIcon } from '@mantine/core';
import { useState } from 'react';
import { 
  IconPaw, 
  IconHeart, 
  IconBook, 
  IconMessage, 
  IconSearch, 
  IconUser,
  IconCheck,
  IconChevronRight,
  IconStars
} from '@tabler/icons-react';

interface OnboardingModalProps {
  opened: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

const onboardingSteps = [
  {
    title: 'Petit에 오신 걸 환영해요! 🎉',
    content: (
      <Stack align="center" gap="lg">
        <Box ta="center">
          <Text size="3rem" mb="xs">🐾</Text>
          <Text size="xl" fw={700} c="petit-primary">
            초보 집사를 위한 전문 케어 플랫폼
          </Text>
          <Text c="dimmed" mt="sm">
            수의사 검증 정보와 경험 많은 집사들의<br />
            실전 노하우를 한곳에서!
          </Text>
        </Box>
      </Stack>
    )
  },
  {
    title: '집사 소통 라운지 💬',
    content: (
      <Card withBorder radius="lg" p="lg">
        <Group gap="md" mb="md">
          <ThemeIcon size="xl" radius="xl" color="blue">
            <IconMessage size="1.5rem" />
          </ThemeIcon>
          <Box>
            <Text fw={600} size="lg">실시간 소통 공간</Text>
            <Text size="sm" c="dimmed">우리 애기들의 이야기를 나눠요</Text>
          </Box>
        </Group>
        
        <Stack gap="sm">
          <Group gap="xs">
            <Badge size="sm" color="blue" variant="light">일상</Badge>
            <Text size="sm">귀여운 일상 공유</Text>
          </Group>
          <Group gap="xs">
            <Badge size="sm" color="red" variant="light">건강</Badge>
            <Text size="sm">건강 걱정 상담</Text>
          </Group>
          <Group gap="xs">
            <Badge size="sm" color="green" variant="light">꿀팁</Badge>
            <Text size="sm">베테랑 집사 노하우</Text>
          </Group>
        </Stack>
      </Card>
    )
  },
  {
    title: '전문가 케어 가이드 📚',
    content: (
      <Card withBorder radius="lg" p="lg">
        <Group gap="md" mb="md">
          <ThemeIcon size="xl" radius="xl" color="orange">
            <IconBook size="1.5rem" />
          </ThemeIcon>
          <Box>
            <Text fw={600} size="lg">검증된 전문 정보</Text>
            <Text size="sm" c="dimmed">수의사가 검증한 신뢰할 수 있는 케어법</Text>
          </Box>
        </Group>
        
        <Stack gap="sm">
          <Group gap="xs">
            <Badge size="sm" color="orange" variant="light">사육법</Badge>
            <Text size="sm">기본 케어 방법</Text>
          </Group>
          <Group gap="xs">
            <Badge size="sm" color="red" variant="light">건강관리</Badge>
            <Text size="sm">질병 예방 & 관리</Text>
          </Group>
          <Group gap="xs">
            <Badge size="sm" color="green" variant="light">응급처치</Badge>
            <Text size="sm">응급상황 대처법</Text>
          </Group>
        </Stack>
      </Card>
    )
  },
  {
    title: '스마트한 검색 기능 🔍',
    content: (
      <Card withBorder radius="lg" p="lg">
        <Group gap="md" mb="md">
          <ThemeIcon size="xl" radius="xl" color="purple">
            <IconSearch size="1.5rem" />
          </ThemeIcon>
          <Box>
            <Text fw={600} size="lg">실시간 검색</Text>
            <Text size="sm" c="dimmed">원하는 정보를 빠르게 찾아보세요</Text>
          </Box>
        </Group>
        
        <Stack gap="md">
          <Box 
            style={{ 
              background: 'var(--mantine-color-gray-0)',
              padding: '0.75rem',
              borderRadius: 'var(--mantine-radius-md)',
              border: '2px dashed var(--mantine-color-gray-3)'
            }}
          >
            <Group gap="xs">
              <IconSearch size="1rem" color="var(--mantine-color-gray-6)" />
              <Text size="sm" c="dimmed" style={{ fontFamily: 'monospace' }}>
                Ctrl + K로 언제든 검색!
              </Text>
            </Group>
          </Box>
          
          <Text size="sm" c="dimmed">
            💡 팁: 헤더의 검색창이나 <kbd>Ctrl+K</kbd> 단축키로<br />
            원하는 정보를 바로 찾을 수 있어요!
          </Text>
        </Stack>
      </Card>
    )
  },
  {
    title: '이제 시작해볼까요? 🚀',
    content: (
      <Stack align="center" gap="lg">
        <Box ta="center">
          <Text size="3rem" mb="xs">✨</Text>
          <Text size="xl" fw={700} c="petit-primary">
            준비 완료!
          </Text>
          <Text c="dimmed" mt="sm" mb="lg">
            우리 애기들을 위한 여정을 시작해보세요!
          </Text>
        </Box>
        
        <Stack gap="sm" w="100%">
          <Card withBorder p="md" style={{ backgroundColor: 'var(--mantine-color-blue-0)' }}>
            <Group gap="md">
              <IconHeart size="1.2rem" color="var(--mantine-color-blue-6)" />
              <Box>
                <Text fw={600} size="sm">첫 번째 이야기 공유하기</Text>
                <Text size="xs" c="dimmed">우리 애기 자랑하러 가기</Text>
              </Box>
            </Group>
          </Card>
          
          <Card withBorder p="md" style={{ backgroundColor: 'var(--mantine-color-orange-0)' }}>
            <Group gap="md">
              <IconBook size="1.2rem" color="var(--mantine-color-orange-6)" />
              <Box>
                <Text fw={600} size="sm">전문가 가이드 둘러보기</Text>
                <Text size="xs" c="dimmed">유용한 케어 정보 확인하기</Text>
              </Box>
            </Group>
          </Card>
        </Stack>
      </Stack>
    )
  }
];

export function OnboardingModal({ opened, onClose, onComplete }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    onComplete?.();
    onClose();
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="sm">
          <IconStars size="1.2rem" color="var(--petit-primary)" />
          <Text fw={700} c="petit-primary">Petit 시작하기</Text>
        </Group>
      }
      size="lg"
      centered
      withCloseButton={false}
      styles={{
        content: {
          background: 'linear-gradient(135deg, #fff9f3 0%, #fef8f0 100%)',
          border: '2px solid var(--petit-primary-light)'
        }
      }}
    >
      <Stack gap="xl">
        {/* 진행도 표시 */}
        <Box>
          <Stepper 
            active={currentStep} 
            size="sm"
            styles={{
              step: {
                '&[data-completed]': {
                  backgroundColor: 'var(--petit-primary)',
                  borderColor: 'var(--petit-primary)'
                }
              },
              stepIcon: {
                '&[data-completed]': {
                  backgroundColor: 'var(--petit-primary)',
                  borderColor: 'var(--petit-primary)'
                }
              }
            }}
          >
            {onboardingSteps.map((_, index) => (
              <Stepper.Step key={index} />
            ))}
          </Stepper>
        </Box>

        {/* 현재 단계 내용 */}
        <Box mih={300}>
          <Text size="xl" fw={700} mb="lg" ta="center">
            {onboardingSteps[currentStep].title}
          </Text>
          {onboardingSteps[currentStep].content}
        </Box>

        {/* 네비게이션 버튼 */}
        <Group justify="space-between">
          <Group>
            {currentStep > 0 && (
              <Button variant="subtle" onClick={handlePrevious}>
                이전
              </Button>
            )}
            <Button variant="subtle" color="gray" onClick={handleSkip}>
              건너뛰기
            </Button>
          </Group>
          
          <Button
            onClick={handleNext}
            rightSection={
              currentStep < onboardingSteps.length - 1 ? 
                <IconChevronRight size="1rem" /> : 
                <IconCheck size="1rem" />
            }
            className="floating-button"
          >
            {currentStep < onboardingSteps.length - 1 ? '다음' : '시작하기!'}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
} 
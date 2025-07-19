import { Card, Title, Group, Badge, Stack, Text } from '@mantine/core';
import { IconTrendingUp } from '@tabler/icons-react';

interface TrendingSidebarProps {
  className?: string;
}

export function TrendingSidebar({ className }: TrendingSidebarProps) {
  const trendingTags = [
    { tag: '사료추천', count: 42, color: 'warm-coral' },
    { tag: '건강상식', count: 38, color: 'soft-sky' },
    { tag: '산책꿀팁', count: 31, color: 'fresh-green' },
    { tag: '응급처치', count: 24, color: 'health-red' },
    { tag: '훈련법', count: 19, color: 'sunny-yellow' },
    { tag: '용품리뷰', count: 16, color: 'comfort-purple' },
    { tag: '미용법', count: 12, color: 'neutral-gray' },
    { tag: '놀이법', count: 8, color: 'safety-orange' }
  ];

  return (
    <div className={className}>
      <Card shadow="sm" padding="lg" radius="lg" withBorder>
        <Group mb="md">
          <IconTrendingUp size="1.2rem" color="var(--mantine-color-warm-coral-6)" />
          <Title order={3} size="lg" fw={700}>
            인기 태그 🔥
          </Title>
        </Group>
        
        <Stack gap="xs">
          {trendingTags.map((item, index) => (
            <Group key={item.tag} justify="space-between" style={{ cursor: 'pointer' }}>
              <Group gap="xs">
                <Text size="sm" fw={500} c="dimmed">
                  #{index + 1}
                </Text>
                <Badge 
                  variant="light" 
                  color={item.color}
                  style={{ cursor: 'pointer' }}
                  onClick={() => console.log(`태그 클릭: ${item.tag}`)}
                >
                  #{item.tag}
                </Badge>
              </Group>
              <Text size="xs" c="dimmed">
                {item.count}개
              </Text>
            </Group>
          ))}
        </Stack>
        
        <Text size="xs" c="dimmed" mt="md" ta="center">
          💡 태그를 클릭하면 관련 게시물을 볼 수 있어요
        </Text>
      </Card>
    </div>
  );
} 
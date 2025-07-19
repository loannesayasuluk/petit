import { Card, Title, Group, Badge, Stack, Text, Loader, Center } from '@mantine/core';
import { IconTrendingUp } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { getTopTags } from '../services/tagService';
import type { Tag } from '../types';

interface TrendingSidebarProps {
  className?: string;
  onTagClick?: (tagName: string) => void;
}

export function TrendingSidebar({ className, onTagClick }: TrendingSidebarProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  const tagColors = [
    'warm-coral', 'soft-sky', 'fresh-green', 'health-red', 
    'sunny-yellow', 'comfort-purple', 'neutral-gray', 'safety-orange'
  ];

  useEffect(() => {
    const loadTrendingTags = async () => {
      try {
        setLoading(true);
        const topTags = await getTopTags(8);
        setTags(topTags);
      } catch (error) {
        console.error('인기 태그 로딩 오류:', error);
        // 에러 시 빈 배열 유지
        setTags([]);
      } finally {
        setLoading(false);
      }
    };

    loadTrendingTags();
  }, []);

  return (
    <div className={className}>
      <Card shadow="sm" padding="lg" radius="lg" withBorder>
        <Group mb="md">
          <IconTrendingUp size="1.2rem" color="var(--mantine-color-warm-coral-6)" />
          <Title order={3} size="lg" fw={700}>
            인기 태그 🔥
          </Title>
        </Group>
        
        {loading ? (
          <Center py="md">
            <Loader size="sm" />
          </Center>
        ) : tags.length === 0 ? (
          <Text size="sm" c="dimmed" ta="center" py="md">
            아직 인기 태그가 없어요.<br />
            첫 번째 태그를 만들어보세요! ✨
          </Text>
        ) : (
          <Stack gap="xs">
            {tags.map((tag, index) => (
              <Group 
                key={tag.id} 
                justify="space-between" 
                style={{ cursor: 'pointer' }}
                onClick={() => onTagClick?.(tag.id)}
              >
                <Group gap="xs">
                  <Text size="sm" fw={500} c="dimmed">
                    #{index + 1}
                  </Text>
                  <Badge 
                    variant="light" 
                    color={tagColors[index % tagColors.length]}
                    style={{ cursor: 'pointer' }}
                  >
                    #{tag.id}
                  </Badge>
                </Group>
                <Text size="xs" c="dimmed">
                  {tag.count}개
                </Text>
              </Group>
            ))}
          </Stack>
        )}
        
        <Text size="xs" c="dimmed" mt="md" ta="center">
          💡 태그를 클릭하면 관련 게시물을 볼 수 있어요
        </Text>
      </Card>
    </div>
  );
} 
import { Title, Text, Button, Group, Box, Grid, Image, Card, SimpleGrid, Divider, Loader, Center, Stack } from '@mantine/core';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useState, useEffect } from 'react';
import { getPosts } from '../services/postService';
import type { CommunityPost } from '../types';
import { samplePosts } from '../data/sampleData';

function WelcomeSection() {
  const { ref, isVisible } = useScrollAnimation();
  
  return (
    <Grid 
      align="center" 
      gutter={40}
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0px)' : 'translateY(30px)',
        transition: 'all 0.8s ease-out'
      }}
    >
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Title order={1} fz={{ base: '2.5rem', md: '3.5rem' }} lh={1.3} fw={800}>
          우리 애기들을 위한<br/>행복한 소통 공간
        </Title>
        <Text c="dimmed" mt="lg" mb="xl" fz="lg">
          '프티'에서 소중한 아이들의 순간을 공유하고, 더 건강하게 키울 수 있는 알찬 정보들을 만나보세요.
        </Text>
        <Group>
          <Button 
            size="lg" 
            style={{ 
              transition: 'all 0.3s ease',
              transform: 'scale(1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = 'var(--mantine-shadow-lg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'var(--mantine-shadow-sm)';
            }}
          >
            커뮤니티 바로가기
          </Button>
        </Group>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Image 
          radius="xl" 
          src="https://images.unsplash.com/photo-1583337130417-2346a1be284c?q=80&w=1887" 
          style={{ 
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.02)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
      </Grid.Col>
    </Grid>
  );
}

function RecentPosts() {
  const { ref, isVisible } = useScrollAnimation();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecentPosts = async () => {
      try {
        // Firebase에서 데이터 로딩 (fallback 제거)
        const result = await getPosts(4); // 최신 4개만 가져오기
        const allPosts = result.posts;
        
        if (allPosts.length > 0) {
          // Firebase에서 데이터를 성공적으로 가져온 경우
          setPosts(allPosts);
        } else {
          // Firebase에 데이터가 없는 경우
          console.log('🔄 Firebase에 게시물이 없습니다. 관리자가 샘플 데이터를 업로드해야 합니다.');
          setPosts([]);
        }
      } catch (error) {
        console.error('최신 게시물 로딩 오류:', error);
        console.log(`Firebase 연결 오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    loadRecentPosts();
  }, []);

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return '방금 전';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    return `${Math.floor(diffInSeconds / 86400)}일 전`;
  };
  
  return (
    <Box 
      my={80}
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0px)' : 'translateY(50px)',
        transition: 'all 1s ease-out 0.2s'
      }}
    >
      <Divider my="xl" labelPosition="center" label={<Title order={2}>최신 커뮤니티 소식 💬</Title>} />
      
      {loading ? (
        <Center py="xl">
          <Stack align="center" gap="md">
            <Loader size="lg" />
            <Text c="dimmed">최신 소식을 불러오는 중...</Text>
          </Stack>
        </Center>
      ) : posts.length === 0 ? (
        <Center py="xl">
          <Stack align="center" gap="md">
            <Text size="lg" c="dimmed">
              아직 게시물이 없습니다
            </Text>
            <Text size="sm" c="dimmed">
              첫 번째 이야기를 들려주세요!
            </Text>
          </Stack>
        </Center>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }}>
          {posts.map((post) => (
            <Card 
              key={post.id}
              withBorder 
              style={{ 
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                transform: 'translateY(0px)'
              }} 
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = 'var(--mantine-shadow-lg)';
                e.currentTarget.style.transform = 'translateY(-5px)';
              }} 
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'var(--mantine-shadow-sm)';
                e.currentTarget.style.transform = 'translateY(0px)';
              }}
            >
              <Text fw={700} lineClamp={2}>
                {post.title}
              </Text>
              <Text size="sm" c="dimmed" mt="xs">
                작성자: {post.author.avatar} {post.author.nickname}
              </Text>
              <Text size="xs" c="dimmed" mt="xs">
                {formatTimeAgo(post.createdAt)}
              </Text>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
}

export function HomePage() {
  return (
    <>
      <WelcomeSection />
      <RecentPosts />
    </>
  );
} 
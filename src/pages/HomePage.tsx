import { Title, Text, Button, Group, Box, Grid, Image, Card, SimpleGrid, Loader, Center, Stack } from '@mantine/core';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useState, useEffect } from 'react';
import { getPosts } from '../services/postService';
import type { CommunityPost } from '../types';
import { formatTimeAgo, cardHoverProps } from '../lib/utils';
import { EmptyState } from '../components/EmptyState';
import { OnboardingModal } from '../components/OnboardingModal';

function WelcomeSection({ setCurrentPage }: { setCurrentPage: (page: 'home' | 'knowledge' | 'community' | 'mypage') => void }) {
  const { ref, isVisible } = useScrollAnimation();
  
  return (
    <Box py="xl">
      <Grid 
        align="center" 
        gutter={40}
        ref={ref}
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0px)' : 'translateY(20px)',
          transition: 'all 0.6s ease-out'
        }}
      >
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Title order={1} fz={{ base: '1.8rem', md: '2.4rem' }} lh={1.2} fw={800}>
          처음 키우는데 막막하세요?<br/>선배 집사들이 도와드려요! 💕
        </Title>
        <Text c="dimmed" mt="sm" mb="md" fz="sm">
          실전 경험담과 따뜻한 조언으로 함께 성장해요<br/>
          지금 <strong>247명의 집사들</strong>이 경험을 나누고 있어요!
        </Text>
        
        {/* 따뜻한 커뮤니티 분위기 */}
        <Group gap="lg" mb="sm">
          <Group gap="xs">
            <Text size="xs" c="warm-coral">💝</Text>
            <Text size="xs" c="dimmed">오늘 나눈 경험담 <strong>43개</strong></Text>
          </Group>
          <Group gap="xs">
            <Text size="xs" c="blue">🤝</Text>
            <Text size="xs" c="dimmed">도움받은 집사 <strong>89명</strong></Text>
          </Group>
        </Group>
        <Group>
          <Button 
            size="lg"
            onClick={() => setCurrentPage('community')}
            style={{ 
              background: 'linear-gradient(135deg, #f17258 0%, #facc15 100%)',
              border: 'none',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: 'scale(1)',
              boxShadow: '0 4px 15px rgba(241, 114, 88, 0.3)',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(241, 114, 88, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1) translateY(0px)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(241, 114, 88, 0.3)';
            }}
          >
            🤗 집사 선배들과 이야기하기
          </Button>
        </Group>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Image 
          radius="xl" 
          src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?q=80&w=600&auto=format&fit=crop" 
          alt="귀여운 애완동물들이 함께 있는 모습"
          style={{ 
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            objectFit: 'cover'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.02)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(241, 114, 88, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
      </Grid.Col>
    </Grid>

    {/* 집사들의 핵심 가치 */}
    <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md" mt="lg">
      <Card 
        withBorder 
        radius="lg" 
        p="md" 
        style={{ 
          textAlign: 'center', 
          backgroundColor: '#fef9f3',
          cursor: 'pointer',
          transition: 'transform 0.2s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0px)'}
      >
        <Text size="1.5rem" mb="xs">💬</Text>
        <Text fw={600} size="sm" mb="xs">실전 경험담</Text>
        <Text size="xs" c="dimmed">"저희 집 멍멍이도 그랬어요"</Text>
        <Text size="xs" c="blue" mt="xs">경험담 더 보기</Text>
      </Card>
      <Card 
        withBorder 
        radius="lg" 
        p="md" 
        style={{ 
          textAlign: 'center', 
          backgroundColor: '#f0f9ff',
          cursor: 'pointer',
          transition: 'transform 0.2s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0px)'}
      >
        <Text size="1.5rem" mb="xs">📚</Text>
        <Text fw={600} size="sm" mb="xs">집사 꿀팁</Text>
        <Text size="xs" c="dimmed">"3년 키우면서 깨달은 것들"</Text>
        <Text size="xs" c="blue" mt="xs">꿀팁 모아보기</Text>
      </Card>
      <Card 
        withBorder 
        radius="lg" 
        p="md" 
        style={{ 
          textAlign: 'center', 
          backgroundColor: '#f0fdf4',
          cursor: 'pointer',
          transition: 'transform 0.2s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0px)'}
      >
        <Text size="1.5rem" mb="xs">🤝</Text>
        <Text fw={600} size="sm" mb="xs">따뜻한 소통</Text>
        <Text size="xs" c="dimmed">"혼자 고민하지 마세요"</Text>
        <Text size="xs" c="blue" mt="xs">함께 이야기하기</Text>
      </Card>
    </SimpleGrid>
    </Box>
  );
}

function RecentPosts({ setCurrentPage }: { setCurrentPage: (page: 'home' | 'knowledge' | 'community' | 'mypage') => void }) {
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


  
  return (
    <Box 
      my={20}
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0px)' : 'translateY(20px)',
        transition: 'all 0.6s ease-out'
      }}
    >
      <Group justify="space-between" mb="md">
        <Title order={2}>집사들의 따뜻한 이야기 🌟</Title>
        <Text size="sm" c="dimmed">지금 나누고 있는 경험들</Text>
      </Group>
      
      {loading ? (
        <Center py="xl">
          <Stack align="center" gap="md">
            <Loader size="lg" />
            <Text c="dimmed">집사들의 따뜻한 이야기를 불러오는 중...</Text>
          </Stack>
        </Center>
      ) : posts.length === 0 ? (
        <EmptyState
          illustration="posts"
          title="아직 이야기가 없어요!"
          description="우리 애기들의 첫 번째 이야기를 기다리고 있어요. 따뜻한 소통의 시작이 되어주세요! 💕"
          actionText="🤗 집사들과 이야기 나누기"
          onAction={() => setCurrentPage('community')}
          size="md"
        />
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }}>
          {posts.map((post) => (
            <Card 
              key={post.id}
              withBorder 
              {...cardHoverProps}
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

interface HomePageProps {
  setCurrentPage: (page: 'home' | 'knowledge' | 'community' | 'mypage') => void;
}

export function HomePage({ setCurrentPage }: HomePageProps) {
  const [showOnboarding, setShowOnboarding] = useState(false);

  // 첫 방문자 감지
  useEffect(() => {
    const hasVisited = localStorage.getItem('petit-has-visited');
    if (!hasVisited) {
      // 페이지 로드 후 1.5초 뒤에 온보딩 모달 표시
      const timer = setTimeout(() => {
        setShowOnboarding(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('petit-has-visited', 'true');
    setShowOnboarding(false);
  };

  const handleOnboardingClose = () => {
    localStorage.setItem('petit-has-visited', 'true');
    setShowOnboarding(false);
  };

  return (
    <>
      <WelcomeSection setCurrentPage={setCurrentPage} />
      <RecentPosts setCurrentPage={setCurrentPage} />
      
      <OnboardingModal
        opened={showOnboarding}
        onClose={handleOnboardingClose}
        onComplete={handleOnboardingComplete}
      />
    </>
  );
} 
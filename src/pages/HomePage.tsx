import { Title, Text, Button, Group, Box, Grid, Image, Card, SimpleGrid, Divider, Loader, Center, Stack } from '@mantine/core';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useState, useEffect } from 'react';
import { getPosts } from '../services/postService';
import type { CommunityPost } from '../types';
import { formatTimeAgo, cardHoverProps } from '../lib/utils';
import { EmptyState } from '../components/EmptyState';
import { OnboardingModal } from '../components/OnboardingModal';

function WelcomeSection() {
  const { ref, isVisible } = useScrollAnimation();
  
  return (
    <>
      <Grid 
        align="center" 
        gutter={30}
        ref={ref}
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0px)' : 'translateY(30px)',
          transition: 'all 0.8s ease-out',
          minHeight: '60vh' // 높이 축소
        }}
      >
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Title order={1} fz={{ base: '2rem', md: '2.8rem' }} lh={1.2} fw={800}>
          초보 집사를 위한<br/>전문 케어 플랫폼
        </Title>
        <Text c="dimmed" mt="md" mb="lg" fz="md">
          실시간 소통 • 전문가 가이드 • 스마트 검색<br/>
          우리 애기 케어의 모든 것! 🐾
        </Text>
        <Group>
          <Button 
            size="lg" 
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
            🚀 집사 라운지 바로가기
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

    {/* 첫 화면에 핵심 기능 미리보기 */}
    <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg" mt="xl">
      <Card withBorder radius="lg" p="lg" style={{ textAlign: 'center' }}>
        <Text size="2rem" mb="sm">💬</Text>
        <Text fw={600} mb="xs">실시간 소통</Text>
        <Text size="sm" c="dimmed">집사들과 경험 공유</Text>
      </Card>
      <Card withBorder radius="lg" p="lg" style={{ textAlign: 'center' }}>
        <Text size="2rem" mb="sm">📚</Text>
        <Text fw={600} mb="xs">전문가 가이드</Text>
        <Text size="sm" c="dimmed">수의사 검증 정보</Text>
      </Card>
      <Card withBorder radius="lg" p="lg" style={{ textAlign: 'center' }}>
        <Text size="2rem" mb="sm">🔍</Text>
        <Text fw={600} mb="xs">스마트 검색</Text>
        <Text size="sm" c="dimmed">Ctrl+K로 빠른 검색</Text>
      </Card>
    </SimpleGrid>
    </>
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


  
  return (
    <Box 
      my={40}
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0px)' : 'translateY(30px)',
        transition: 'all 0.8s ease-out 0.1s'
      }}
    >
      <Divider my="md" labelPosition="center" label={<Title order={2}>최신 커뮤니티 소식 💬</Title>} />
      
      {loading ? (
        <Center py="xl">
          <Stack align="center" gap="md">
            <Loader size="lg" />
            <Text c="dimmed">최신 소식을 불러오는 중...</Text>
          </Stack>
        </Center>
      ) : posts.length === 0 ? (
        <EmptyState
          illustration="posts"
          title="아직 이야기가 없어요!"
          description="우리 애기들의 첫 번째 이야기를 기다리고 있어요. 따뜻한 소통의 시작이 되어주세요! 💕"
          actionText="🚀 집사 라운지 구경가기"
          onAction={() => {
            // TODO: 커뮤니티 페이지로 이동
            console.log('커뮤니티로 이동');
          }}
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

export function HomePage() {
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
      <WelcomeSection />
      <RecentPosts />
      
      <OnboardingModal
        opened={showOnboarding}
        onClose={handleOnboardingClose}
        onComplete={handleOnboardingComplete}
      />
    </>
  );
} 
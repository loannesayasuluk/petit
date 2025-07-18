import { Container, Grid, Card, Text, Button, Group, Box, Title, Stack, Badge, Tabs, SimpleGrid, Loader, Center } from '@mantine/core';
import { IconEdit, IconHeart, IconMessage, IconEye, IconSettings, IconPhoto, IconPencil } from '@tabler/icons-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getPosts } from '../services/postService';
import type { CommunityPost } from '../types';

const userProfile = {
  nickname: '햄찌사랑',
  avatar: '🐹',
  joinDate: '2024년 3월',
  bio: '우리 젤리(햄스터)와 함께하는 일상을 기록하고 있어요! 작은 생명체들의 소중함을 나누고 싶습니다 💕',
  stats: {
    posts: 12,
    likes: 156,
    followers: 48
  },
  pets: [
    { name: '젤리', type: '햄스터', age: '6개월', emoji: '🐹' },
    { name: '푸딩', type: '햄스터', age: '3개월', emoji: '🐹' }
  ]
};

const myPosts = [
  {
    id: 1,
    title: '우리 햄찌 젤리 자랑해요! 너무 귀엽지 않나요?',
    category: '일상',
    likes: 24,
    comments: 8,
    views: 156,
    timeAgo: '2일 전',
    image: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?q=80&w=300'
  },
  {
    id: 2,
    title: '햄스터 케이지 청소하는 꿀팁 공유해요',
    category: '꿀팁',
    likes: 31,
    comments: 12,
    views: 203,
    timeAgo: '1주 전'
  },
  {
    id: 3,
    title: '젤리가 아픈 것 같아요... 조언 부탁드려요',
    category: '건강',
    likes: 15,
    comments: 23,
    views: 134,
    timeAgo: '2주 전'
  }
];

function ProfileCard({ userProfile, userPosts }: { userProfile: any, userPosts: any[] }) {
  const totalLikes = userPosts.reduce((sum, post) => sum + post.likes, 0);
  
  if (!userProfile) {
    return (
      <Card shadow="sm" padding="xl" radius="lg" withBorder>
        <Center py="xl">
          <Text c="dimmed">로그인이 필요합니다</Text>
        </Center>
      </Card>
    );
  }

  return (
    <Card shadow="sm" padding="xl" radius="lg" withBorder>
      <Group gap="lg" align="flex-start">
        <Box ta="center">
          <Text size="4rem" mb="xs">{userProfile.avatar || '👤'}</Text>
          <Button variant="light" size="xs" leftSection={<IconEdit size="0.8rem" />}>
            사진 변경
          </Button>
        </Box>
        
        <Box style={{ flex: 1 }}>
          <Group justify="space-between" mb="md">
            <Title order={2}>{userProfile.nickname || '사용자'}</Title>
            <Button variant="outline" leftSection={<IconSettings size="1rem" />}>
              프로필 편집
            </Button>
          </Group>
          
          <Text c="dimmed" mb="md">{userProfile.bio || '아직 소개가 없습니다.'}</Text>
          
          <Group gap="xl" mb="md">
            <Stack gap={2} align="center">
              <Text fw={700} size="lg">{userPosts.length}</Text>
              <Text size="sm" c="dimmed">게시글</Text>
            </Stack>
            <Stack gap={2} align="center">
              <Text fw={700} size="lg">{totalLikes}</Text>
              <Text size="sm" c="dimmed">받은 좋아요</Text>
            </Stack>
            <Stack gap={2} align="center">
              <Text fw={700} size="lg">0</Text>
              <Text size="sm" c="dimmed">팔로워</Text>
            </Stack>
          </Group>
          
          <Text size="sm" c="dimmed">
            프티 가족이 된 날: {userProfile.createdAt ? new Date(userProfile.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' }) : '정보 없음'}
          </Text>
        </Box>
      </Group>
    </Card>
  );
}

function PetsCard() {
  return (
    <Card shadow="sm" padding="lg" radius="lg" withBorder>
      <Group justify="space-between" mb="md">
        <Title order={3}>우리 애기들 👨‍👩‍👧‍👦</Title>
        <Button variant="light" size="sm" leftSection={<IconPhoto size="0.9rem" />}>
          애기 추가
        </Button>
      </Group>
      
      <SimpleGrid cols={2} spacing="sm">
        {userProfile.pets.map((pet, index) => (
          <Box key={index} p="sm" style={{ backgroundColor: 'var(--mantine-color-gray-0)', borderRadius: 'var(--mantine-radius-sm)' }}>
            <Group gap="sm">
              <Text size="2rem">{pet.emoji}</Text>
              <Box>
                <Text fw={600}>{pet.name}</Text>
                <Text size="sm" c="dimmed">{pet.type} • {pet.age}</Text>
              </Box>
            </Group>
          </Box>
        ))}
      </SimpleGrid>
    </Card>
  );
}

function PostCard({ post }: { post: typeof myPosts[0] }) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case '건강': return 'red';
      case '꿀팁': return 'green';
      default: return 'warm-coral';
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="lg" withBorder>
      {post.image && (
        <Card.Section>
          <img src={post.image} alt={post.title} style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
        </Card.Section>
      )}
      
      <Group justify="space-between" mt="md" mb="xs">
        <Badge color={getCategoryColor(post.category)} variant="light">
          {post.category}
        </Badge>
        <Text size="xs" c="dimmed">{post.timeAgo}</Text>
      </Group>

      <Title order={4} mb="md" lineClamp={2}>
        {post.title}
      </Title>

      <Group justify="space-between">
        <Group gap="lg">
          <Group gap="xs">
            <IconHeart size={16} color="#ff6b6b" />
            <Text size="xs">{post.likes}</Text>
          </Group>
          <Group gap="xs">
            <IconMessage size={16} color="#4c6ef5" />
            <Text size="xs">{post.comments}</Text>
          </Group>
          <Group gap="xs">
            <IconEye size={16} color="#868e96" />
            <Text size="xs">{post.views}</Text>
          </Group>
        </Group>
        
        <Button variant="light" size="xs">
          수정
        </Button>
      </Group>
    </Card>
  );
}

export function MyPage() {
  const { ref, isVisible } = useScrollAnimation();
  const { currentUser, userProfile } = useAuth();
  const [userPosts, setUserPosts] = useState<typeof myPosts>([]);
  const [loading, setLoading] = useState(true);

  // 정적 데이터와 호환성을 위한 변환 함수
  const convertToStaticFormat = (posts: CommunityPost[]) => {
    return posts.map(post => ({
      id: post.id.length > 10 ? 1 : Number(post.id.slice(-1)) || 1, // Firebase ID를 숫자로 변환
      title: post.title,
      category: post.category,
      likes: post.likes.length,
      comments: 0, // TODO: 실제 댓글 수 가져오기
      views: post.viewCount,
      timeAgo: formatTimeAgo(post.createdAt),
      image: post.imageUrls?.[0]
    }));
  };

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return '방금 전';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}일 전`;
    return `${Math.floor(diffInSeconds / 2592000)}개월 전`;
  };

  useEffect(() => {
    const loadMyPosts = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        let userPostsData: typeof myPosts = [];
        let useFirebaseData = false;

        // Firebase에서 사용자 게시물 로딩 우선 시도
        try {
          // TODO: 사용자별 게시물 조회 함수 구현 필요
          // const result = await getPostsByUser(currentUser.uid);
          
          // 임시로 모든 게시물에서 현재 사용자 게시물 필터링
          const result = await getPosts(50);
          const filteredPosts = result.posts.filter(post => post.author.uid === currentUser.uid);
          
          if (filteredPosts.length > 0) {
            useFirebaseData = true;
            userPostsData = convertToStaticFormat(filteredPosts);
          }
        } catch (error) {
          console.log('Firebase에서 사용자 게시물 로딩 실패:', error);
        }

        // Firebase 데이터가 없는 경우 (실제 사용자이므로 빈 배열)
        if (!useFirebaseData) {
          console.log('🔄 사용자 게시물이 없습니다.');
          userPostsData = [];
        }

        setUserPosts(userPostsData);
      } catch (error) {
        console.error('내 게시물 로딩 오류:', error);
        setUserPosts([]);
      } finally {
        setLoading(false);
      }
    };

    loadMyPosts();
  }, [currentUser]);

  return (
    <Container size="lg" py="xl">
      {/* 헤더 */}
      <Box ta="center" mb="xl">
        <Title order={1} size="3rem" fw={800} mb="md">
          마이페이지 👤
        </Title>
        <Text size="lg" c="dimmed">
          나의 프티 활동을 확인하고 관리해보세요
        </Text>
      </Box>

      <Grid gutter="xl">
        {/* 왼쪽 컬럼 */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Stack gap="lg">
            <ProfileCard userProfile={userProfile} userPosts={userPosts} />
            <PetsCard />
          </Stack>
        </Grid.Col>

        {/* 오른쪽 컬럼 */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Box
            ref={ref}
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0px)' : 'translateY(30px)',
              transition: 'all 0.8s ease-out'
            }}
          >
            <Tabs defaultValue="posts">
              <Tabs.List>
                <Tabs.Tab value="posts" leftSection={<IconPencil size="0.9rem" />}>
                  내 게시글 ({userPosts.length})
                </Tabs.Tab>
                <Tabs.Tab value="likes" leftSection={<IconHeart size="0.9rem" />}>
                  좋아요한 글
                </Tabs.Tab>
                <Tabs.Tab value="bookmarks" leftSection={<IconPhoto size="0.9rem" />}>
                  북마크
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="posts" pt="lg">
                {loading ? (
                  <Center py="xl">
                    <Stack align="center" gap="md">
                      <Loader size="lg" />
                      <Text c="dimmed">게시물을 불러오는 중...</Text>
                    </Stack>
                  </Center>
                ) : userPosts.length === 0 ? (
                  <Center py="xl">
                    <Stack align="center" gap="md">
                      <Text size="lg" c="dimmed">
                        아직 작성한 게시물이 없습니다
                      </Text>
                      <Text size="sm" c="dimmed">
                        첫 번째 이야기를 들려주세요!
                      </Text>
                    </Stack>
                  </Center>
                ) : (
                  <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                    {userPosts.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </SimpleGrid>
                )}
              </Tabs.Panel>

              <Tabs.Panel value="likes" pt="lg">
                <Text c="dimmed" ta="center" py="xl">
                  좋아요한 글이 없습니다 💔<br />
                  마음에 드는 글에 좋아요를 눌러보세요!
                </Text>
              </Tabs.Panel>

              <Tabs.Panel value="bookmarks" pt="lg">
                <Text c="dimmed" ta="center" py="xl">
                  북마크한 글이 없습니다 📖<br />
                  나중에 다시 보고 싶은 글을 북마크해보세요!
                </Text>
              </Tabs.Panel>
            </Tabs>
          </Box>
        </Grid.Col>
      </Grid>
    </Container>
  );
} 
import { 
  Title, 
  Text, 
  Card, 
  Group, 
  Box, 
  Container, 
  Badge, 
  Button, 
  Divider, 
  Stack, 
  Image, 
  Grid, 
  Center,
  Loader,
  Alert,
  ActionIcon
} from '@mantine/core';
import { 
  IconHeart, 
  IconMessage, 
  IconEye, 
  IconPencil, 
  IconHeartFilled,
  IconAlertCircle,
  IconHome,
  IconStethoscope,
  IconHammer,
  IconBulb,
  IconUrgent,
  IconVideo,
  IconCategory
} from '@tabler/icons-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { getPosts, toggleLike, subscribeToPosts } from '../services/postService';
import { getCommentCount } from '../services/commentService';
import { PostWriteModal } from '../components/PostWriteModal';
import { CommentSection } from '../components/CommentSection';
import type { CommunityPost } from '../types';
import { POST_CATEGORIES } from '../types';

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return '방금 전';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
  return `${Math.floor(diffInSeconds / 86400)}일 전`;
}

function getCategoryColor(category: string) {
  switch (category) {
    case '건강': return 'red';
    case '응급': return 'orange';
    case 'DIY': return 'blue';
    case '꿀팁': return 'green';
    case '영상': return 'purple';
    default: return 'warm-coral';
  }
}

function getCategoryIcon(category: string) {
  switch (category) {
    case '일상': return IconHome;
    case '건강': return IconStethoscope;
    case 'DIY': return IconHammer;
    case '꿀팁': return IconBulb;
    case '응급': return IconUrgent;
    case '영상': return IconVideo;
    default: return IconCategory;
  }
}

interface PostCardProps {
  post: CommunityPost;
  onLike: (postId: string) => void;
  currentUserId?: string;
  commentCount?: number;
}

function PostCard({ post, onLike, currentUserId, commentCount = 0 }: PostCardProps) {
  const isLiked = currentUserId ? post.likes.includes(currentUserId) : false;
  const [showComments, setShowComments] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (likeLoading) return; // 더블 클릭 방지
    
    setLikeLoading(true);
    try {
      await onLike(post.id);
    } finally {
      // 시각적 피드백을 위해 약간의 딜레이
      setTimeout(() => setLikeLoading(false), 300);
    }
  };

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="lg"
      withBorder
      style={{
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        transform: 'translateY(0px)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = 'var(--mantine-shadow-lg)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0px)';
        e.currentTarget.style.boxShadow = 'var(--mantine-shadow-sm)';
      }}
    >
      <Group justify="space-between" mb="xs">
        <Badge color={getCategoryColor(post.category)} variant="light">
          {post.category}
        </Badge>
        <Text size="xs" c="dimmed">
          {formatTimeAgo(post.createdAt)}
        </Text>
      </Group>

      <Title order={4} mb="sm" lineClamp={2}>
        {post.title}
      </Title>

      <Text size="sm" c="dimmed" mb="md" lineClamp={2}>
        {post.content}
      </Text>

      {/* 이미지 미리보기 */}
      {post.imageUrls && post.imageUrls.length > 0 && (
        <Box mb="md">
          <Grid gutter="xs">
            {post.imageUrls.slice(0, 3).map((url, index) => (
              <Grid.Col key={index} span={post.imageUrls!.length === 1 ? 12 : 4}>
                <Image
                  src={url}
                  alt={`post-image-${index}`}
                  h={80}
                  radius="md"
                  style={{ objectFit: 'cover' }}
                />
              </Grid.Col>
            ))}
            {post.imageUrls.length > 3 && (
              <Grid.Col span={4}>
                <Box
                  h={80}
                  bg="gray.2"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 'var(--mantine-radius-md)'
                  }}
                >
                  <Text size="sm" c="dimmed">
                    +{post.imageUrls.length - 3}
                  </Text>
                </Box>
              </Grid.Col>
            )}
          </Grid>
        </Box>
      )}

      <Group justify="space-between">
        <Group gap="xs">
          <Text size="xs" fw={600}>
            {post.author.avatar || '👤'} {post.author.nickname}
          </Text>
        </Group>

        <Group gap="lg">
          <Group gap="xs">
            <ActionIcon
              variant="subtle"
              color={isLiked ? 'red' : 'gray'}
              onClick={handleLikeClick}
              loading={likeLoading}
              style={{
                transform: isLiked ? 'scale(1.1)' : 'scale(1)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!likeLoading) {
                  e.currentTarget.style.transform = 'scale(1.2)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = isLiked ? 'scale(1.1)' : 'scale(1)';
              }}
            >
              {isLiked ? (
                <IconHeartFilled 
                  size={16} 
                  style={{ 
                    animation: isLiked ? 'heartBeat 0.6s ease-in-out' : undefined 
                  }} 
                />
              ) : (
                <IconHeart size={16} />
              )}
            </ActionIcon>
            <Text 
              size="xs" 
              fw={isLiked ? 600 : 400}
              c={isLiked ? 'red' : undefined}
              style={{
                transition: 'all 0.2s ease',
              }}
            >
              {post.likes.length}
            </Text>
          </Group>
          <Group 
            gap="xs" 
            style={{ cursor: 'pointer' }}
            onClick={(e) => {
              e.stopPropagation();
              setShowComments(!showComments);
            }}
          >
            <IconMessage size={16} color="#4c6ef5" />
            <Text size="xs">{commentCount}</Text>
          </Group>
          <Group gap="xs">
            <IconEye size={16} color="#868e96" />
            <Text size="xs">{post.viewCount}</Text>
          </Group>
        </Group>
      </Group>

      {/* 댓글 섹션 */}
      {showComments && (
        <Box mt="md" pt="md" style={{ borderTop: '1px solid var(--mantine-color-gray-3)' }}>
          <CommentSection postId={post.id} />
        </Box>
      )}
    </Card>
  );
}

export function CommunityPage() {
  const { ref, isVisible } = useScrollAnimation();
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [writeModalOpened, setWriteModalOpened] = useState(false);
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});

  // 카테고리별 게시물 수 계산
  const calculateCategoryCounts = (allPosts: CommunityPost[]) => {
    const counts: Record<string, number> = { '전체': allPosts.length };
    
    POST_CATEGORIES.forEach(category => {
      counts[category] = allPosts.filter(post => post.category === category).length;
    });
    
    return counts;
  };

  // 실시간 데이터 구독
  useEffect(() => {
    setLoading(true);
    
    // 실시간 게시물 구독
    const unsubscribePosts = subscribeToPosts(
      async (posts) => {
        setPosts(posts);
        
        if (posts.length > 0) {
          // 카테고리 카운트 계산 (전체 데이터로)
          try {
            const allPostsResult = await getPosts(100);
            setCategoryCounts(calculateCategoryCounts(allPostsResult.posts));
          } catch (error) {
            console.warn('카테고리 카운트 계산 실패:', error);
            setCategoryCounts(calculateCategoryCounts(posts));
          }

          // 댓글 수 로딩
          try {
            const commentCountPromises = posts.map(async (post) => {
              const count = await getCommentCount(post.id);
              return { postId: post.id, count };
            });

            const commentCountResults = await Promise.all(commentCountPromises);
            const newCommentCounts: Record<string, number> = {};
            commentCountResults.forEach(({ postId, count }) => {
              newCommentCounts[postId] = count;
            });
            setCommentCounts(newCommentCounts);
          } catch (error) {
            console.warn('댓글 수 로딩 실패:', error);
          }
        } else {
          // 데이터가 없는 경우
          setCategoryCounts({ '전체': 0, '일상': 0, '건강': 0, 'DIY': 0, '꿀팁': 0, '응급': 0, '영상': 0, '기타': 0 });
          setCommentCounts({});
        }
        
        setLoading(false);
        setError('');
      },
      selectedCategory === '전체' ? undefined : selectedCategory,
      20 // 더 많은 게시물 로딩
    );

    return () => {
      unsubscribePosts();
    };
  }, [selectedCategory]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    // 실시간 구독이 useEffect에서 처리되므로 별도 로딩 불필요
  };

  const handleLike = async (postId: string) => {
    if (!currentUser) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      // Firebase 데이터만 처리 (로컬 데이터 분기 제거)
      await toggleLike(postId, currentUser.uid);
      
      // 로컬 상태 즉시 업데이트 (UX 향상)
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          const isLiked = post.likes.includes(currentUser.uid);
          return {
            ...post,
            likes: isLiked 
              ? post.likes.filter(uid => uid !== currentUser.uid)
              : [...post.likes, currentUser.uid]
          };
        }
        return post;
      }));
    } catch (error) {
      console.error('좋아요 오류:', error);
      alert(`좋아요 처리 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  };

  const handlePostSuccess = () => {
    setWriteModalOpened(false);
    // 실시간 구독으로 자동 업데이트되므로 별도 새로고침 불필요
  };

  const renderCategoryButton = (category: string) => {
    const IconComponent = category === '전체' ? IconCategory : getCategoryIcon(category);
    const isSelected = category === selectedCategory;
    const count = categoryCounts[category] || 0;

    return (
      <Button
        key={category}
        variant={isSelected ? 'filled' : 'light'}
        size="sm"
        radius="xl"
        leftSection={<IconComponent size="1rem" />}
        rightSection={
          <Badge 
            size="xs" 
            variant={isSelected ? 'light' : 'outline'}
            color={isSelected ? 'white' : getCategoryColor(category)}
          >
            {count}
          </Badge>
        }
        onClick={() => handleCategoryChange(category)}
        style={{
          transition: 'all 0.2s ease',
          transform: isSelected ? 'scale(1.05)' : 'scale(1)',
        }}
        onMouseEnter={(e) => {
          if (!isSelected) {
            e.currentTarget.style.transform = 'scale(1.05)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = isSelected ? 'scale(1.05)' : 'scale(1)';
        }}
      >
        {category}
      </Button>
    );
  };

  return (
    <Container size="lg" py="xl">
      {/* 헤더 섹션 */}
      <Box ta="center" mb="xl">
        <Title order={1} size="3rem" fw={800} mb="md">
          커뮤니티 💬
        </Title>
        <Text size="lg" c="dimmed" maw={600} mx="auto">
          우리 애기들의 일상과 고민을 함께 나누는<br />
          따뜻한 소통 공간입니다
        </Text>
      </Box>

      {/* 카테고리 필터 & 글쓰기 버튼 */}
      <Group justify="space-between" mb="xl">
        <Group gap="sm">
          {['전체', ...POST_CATEGORIES].map((category) => (
            renderCategoryButton(category))
          )}
        </Group>
        {currentUser && (
          <Button 
            leftSection={<IconPencil size="1rem" />}
            onClick={() => setWriteModalOpened(true)}
          >
            새 글쓰기
          </Button>
        )}
      </Group>

      <Divider mb="xl" />

      {/* 오류 메시지 */}
      {error && (
        <Alert icon={<IconAlertCircle size="1rem" />} color="red" mb="xl">
          {error}
        </Alert>
      )}

      {/* 게시글 목록 */}
      <Box
        ref={ref}
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0px)' : 'translateY(30px)',
          transition: 'all 0.8s ease-out'
        }}
      >
        {loading && posts.length === 0 ? (
          <Center py="xl">
            <Stack align="center" gap="md">
              <Loader size="lg" />
              <Text c="dimmed">게시물을 불러오는 중...</Text>
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
              {currentUser && (
                <Button 
                  leftSection={<IconPencil size="1rem" />}
                  onClick={() => setWriteModalOpened(true)}
                >
                  글쓰기
                </Button>
              )}
            </Stack>
          </Center>
        ) : (
          <Stack gap="md">
            {posts.map((post) => (
              <PostCard 
                key={post.id} 
                post={post} 
                onLike={handleLike}
                currentUserId={currentUser?.uid}
                commentCount={commentCounts[post.id] || 0}
              />
            ))}
            
            {/* 실시간 구독으로 더 보기 버튼 불필요 */}
            {loading && (
              <Center py="xl">
                <Loader size="md" />
              </Center>
            )}
          </Stack>
        )}
      </Box>

      {/* 안내 메시지 */}
      {posts.length > 0 && (
        <Box mt={80} ta="center">
          <Title order={2} mb="md">
            더 많은 이야기를 들려주세요! ✍️
          </Title>
          <Text c="dimmed" mb="lg">
            우리 애기들의 재미있는 이야기나 궁금한 점이 있다면<br />
            언제든지 글을 올려주세요
          </Text>
          <Group justify="center" gap="md">
            <Badge size="lg" variant="outline" color="warm-coral">
              실시간 답변
            </Badge>
            <Badge size="lg" variant="outline" color="green">
              전문가 인증
            </Badge>
            <Badge size="lg" variant="outline" color="blue">
              따뜻한 소통
            </Badge>
          </Group>
        </Box>
      )}

      {/* 글쓰기 모달 */}
      <PostWriteModal
        opened={writeModalOpened}
        onClose={() => setWriteModalOpened(false)}
        onSuccess={handlePostSuccess}
      />
    </Container>
  );
} 
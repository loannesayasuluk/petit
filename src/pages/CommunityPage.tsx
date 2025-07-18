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
import { formatTimeAgo, getCategoryColor, cardHoverProps, likeButtonProps } from '../lib/utils';
import { EmptyState } from '../components/EmptyState';
import { TrendingSidebar } from '../components/TrendingSidebar';



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
      {...cardHoverProps}
    >
      <Group justify="space-between" mb="md">
        <Badge 
          color={getCategoryColor(post.category)} 
          variant="light"
          className="card-category"
        >
          {post.category}
        </Badge>
        <Text className="card-meta-small">
          {formatTimeAgo(post.createdAt)}
        </Text>
      </Group>

      <Title order={4} className="card-title" lineClamp={2}>
        {post.title}
      </Title>

      <Text className="card-content" lineClamp={3}>
        {post.content}
      </Text>

      <Text className="card-meta">
        작성자: {post.author.avatar} {post.author.nickname}
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

      {/* 통계 섹션 */}
      <Group justify="space-between" className="card-stats">
        <Group gap="lg">
          <Group gap="xs" className="card-stats-item">
            <ActionIcon
              {...likeButtonProps(isLiked, likeLoading)}
              onClick={handleLikeClick}
              size="sm"
            >
              {isLiked ? (
                <IconHeartFilled 
                  size={14} 
                  style={{ 
                    animation: isLiked ? 'heartBeat 0.6s ease-in-out' : undefined 
                  }} 
                />
              ) : (
                <IconHeart size={14} />
              )}
            </ActionIcon>
            <Text 
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
            className="card-stats-item"
            style={{ cursor: 'pointer' }}
            onClick={(e) => {
              e.stopPropagation();
              setShowComments(!showComments);
            }}
          >
            <IconMessage size={14} />
            <Text>{commentCount}</Text>
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
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
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
      20, // 더 많은 게시물 로딩
      selectedTag || undefined // 태그 필터 추가
    );

    return () => {
      unsubscribePosts();
    };
  }, [selectedCategory, selectedTag]);

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
        className={`category-button ${isSelected ? 'selected' : ''}`}
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
          집사 소통 라운지 💬
        </Title>
        <Text size="lg" c="dimmed" maw={600} mx="auto">
          초보부터 베테랑까지! 실전 경험담과<br />
          케어 팁을 나누는 집사들의 소통 공간
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
            className="floating-button"
          >
            ✍️ 새 글쓰기
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

      {/* 메인 콘텐츠: 2단 그리드 */}
      <Grid>
        {/* 게시글 목록 - 2/3 */}
        <Grid.Col span={{ base: 12, md: 8 }}>
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
              <EmptyState
                illustration="posts"
                title="아직 이야기가 시작되지 않았어요!"
                description={
                  selectedCategory === '전체' 
                    ? "집사들의 첫 번째 이야기를 기다리고 있어요. 우리 애기들의 소중한 순간을 나누어 주세요! 🐾✨"
                    : `${selectedCategory} 관련 이야기가 아직 없어요. 첫 번째 이야기의 주인공이 되어보세요!`
                }
                actionText={currentUser ? "✍️ 첫 이야기 쓰기" : "🚀 로그인하고 글쓰기"}
                onAction={() => {
                  if (currentUser) {
                    setWriteModalOpened(true);
                  } else {
                    // TODO: 로그인 모달 열기
                    console.log('로그인 필요');
                  }
                }}
                size="md"
              />
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
        </Grid.Col>

        {/* 사이드바 - 1/3 */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <TrendingSidebar onTagClick={(tagName) => {
            setSelectedTag(tagName);
            setSelectedCategory('전체'); // 태그 선택 시 카테고리 초기화
          }} />
          
          {/* 현재 필터 표시 */}
          {selectedTag && (
            <Group mt="md" gap="xs">
              <Text size="sm" c="dimmed">필터:</Text>
              <Badge 
                variant="filled" 
                color="warm-coral"
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedTag(null)}
              >
                #{selectedTag} ✕
              </Badge>
            </Group>
          )}
        </Grid.Col>
      </Grid>

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
          <Group justify="center" gap="md" mb="lg">
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
          <Group justify="center" gap="md">
            {currentUser ? (
              <Button 
                variant="outline" 
                size="md"
                onClick={() => setWriteModalOpened(true)}
              >
                ✍️ 새 이야기 쓰기
              </Button>
            ) : (
              <Button variant="outline" size="md">
                🚀 로그인하고 글쓰기
              </Button>
            )}
            <Button variant="default" size="md">
              📚 전문가 가이드 보기
            </Button>
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
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
  IconAlertCircle 
} from '@tabler/icons-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { getPosts, toggleLike } from '../services/postService';
import { getCommentCount } from '../services/commentService';
import { PostWriteModal } from '../components/PostWriteModal';
import { CommentSection } from '../components/CommentSection';
import type { CommunityPost } from '../types';
import { POST_CATEGORIES } from '../types';
import { samplePosts } from '../data/sampleData';

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

interface PostCardProps {
  post: CommunityPost;
  onLike: (postId: string) => void;
  currentUserId?: string;
  commentCount?: number;
}

function PostCard({ post, onLike, currentUserId, commentCount = 0 }: PostCardProps) {
  const isLiked = currentUserId ? post.likes.includes(currentUserId) : false;
  const [showComments, setShowComments] = useState(false);

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
              onClick={(e) => {
                e.stopPropagation();
                onLike(post.id);
              }}
            >
              {isLiked ? (
                <IconHeartFilled size={16} />
              ) : (
                <IconHeart size={16} />
              )}
            </ActionIcon>
            <Text size="xs">{post.likes.length}</Text>
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
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});

  const loadPosts = async (category: string = '전체', isInitial: boolean = true) => {
    try {
      setLoading(true);
      setError('');

      let allPosts: CommunityPost[] = [];
      let useFirebaseData = false;

      // Firebase에서 실제 데이터 로딩 우선 시도
      try {
        const result = await getPosts(
          10, 
          isInitial ? undefined : lastDoc, 
          category === '전체' ? undefined : category
        );
        allPosts = result.posts;
        
        if (allPosts.length > 0) {
          // Firebase에서 데이터를 성공적으로 가져온 경우
          useFirebaseData = true;
          setLastDoc(result.lastDoc);
          setHasMore(result.posts.length === 10);

          if (isInitial) {
            setPosts(allPosts);
          } else {
            setPosts(prev => [...prev, ...allPosts]);
          }

          // 댓글 수 로딩
          const commentCountPromises = allPosts.map(async (post) => {
            const count = await getCommentCount(post.id);
            return { postId: post.id, count };
          });

          const commentCountResults = await Promise.all(commentCountPromises);
          const newCommentCounts: Record<string, number> = {};
          commentCountResults.forEach(({ postId, count }) => {
            newCommentCounts[postId] = count;
          });

          if (isInitial) {
            setCommentCounts(newCommentCounts);
          } else {
            setCommentCounts(prev => ({ ...prev, ...newCommentCounts }));
          }
        }
      } catch (firestoreError) {
        console.log('Firestore 연결 실패, 로컬 데이터 사용:', firestoreError);
      }

      // Firebase 데이터가 없거나 실패한 경우 로컬 데이터 fallback
      if (!useFirebaseData) {
        console.log('🔄 Firebase 데이터가 없어서 로컬 데이터를 표시합니다. window.uploadSampleData()를 실행하세요.');
        
        const filteredSamplePosts = category === '전체' 
          ? samplePosts 
          : samplePosts.filter(post => post.category === category);
        
        allPosts = filteredSamplePosts;
        
        if (isInitial) {
          setPosts(allPosts);
        } else {
          setPosts(prev => [...prev, ...allPosts]);
        }

        // 샘플 데이터 댓글 수 (고정값)
        const newCommentCounts: Record<string, number> = {
          'sample-post-1': 8,
          'sample-post-2': 15,
          'sample-post-3': 6,
          'sample-post-4': 12,
          'sample-post-5': 23,
          'sample-post-6': 4
        };

        if (isInitial) {
          setCommentCounts(newCommentCounts);
        } else {
          setCommentCounts(prev => ({ ...prev, ...newCommentCounts }));
        }

        setHasMore(false); // 로컬 데이터는 더보기 없음
      }
      
    } catch (err) {
      console.error('게시물 로딩 오류:', err);
      setError('게시물을 불러오는 중 오류가 발생했습니다.');
      // 에러 발생 시에도 로컬 데이터 표시
      const filteredSamplePosts = category === '전체' 
        ? samplePosts 
        : samplePosts.filter(post => post.category === category);
      setPosts(filteredSamplePosts);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setPosts([]);
    setCommentCounts({});
    setLastDoc(null);
    setHasMore(true);
    loadPosts(category, true);
  };

  const handleLike = async (postId: string) => {
    if (!currentUser) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      // 로컬 데이터인지 확인 (샘플 데이터 fallback인 경우)
      if (postId.startsWith('sample-')) {
        // 로컬 데이터는 상태만 업데이트 (Firebase 호출 없음)
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
      } else {
        // Firebase 데이터 - 실제 서버 업데이트
        await toggleLike(postId, currentUser.uid);
        
        // 로컬 상태도 즉시 업데이트 (UX 향상)
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
      }
    } catch (error) {
      console.error('좋아요 오류:', error);
      alert('좋아요 처리 중 오류가 발생했습니다.');
    }
  };

  const handlePostSuccess = () => {
    setWriteModalOpened(false);
    // 새 글이 작성되면 목록 새로고침
    loadPosts(selectedCategory, true);
  };

  useEffect(() => {
    loadPosts('전체', true);
  }, []);

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
            <Button
              key={category}
              variant={category === selectedCategory ? 'filled' : 'light'}
              size="sm"
              radius="xl"
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </Button>
          ))}
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
            
            {/* 더 보기 버튼 */}
            {hasMore && !loading && (
              <Center mt="xl">
                <Button 
                  variant="outline" 
                  onClick={() => loadPosts(selectedCategory, false)}
                >
                  더 보기
                </Button>
              </Center>
            )}
            
            {loading && posts.length > 0 && (
              <Center py="md">
                <Loader size="sm" />
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
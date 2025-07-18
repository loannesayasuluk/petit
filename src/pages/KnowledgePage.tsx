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
  Center,
  Loader,
  Alert,
  Image,
  SimpleGrid
} from '@mantine/core';
import { 
  IconHeart, 
  IconEye, 
  IconBook, 
  IconHeartFilled,
  IconAlertCircle 
} from '@tabler/icons-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { KnowledgeArticle } from '../types';
import { ARTICLE_CATEGORIES } from '../types';
import { sampleKnowledgeArticles, shouldShowSampleData } from '../data/sampleData';
import { getKnowledgeArticles, toggleKnowledgeLike } from '../services/knowledgeService';

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return '방금 전';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}일 전`;
  return `${Math.floor(diffInSeconds / 2592000)}개월 전`;
}

function getCategoryColor(category: string) {
  switch (category) {
    case '건강관리': return 'red';
    case '응급처치': return 'orange';
    case '사육법': return 'blue';
    case '용품리뷰': return 'green';
    default: return 'warm-coral';
  }
}

interface ArticleCardProps {
  article: KnowledgeArticle;
  onLike: (articleId: string) => void;
  currentUserId?: string;
}

function ArticleCard({ article, onLike, currentUserId }: ArticleCardProps) {
  const isLiked = currentUserId ? article.likes.includes(currentUserId) : false;

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="lg"
      withBorder
      style={{
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        transform: 'translateY(0px)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
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
      {/* 이미지 */}
      {article.imageUrls && article.imageUrls.length > 0 && (
        <Image
          src={article.imageUrls[0]}
          alt={article.title}
          h={160}
          radius="md"
          mb="md"
          style={{ objectFit: 'cover' }}
        />
      )}

      {/* 카테고리와 날짜 */}
      <Group justify="space-between" mb="xs">
        <Badge color={getCategoryColor(article.category)} variant="light">
          {article.category}
        </Badge>
        <Text size="xs" c="dimmed">
          {formatTimeAgo(article.createdAt)}
        </Text>
      </Group>

      {/* 제목 */}
      <Title order={4} mb="sm" lineClamp={2} style={{ flex: 1 }}>
        {article.title}
      </Title>

      {/* 내용 미리보기 */}
      <Text size="sm" c="dimmed" mb="md" lineClamp={3}>
        {article.content.replace(/#{1,6}\s/g, '').slice(0, 120)}...
      </Text>

      {/* 태그들 */}
      {article.tags && article.tags.length > 0 && (
        <Group gap="xs" mb="md">
          {article.tags.slice(0, 3).map((tag, index) => (
            <Badge 
              key={index} 
              size="xs" 
              variant="outline" 
              color="gray"
            >
              #{tag}
            </Badge>
          ))}
        </Group>
      )}

      {/* 하단 정보 */}
      <Group justify="space-between" mt="auto">
        <Group gap="xs">
          <Text size="xs" fw={600}>
            {article.author.avatar || '👤'} {article.author.nickname}
          </Text>
        </Group>

        <Group gap="lg">
          <Group gap="xs">
            <IconEye size={16} color="#868e96" />
            <Text size="xs">{article.viewCount}</Text>
          </Group>
          <Group gap="xs">
            <Box
              component="button"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              onClick={(e) => {
                e.stopPropagation();
                onLike(article.id);
              }}
            >
              {isLiked ? (
                <IconHeartFilled size={16} color="#ff6b6b" />
              ) : (
                <IconHeart size={16} color="#868e96" />
              )}
            </Box>
            <Text size="xs">{article.likes.length}</Text>
          </Group>
        </Group>
      </Group>
    </Card>
  );
}

export function KnowledgePage() {
  const { ref, isVisible } = useScrollAnimation();
  const { currentUser } = useAuth();
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');

  const loadArticles = async (category: string = '전체') => {
    try {
      setLoading(true);
      setError('');

      let allArticles: KnowledgeArticle[] = [];
      let useFirebaseData = false;

      // Firebase에서 실제 데이터 로딩 우선 시도
      try {
        const result = await getKnowledgeArticles(
          20, 
          undefined, 
          category === '전체' ? undefined : category
        );
        allArticles = result.articles;
        
        if (allArticles.length > 0) {
          // Firebase에서 데이터를 성공적으로 가져온 경우
          useFirebaseData = true;
          setArticles(allArticles);
        }
      } catch (firestoreError) {
        console.log('Firestore 연결 실패, 로컬 데이터 사용:', firestoreError);
      }

      // Firebase 데이터가 없거나 실패한 경우 로컬 데이터 fallback
      if (!useFirebaseData) {
        console.log('🔄 Firebase 데이터가 없어서 로컬 데이터를 표시합니다. window.uploadSampleData()를 실행하세요.');
        
        const filteredSampleArticles = category === '전체' 
          ? sampleKnowledgeArticles 
          : sampleKnowledgeArticles.filter(article => article.category === category);
        
        allArticles = filteredSampleArticles;
        setArticles(allArticles);
      }
    } catch (err) {
      console.error('지식백과 로딩 오류:', err);
      setError('지식백과를 불러오는 중 오류가 발생했습니다.');
      // 에러 발생 시에도 로컬 데이터 표시
      const filteredSampleArticles = category === '전체' 
        ? sampleKnowledgeArticles 
        : sampleKnowledgeArticles.filter(article => article.category === category);
      setArticles(filteredSampleArticles);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    loadArticles(category);
  };

  const handleLike = async (articleId: string) => {
    if (!currentUser) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      // 로컬 데이터인지 확인 (샘플 데이터 fallback인 경우)
      if (articleId.startsWith('sample-')) {
        // 로컬 데이터는 상태만 업데이트 (Firebase 호출 없음)
        setArticles(prev => prev.map(article => {
          if (article.id === articleId) {
            const isLiked = article.likes.includes(currentUser.uid);
            return {
              ...article,
              likes: isLiked 
                ? article.likes.filter(uid => uid !== currentUser.uid)
                : [...article.likes, currentUser.uid]
            };
          }
          return article;
        }));
      } else {
        // Firebase 데이터 - 실제 서버 업데이트
        await toggleKnowledgeLike(articleId, currentUser.uid);
        
        // 로컬 상태도 즉시 업데이트 (UX 향상)
        setArticles(prev => prev.map(article => {
          if (article.id === articleId) {
            const isLiked = article.likes.includes(currentUser.uid);
            return {
              ...article,
              likes: isLiked 
                ? article.likes.filter(uid => uid !== currentUser.uid)
                : [...article.likes, currentUser.uid]
            };
          }
          return article;
        }));
      }
    } catch (error) {
      console.error('좋아요 처리 오류:', error);
      alert('좋아요 처리 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    loadArticles('전체');
  }, []);

  return (
    <Container size="lg" py="xl">
      {/* 헤더 섹션 */}
      <Box ta="center" mb="xl">
        <Title order={1} size="3rem" fw={800} mb="md">
          지식백과 📚
        </Title>
        <Text size="lg" c="dimmed" maw={600} mx="auto">
          우리 애기들을 더 건강하고 행복하게 키우기 위한<br />
          전문가들이 정리한 알찬 정보들을 만나보세요
        </Text>
      </Box>

      {/* 카테고리 필터 */}
      <Group justify="center" mb="xl">
        <Group gap="sm">
          {['전체', ...ARTICLE_CATEGORIES].map((category) => (
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
      </Group>

      <Divider mb="xl" />

      {/* 오류 메시지 */}
      {error && (
        <Alert icon={<IconAlertCircle size="1rem" />} color="red" mb="xl">
          {error}
        </Alert>
      )}

      {/* 지식백과 목록 */}
      <Box
        ref={ref}
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0px)' : 'translateY(30px)',
          transition: 'all 0.8s ease-out'
        }}
      >
        {loading ? (
          <Center py="xl">
            <Stack align="center" gap="md">
              <Loader size="lg" />
              <Text c="dimmed">지식백과를 불러오는 중...</Text>
            </Stack>
          </Center>
        ) : articles.length === 0 ? (
          <Center py="xl">
            <Stack align="center" gap="md">
              <IconBook size={48} color="var(--mantine-color-gray-5)" />
              <Text size="lg" c="dimmed">
                아직 {selectedCategory === '전체' ? '' : selectedCategory + ' '} 
                지식백과가 없습니다
              </Text>
              <Text size="sm" c="dimmed">
                전문가들의 유용한 정보를 기다려주세요!
              </Text>
            </Stack>
          </Center>
        ) : (
          <SimpleGrid 
            cols={{ base: 1, sm: 2, md: 3 }} 
            spacing="lg"
          >
            {articles.map((article) => (
              <ArticleCard 
                key={article.id} 
                article={article} 
                onLike={handleLike}
                currentUserId={currentUser?.uid}
              />
            ))}
          </SimpleGrid>
        )}
      </Box>

      {/* 안내 메시지 */}
      {articles.length > 0 && (
        <Box mt={80} ta="center">
          <Title order={2} mb="md">
            더 많은 정보가 필요하신가요? 🤔
          </Title>
          <Text c="dimmed" mb="lg">
            원하는 정보를 찾지 못했다면 커뮤니티에서<br />
            전문가들에게 직접 질문해보세요!
          </Text>
          <Group justify="center" gap="md">
            <Badge size="lg" variant="outline" color="warm-coral">
              전문가 검증
            </Badge>
            <Badge size="lg" variant="outline" color="green">
              실용적 정보
            </Badge>
            <Badge size="lg" variant="outline" color="blue">
              체계적 정리
            </Badge>
          </Group>
        </Box>
      )}
    </Container>
  );
} 
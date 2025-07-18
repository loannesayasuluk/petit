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
  SimpleGrid,
  ActionIcon
} from '@mantine/core';
import { 
  IconHeart, 
  IconEye, 
  IconBook, 
  IconHeartFilled,
  IconAlertCircle,
  IconStethoscope,
  IconHome,
  IconShoppingCart,
  IconFirstAidKit,
  IconCategory
} from '@tabler/icons-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { KnowledgeArticle } from '../types';
import { ARTICLE_CATEGORIES } from '../types';
import { getKnowledgeArticles, toggleKnowledgeLike } from '../services/knowledgeService';
import { formatTimeAgo, getCategoryColor, cardHoverProps, likeButtonProps } from '../lib/utils';



function getCategoryIcon(category: string) {
  switch (category) {
    case '사육법': return IconHome;
    case '건강관리': return IconStethoscope;
    case '용품리뷰': return IconShoppingCart;
    case '응급처치': return IconFirstAidKit;
    default: return IconCategory;
  }
}

interface ArticleCardProps {
  article: KnowledgeArticle;
  onLike: (articleId: string) => void;
  currentUserId?: string;
}

function ArticleCard({ article, onLike, currentUserId }: ArticleCardProps) {
  const isLiked = currentUserId ? article.likes.includes(currentUserId) : false;
  const [likeLoading, setLikeLoading] = useState(false);

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (likeLoading) return; // 더블 클릭 방지
    
    setLikeLoading(true);
    try {
      await onLike(article.id);
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
            <ActionIcon
              {...likeButtonProps(isLiked, likeLoading)}
              onClick={handleLikeClick}
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
              {article.likes.length}
            </Text>
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
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});

  // 카테고리별 게시물 수 계산
  const calculateCategoryCounts = (allArticles: KnowledgeArticle[]) => {
    const counts: Record<string, number> = { '전체': allArticles.length };
    
    ARTICLE_CATEGORIES.forEach(category => {
      counts[category] = allArticles.filter(article => article.category === category).length;
    });
    
    return counts;
  };

  const loadArticles = async (category: string = '전체') => {
    try {
      setLoading(true);
      setError('');

      // Firebase에서 데이터 로딩 (fallback 제거)
      const result = await getKnowledgeArticles(
        20, 
        undefined, 
        category === '전체' ? undefined : category
      );
      
      const allArticles = result.articles;
      
      if (allArticles.length > 0) {
        // Firebase에서 데이터를 성공적으로 가져온 경우
        setArticles(allArticles);
        
        // 전체 게시물로 카테고리 카운트 계산
        if (category === '전체') {
          setCategoryCounts(calculateCategoryCounts(allArticles));
        } else {
          // 다른 카테고리 선택 시 전체 데이터로 카운트 재계산
          const allArticlesResult = await getKnowledgeArticles(100);
          setCategoryCounts(calculateCategoryCounts(allArticlesResult.articles));
        }
      } else {
        // Firebase에 데이터가 없는 경우
        setArticles([]);
        setCategoryCounts({ '전체': 0, '사육법': 0, '건강관리': 0, '용품리뷰': 0, '응급처치': 0, '기타': 0 });
        
        // 데이터가 없을 때 사용자에게 안내
        if (category === '전체') {
          setError('아직 지식백과가 없습니다. 전문가들의 유용한 정보를 기다려주세요! 또는 관리자가 샘플 데이터를 업로드해야 합니다.');
        }
      }
    } catch (err) {
      console.error('지식백과 로딩 오류:', err);
      setError(`Firebase 연결 오류: ${err instanceof Error ? err.message : '알 수 없는 오류'}. 관리자에게 문의하세요.`);
      
      // 에러 발생 시 빈 상태 설정
      setArticles([]);
      setCategoryCounts({ '전체': 0, '사육법': 0, '건강관리': 0, '용품리뷰': 0, '응급처치': 0, '기타': 0 });
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
      // Firebase 데이터만 처리 (로컬 데이터 분기 제거)
      await toggleKnowledgeLike(articleId, currentUser.uid);
      
      // 로컬 상태 즉시 업데이트 (UX 향상)
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
    } catch (error) {
      console.error('좋아요 처리 오류:', error);
      alert(`좋아요 처리 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
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
          {['전체', ...ARTICLE_CATEGORIES].map((category) => 
            renderCategoryButton(category))}
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
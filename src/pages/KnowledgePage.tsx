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
import { EmptyState } from '../components/EmptyState';



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
      <Group justify="space-between" mb="md">
        <Badge 
          color={getCategoryColor(article.category)} 
          variant="light"
          className="card-category"
        >
          {article.category}
        </Badge>
        <Text className="card-meta-small">
          {formatTimeAgo(article.createdAt)}
        </Text>
      </Group>

      {/* 제목 */}
      <Title order={4} className="card-title" lineClamp={2} style={{ flex: 1 }}>
        {article.title}
      </Title>

      {/* 내용 미리보기 */}
      <Text className="card-content" lineClamp={3}>
        {article.content.replace(/#{1,6}\s/g, '').slice(0, 120)}...
      </Text>

      {/* 작성자 정보 */}
      <Text className="card-meta">
        작성자: {article.author.avatar} {article.author.nickname}
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

      {/* 통계 섹션 */}
      <Group justify="space-between" className="card-stats" mt="auto">
        <Group gap="lg">
          <Group gap="xs" className="card-stats-item">
            <IconEye size={14} />
            <Text>조회 {article.viewCount}</Text>
          </Group>
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
              좋아요 {article.likes.length}
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

  useEffect(() => {
    loadArticles('전체');
  }, []);

  return (
    <Container size="lg" py="xl">
      {/* 헤더 섹션 */}
      <Box ta="center" mb="xl">
        <Title order={1} size="3rem" fw={800} mb="md">
          전문가 케어 가이드 📚
        </Title>
        <Text size="lg" c="dimmed" maw={600} mx="auto">
          초보 집사도 쉽게 따라할 수 있는<br />
          수의사와 전문가가 검증한 케어 정보들
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
          <EmptyState
            illustration="knowledge"
            title="아직 전문가 가이드가 없어요!"
            description={
              selectedCategory === '전체' 
                ? "수의사와 전문가들이 검증한 케어 가이드를 준비 중이에요. 신뢰할 수 있는 정보로 찾아뵐게요! 📚✨"
                : `${selectedCategory} 분야의 전문가 가이드를 준비하고 있어요. 곧 유용한 정보로 만나요!`
            }
            actionText="🚀 집사 라운지에서 물어보기"
            onAction={() => {
              // TODO: 커뮤니티 페이지로 이동
              console.log('커뮤니티로 이동');
            }}
            size="md"
          />
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
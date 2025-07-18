import { useState, useEffect, useRef } from 'react';
import { 
  TextInput, 
  ActionIcon, 
  Popover, 
  Stack, 
  Text, 
  Group, 
  Card, 
  Badge,
  Loader,
  Kbd
} from '@mantine/core';
import { IconSearch, IconX } from '@tabler/icons-react';
import { useDebouncedValue } from '@mantine/hooks';
import { getCategoryColor, formatTimeAgo } from '../lib/utils';

interface SearchResult {
  id: string;
  title: string;
  content: string;
  category: string;
  author: {
    nickname: string;
    avatar: string;
  };
  createdAt: Date;
  type: 'post' | 'article';
}

interface SearchBarProps {
  onResultClick?: (result: SearchResult) => void;
}

export function SearchBar({ onResultClick }: SearchBarProps) {
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearch] = useDebouncedValue(searchValue, 300);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [opened, setOpened] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  // 키보드 단축키 (Ctrl/Cmd + K)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        searchRef.current?.focus();
        setOpened(true);
      }
      
      if (event.key === 'Escape') {
        setSearchValue('');
        setOpened(false);
        searchRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 실시간 검색
  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setResults([]);
      setOpened(false);
      return;
    }

    performSearch(debouncedSearch);
  }, [debouncedSearch]);

  const performSearch = async (query: string) => {
    setLoading(true);
    try {
      // TODO: 실제 Firebase 검색 구현
      // 현재는 더미 데이터로 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const mockResults: SearchResult[] = [
        {
          id: '1',
          title: `"${query}" 관련 강아지 건강 관리법`,
          content: '우리 강아지가 최근에 잘 안먹어서 걱정이 많았는데...',
          category: '건강',
          author: { nickname: '햄찌사랑', avatar: '🐹' },
          createdAt: new Date(),
          type: 'post'
        },
        {
          id: '2',
          title: `${query} 초보자를 위한 기본 케어 가이드`,
          content: '처음 키우시는 분들을 위한 기본적인 케어 방법들을 정리했습니다...',
          category: '사육법',
          author: { nickname: '앵무박사', avatar: '🦜' },
          createdAt: new Date(Date.now() - 86400000),
          type: 'article'
        }
      ];
      
      setResults(mockResults);
      setOpened(true);
    } catch (error) {
      console.error('검색 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    setSearchValue('');
    setOpened(false);
    onResultClick?.(result);
  };

  const handleClear = () => {
    setSearchValue('');
    setOpened(false);
    searchRef.current?.focus();
  };

  return (
    <Popover
      opened={opened && (searchValue.length > 0 || results.length > 0)}
      position="bottom-start"
      width="target"
      shadow="md"
      withinPortal
    >
      <Popover.Target>
        <TextInput
          ref={searchRef}
          placeholder="애기 케어 정보 검색... (Ctrl+K)"
          value={searchValue}
          onChange={(e) => setSearchValue(e.currentTarget.value)}
          leftSection={<IconSearch size="1rem" />}
          rightSection={
            <Group gap="xs">
              {loading && <Loader size="xs" />}
              {searchValue && (
                <ActionIcon 
                  variant="subtle" 
                  size="sm"
                  onClick={handleClear}
                >
                  <IconX size="0.8rem" />
                </ActionIcon>
              )}
              <Kbd size="xs">⌘K</Kbd>
            </Group>
          }
          style={{
            width: '300px',
            transition: 'all 0.3s ease'
          }}
          onFocus={(e) => {
            e.currentTarget.style.width = '350px';
            setOpened(true);
          }}
          onBlur={(e) => {
            if (!searchValue) {
              e.currentTarget.style.width = '300px';
            }
            // 짧은 딜레이 후 닫기 (결과 클릭 시간 확보)
            setTimeout(() => setOpened(false), 200);
          }}
        />
      </Popover.Target>

      <Popover.Dropdown p="xs">
        {loading ? (
          <Group justify="center" p="md">
            <Loader size="sm" />
            <Text size="sm" c="dimmed">검색 중...</Text>
          </Group>
        ) : results.length > 0 ? (
          <Stack gap="xs">
            <Text size="xs" c="dimmed" px="sm">
              검색 결과 {results.length}개
            </Text>
            {results.map((result) => (
              <Card
                key={result.id}
                p="sm"
                style={{ 
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseDown={() => handleResultClick(result)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--mantine-color-gray-0)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Group justify="space-between" mb="xs">
                  <Badge 
                    size="xs" 
                    color={getCategoryColor(result.category)}
                    variant="light"
                  >
                    {result.category}
                  </Badge>
                  <Text size="xs" c="dimmed">
                    {formatTimeAgo(result.createdAt)}
                  </Text>
                </Group>
                
                <Text fw={600} size="sm" lineClamp={1} mb="xs">
                  {result.title}
                </Text>
                
                <Text size="xs" c="dimmed" lineClamp={2}>
                  {result.content}
                </Text>
                
                <Group justify="space-between" mt="xs">
                  <Text size="xs" c="dimmed">
                    {result.author.avatar} {result.author.nickname}
                  </Text>
                  <Badge size="xs" variant="outline">
                    {result.type === 'post' ? '커뮤니티' : '전문가 가이드'}
                  </Badge>
                </Group>
              </Card>
            ))}
          </Stack>
        ) : searchValue.length > 0 ? (
          <Group justify="center" p="md">
            <Text size="sm" c="dimmed">
              "{searchValue}"에 대한 검색 결과가 없습니다
            </Text>
          </Group>
        ) : null}
      </Popover.Dropdown>
    </Popover>
  );
} 
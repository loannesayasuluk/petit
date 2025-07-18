import { Group, Button, Anchor, Box, Title, ActionIcon, Menu, Text } from '@mantine/core';
import { IconPencil, IconLogin, IconUserPlus, IconBell, IconLogout, IconUser, IconSettings } from '@tabler/icons-react';
import { useState } from 'react';
import { AuthModal } from './AuthModal';
import { PostWriteModal } from './PostWriteModal';
import { NotificationDropdown } from './NotificationDropdown';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  currentPage: 'home' | 'knowledge' | 'community' | 'mypage';
  setCurrentPage: (page: 'home' | 'knowledge' | 'community' | 'mypage') => void;
}

export function Header({ currentPage, setCurrentPage }: HeaderProps) {
  const [authModalOpened, setAuthModalOpened] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [writeModalOpened, setWriteModalOpened] = useState(false);
  const { currentUser, userProfile, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };
  return (
    <Box 
      component="header" 
      h={80} 
      px="lg" 
      className="bg-gradient-header"
      style={{ 
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        boxShadow: 'var(--mantine-shadow-xs)'
      }}
    >
      <Title 
        order={2} 
        c="warm-coral.6" 
        fw={800}
        className="text-shimmer"
        style={{ 
          fontSize: '1.8rem',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
        onClick={() => setCurrentPage('home')}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        Petit 🐾
      </Title>
      
      <Group gap="lg">
        {/* 네비게이션 메뉴 */}
        <Group gap="md">
          <Anchor 
            onClick={() => setCurrentPage('home')}
            c={currentPage === 'home' ? 'warm-coral.6' : 'gray.7'} 
            fw={700}
            style={{ cursor: 'pointer' }}
          >
            홈
          </Anchor>
          <Anchor 
            onClick={() => setCurrentPage('knowledge')}
            c={currentPage === 'knowledge' ? 'warm-coral.6' : 'gray.7'} 
            fw={700}
            style={{ cursor: 'pointer' }}
          >
            지식백과
          </Anchor>
          <Anchor 
            onClick={() => setCurrentPage('community')}
            c={currentPage === 'community' ? 'warm-coral.6' : 'gray.7'} 
            fw={700}
            style={{ cursor: 'pointer' }}
          >
            커뮤니티
          </Anchor>
          <Anchor 
            onClick={() => setCurrentPage('mypage')}
            c={currentPage === 'mypage' ? 'warm-coral.6' : 'gray.7'} 
            fw={700}
            style={{ cursor: 'pointer' }}
          >
            마이페이지
          </Anchor>
        </Group>
        
        {/* 사용자 액션 버튼들 */}
        <Group gap="sm">
          {currentUser ? (
            // 로그인 상태
            <>
              {/* 알림 아이콘 */}
              <NotificationDropdown>
                <ActionIcon variant="subtle" size="lg" color="gray">
                  <IconBell size="1.2rem" />
                </ActionIcon>
              </NotificationDropdown>
              
              {/* 글쓰기 버튼 */}
              <Button 
                leftSection={<IconPencil size="1rem"/>}
                onClick={() => setWriteModalOpened(true)}
              >
                글쓰기
              </Button>
              
              {/* 사용자 메뉴 */}
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <Button variant="subtle" style={{ padding: '8px' }}>
                    <Group gap="xs">
                      <Text size="1.5rem">{userProfile?.avatar || '👤'}</Text>
                      <Text size="sm" fw={600}>
                        {userProfile?.nickname || '사용자'}
                      </Text>
                    </Group>
                  </Button>
                </Menu.Target>
                
                <Menu.Dropdown>
                  <Menu.Item 
                    leftSection={<IconUser size="1rem" />}
                    onClick={() => setCurrentPage('mypage')}
                  >
                    마이페이지
                  </Menu.Item>
                  <Menu.Item leftSection={<IconSettings size="1rem" />}>
                    설정
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item 
                    leftSection={<IconLogout size="1rem" />}
                    color="red"
                    onClick={handleLogout}
                  >
                    로그아웃
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </>
          ) : (
            // 로그아웃 상태
            <>
              <Button 
                variant="subtle" 
                leftSection={<IconLogin size="1rem"/>}
                onClick={() => {
                  setAuthMode('login');
                  setAuthModalOpened(true);
                }}
              >
                로그인
              </Button>
              <Button 
                variant="light" 
                leftSection={<IconUserPlus size="1rem"/>}
                onClick={() => {
                  setAuthMode('signup');
                  setAuthModalOpened(true);
                }}
              >
                회원가입
              </Button>
            </>
          )}
        </Group>
      </Group>

      {/* 로그인/회원가입 모달 */}
      <AuthModal
        opened={authModalOpened}
        onClose={() => setAuthModalOpened(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />

      {/* 글쓰기 모달 */}
      <PostWriteModal
        opened={writeModalOpened}
        onClose={() => setWriteModalOpened(false)}
        onSuccess={() => {
          // 글 작성 성공 시 커뮤니티 페이지로 이동
          setCurrentPage('community');
        }}
      />
    </Box>
  );
} 
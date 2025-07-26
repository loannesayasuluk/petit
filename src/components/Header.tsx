import { Group, Box, Menu, Text } from '@mantine/core';
import { IconPencil, IconLogin, IconUserPlus, IconBell, IconLogout, IconUser, IconSettings, IconHelp } from '@tabler/icons-react';
import { useState } from 'react';
import { AuthModal } from './AuthModal';
import { PostWriteModal } from './PostWriteModal';
import { NotificationDropdown } from './NotificationDropdown';
import { OnboardingModal } from './OnboardingModal';
import { useAuth } from '../contexts/AuthContext';
import { Logo } from './Logo';
import { SearchBar } from './SearchBar';

interface HeaderProps {
  currentPage: 'home' | 'knowledge' | 'community' | 'mypage';
  setCurrentPage: (page: 'home' | 'knowledge' | 'community' | 'mypage') => void;
}

export function Header({ currentPage, setCurrentPage }: HeaderProps) {
  const [authModalOpened, setAuthModalOpened] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [writeModalOpened, setWriteModalOpened] = useState(false);
  const [onboardingOpened, setOnboardingOpened] = useState(false);
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
      <Logo 
        size="md"
        onClick={() => setCurrentPage('home')}
      />

      {/* 검색바 */}
      <SearchBar 
        onResultClick={(result) => {
          // TODO: 검색 결과 클릭 시 해당 페이지로 이동
          console.log('검색 결과 클릭:', result);
          if (result.type === 'post') {
            setCurrentPage('community');
          } else {
            setCurrentPage('knowledge');
          }
        }}
      />
      
      <Group gap="lg">
        {/* 네비게이션 메뉴 */}
        <nav className="flex gap-6">
          <button
            onClick={() => setCurrentPage('home')}
            className={`font-bold text-sm transition-colors duration-200 hover:text-petit-primary relative ${
              currentPage === 'home' 
                ? 'text-petit-primary after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-0.5 after:bg-petit-primary' 
                : 'text-gray-600 hover:text-petit-primary'
            }`}
          >
            홈
          </button>
          <button
            onClick={() => setCurrentPage('knowledge')}
            className={`font-bold text-sm transition-colors duration-200 hover:text-petit-primary relative ${
              currentPage === 'knowledge' 
                ? 'text-petit-primary after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-0.5 after:bg-petit-primary' 
                : 'text-gray-600 hover:text-petit-primary'
            }`}
          >
            지식백과
          </button>
          <button
            onClick={() => setCurrentPage('community')}
            className={`font-bold text-sm transition-colors duration-200 hover:text-petit-primary relative ${
              currentPage === 'community' 
                ? 'text-petit-primary after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-0.5 after:bg-petit-primary' 
                : 'text-gray-600 hover:text-petit-primary'
            }`}
          >
            커뮤니티
          </button>
          <button
            onClick={() => setCurrentPage('mypage')}
            className={`font-bold text-sm transition-colors duration-200 hover:text-petit-primary relative ${
              currentPage === 'mypage' 
                ? 'text-petit-primary after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-0.5 after:bg-petit-primary' 
                : 'text-gray-600 hover:text-petit-primary'
            }`}
          >
            마이페이지
          </button>
        </nav>
        
        {/* 사용자 액션 버튼들 */}
        <Group gap="sm">
          {/* 도움말 버튼 */}
          <button
            className="p-2 text-gray-500 hover:text-petit-primary hover:bg-gray-100 rounded-lg transition-all duration-200"
            onClick={() => setOnboardingOpened(true)}
            title="Petit 가이드 보기"
          >
            <IconHelp size="1.2rem" />
          </button>
          
          {currentUser ? (
            // 로그인 상태
            <>
              {/* 알림 아이콘 */}
              <NotificationDropdown>
                <button className="p-2 text-gray-500 hover:text-petit-primary hover:bg-gray-100 rounded-lg transition-all duration-200">
                  <IconBell size="1.2rem" />
                </button>
              </NotificationDropdown>
              
              {/* 글쓰기 버튼 */}
              <button
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-petit-primary to-petit-primary-light text-white rounded-lg hover:from-petit-primary-dark hover:to-petit-primary transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
                onClick={() => setWriteModalOpened(true)}
              >
                <IconPencil size="1rem"/>
                ✍️ 글쓰기
              </button>
              
              {/* 사용자 메뉴 */}
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <Text size="1.5rem">{userProfile?.avatar || '👤'}</Text>
                    <Text size="sm" fw={600}>
                      {userProfile?.nickname || '사용자'}
                    </Text>
                  </button>
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
              <button
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-petit-primary transition-colors duration-200 rounded-lg hover:bg-gray-50"
                onClick={() => {
                  setAuthMode('login');
                  setAuthModalOpened(true);
                }}
              >
                <IconLogin size="1rem"/>
                로그인
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-petit-primary text-white rounded-lg hover:bg-petit-primary-dark transition-colors duration-200 shadow-sm hover:shadow-md"
                onClick={() => {
                  setAuthMode('signup');
                  setAuthModalOpened(true);
                }}
              >
                <IconUserPlus size="1rem"/>
                회원가입
              </button>
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

      {/* 온보딩 모달 */}
      <OnboardingModal
        opened={onboardingOpened}
        onClose={() => setOnboardingOpened(false)}
        onComplete={() => setOnboardingOpened(false)}
      />
    </Box>
  );
} 
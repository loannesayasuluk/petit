import { MantineProvider, Container } from '@mantine/core';
import { useState } from 'react';
import { theme } from './theme';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { KnowledgePage } from './pages/KnowledgePage';
import { CommunityPage } from './pages/CommunityPage';
import { MyPage } from './pages/MyPage';
import './index.css';

// 개발 환경에서만 샘플 데이터 업로드 스크립트 로드
if (import.meta.env.DEV) {
  import('./scripts/uploadSampleData');
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'knowledge' | 'community' | 'mypage'>('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'knowledge':
        return <KnowledgePage />;
      case 'community':
        return <CommunityPage />;
      case 'mypage':
        return <MyPage />;
      default:
        return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <AuthProvider>
        <div style={{ backgroundColor: '#FFF9E9', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
          <Container size="lg" py="xl" style={{ flex: 1 }}>
            {renderPage()}
          </Container>
          <Footer />
      </div>
      </AuthProvider>
    </MantineProvider>
  );
}

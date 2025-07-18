import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import '@mantine/core/styles.css'; // Mantine 기본 스타일 import
import './index.css';

// 프로덕션에서 샘플 데이터 업로드를 위한 스크립트
import './scripts/uploadSampleData';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

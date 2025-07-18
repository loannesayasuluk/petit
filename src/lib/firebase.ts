import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Firebase 설정 정보
const firebaseConfig = {
  apiKey: "AIzaSyBBJMDOwrRDvAvbzeFS5azSOmRvb03u77Q",
  authDomain: "petit-a03f7.firebaseapp.com",
  projectId: "petit-a03f7",
  storageBucket: "petit-a03f7.firebasestorage.app",
  messagingSenderId: "421504413780",
  appId: "1:421504413780:web:e6049ea4ee3d7622dd7dc1",
  measurementId: "G-56HEMDY2SE"
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// Firebase 서비스들을 내보내기
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
export default app; 
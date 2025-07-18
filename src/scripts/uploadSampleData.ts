import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { sampleUsers, samplePosts, sampleKnowledgeArticles } from '../data/sampleData';
import { COLLECTIONS } from '../types';

// Date를 Firestore Timestamp로 변환하는 함수
function dateToTimestamp(date: Date): Timestamp {
  return Timestamp.fromDate(date);
}

// 사용자 데이터 업로드
export async function uploadSampleUsers() {
  console.log('🔄 사용자 샘플 데이터 업로드 중...');
  
  for (const user of sampleUsers) {
    try {
      const userDoc = {
        ...user,
        createdAt: dateToTimestamp(user.createdAt)
      };
      
      await setDoc(doc(db, COLLECTIONS.USERS, user.uid), userDoc);
      console.log(`✅ 사용자 업로드 완료: ${user.nickname}`);
    } catch (error) {
      console.error(`❌ 사용자 업로드 실패: ${user.nickname}`, error);
    }
  }
}

// 커뮤니티 게시물 업로드
export async function uploadSamplePosts() {
  console.log('🔄 커뮤니티 게시물 샘플 데이터 업로드 중...');
  
  for (const post of samplePosts) {
    try {
      const postDoc = {
        ...post,
        createdAt: dateToTimestamp(post.createdAt),
        updatedAt: dateToTimestamp(post.updatedAt)
      };
      
      await setDoc(doc(db, COLLECTIONS.POSTS, post.id), postDoc);
      console.log(`✅ 게시물 업로드 완료: ${post.title}`);
    } catch (error) {
      console.error(`❌ 게시물 업로드 실패: ${post.title}`, error);
    }
  }
}

// 지식백과 글 업로드
export async function uploadSampleKnowledgeArticles() {
  console.log('🔄 지식백과 샘플 데이터 업로드 중...');
  
  for (const article of sampleKnowledgeArticles) {
    try {
      const articleDoc = {
        ...article,
        createdAt: dateToTimestamp(article.createdAt),
        updatedAt: dateToTimestamp(article.updatedAt)
      };
      
      await setDoc(doc(db, COLLECTIONS.ARTICLES, article.id), articleDoc);
      console.log(`✅ 지식백과 업로드 완료: ${article.title}`);
    } catch (error) {
      console.error(`❌ 지식백과 업로드 실패: ${article.title}`, error);
    }
  }
}

// 샘플 댓글 데이터 생성 및 업로드
export async function uploadSampleComments() {
  console.log('🔄 댓글 샘플 데이터 업로드 중...');
  
  const sampleComments = [
    {
      id: 'comment-1',
      postId: 'sample-post-1',
      content: '우와 정말 귀엽네요! 저희 햄찌도 이제 막 길들여지기 시작했는데 감동적이에요 ㅠㅠ',
      author: {
        uid: 'sample-user-2',
        nickname: '앵무박사',
        avatar: '🦜'
      },
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1시간 전
      updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
    },
    {
      id: 'comment-2',
      postId: 'sample-post-1',
      content: '젤리가 정말 예쁘네요! 햄스터 키우는 보람이 이런 순간에 있는 것 같아요 💕',
      author: {
        uid: 'sample-user-4',
        nickname: '밤송이네',
        avatar: '🦔'
      },
      createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30분 전
      updatedAt: new Date(Date.now() - 30 * 60 * 1000)
    },
    {
      id: 'comment-3',
      postId: 'sample-post-2',
      content: '앵무새 깃털 변화는 환경 변화나 스트레스가 원인일 수 있어요. 수의사 진료를 권장드립니다.',
      author: {
        uid: 'sample-user-2',
        nickname: '앵무박사',
        avatar: '🦜'
      },
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2시간 전
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: 'comment-4',
      postId: 'sample-post-3',
      content: '와 정말 멋진 사육장이네요! 설계도 공유해주시면 저도 만들어보고 싶어요!',
      author: {
        uid: 'sample-user-1',
        nickname: '햄찌사랑',
        avatar: '🐹'
      },
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4시간 전
      updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
    },
    {
      id: 'comment-5',
      postId: 'sample-post-5',
      content: '토끼가 음식을 안 먹는 건 응급상황일 수 있어요! 즉시 수의사에게 가세요. 빠른 쾌유를 바랍니다.',
      author: {
        uid: 'sample-user-2',
        nickname: '앵무박사',
        avatar: '🦜'
      },
      createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000), // 20시간 전
      updatedAt: new Date(Date.now() - 20 * 60 * 60 * 1000)
    }
  ];

  for (const comment of sampleComments) {
    try {
      const commentDoc = {
        ...comment,
        createdAt: dateToTimestamp(comment.createdAt),
        updatedAt: dateToTimestamp(comment.updatedAt)
      };
      
      await setDoc(doc(db, COLLECTIONS.COMMENTS, comment.id), commentDoc);
      console.log(`✅ 댓글 업로드 완료: ${comment.id}`);
    } catch (error) {
      console.error(`❌ 댓글 업로드 실패: ${comment.id}`, error);
    }
  }
}

// 모든 샘플 데이터 업로드
export async function uploadAllSampleData() {
  try {
    console.log('🚀 Firebase에 모든 샘플 데이터 업로드 시작...');
    
    await uploadSampleUsers();
    await uploadSamplePosts();
    await uploadSampleKnowledgeArticles();
    await uploadSampleComments();
    
    console.log('✅ 모든 샘플 데이터 업로드 완료!');
    alert('✅ Firebase에 샘플 데이터 업로드가 완료되었습니다!');
  } catch (error) {
    console.error('❌ 샘플 데이터 업로드 중 오류 발생:', error);
    alert('❌ 샘플 데이터 업로드 중 오류가 발생했습니다.');
  }
}

// 프로덕션에서도 초기 데이터 업로드를 위해 전역에 함수 노출
// @ts-ignore
window.uploadSampleData = uploadAllSampleData;
console.log('🔧 window.uploadSampleData() 함수가 사용 가능합니다.'); 
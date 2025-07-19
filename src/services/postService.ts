import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc,
  query, 
  orderBy, 
  limit, 
  startAfter, 
  where,
  Timestamp,
  increment,
  arrayUnion,
  arrayRemove,
  onSnapshot
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import type { CommunityPost } from '../types';
import { COLLECTIONS } from '../types';
import { incrementTagCounts, decrementTagCounts } from './tagService';

// 게시물 생성
export const createPost = async (
  postData: Omit<CommunityPost, 'id' | 'createdAt' | 'updatedAt' | 'viewCount' | 'likes'>,
  images?: File[]
): Promise<string> => {
  try {
    // 이미지 업로드
    let imageUrls: string[] = [];
    if (images && images.length > 0) {
      imageUrls = await uploadImages(images, 'posts');
    }

    // 게시물 데이터 준비
    const now = new Date();
    const postToSave = {
      ...postData,
      imageUrls,
      likes: [],
      viewCount: 0,
      createdAt: Timestamp.fromDate(now),
      updatedAt: Timestamp.fromDate(now)
    };

    // Firestore에 저장
    const docRef = await addDoc(collection(db, COLLECTIONS.POSTS), postToSave);
    
    // 태그 카운트 증가
    if (postData.tags && postData.tags.length > 0) {
      await incrementTagCounts(postData.tags);
    }
    
    return docRef.id;
  } catch (error) {
    console.error('게시물 생성 오류:', error);
    throw error;
  }
};

// 이미지 업로드 함수
const uploadImages = async (images: File[], folder: string): Promise<string[]> => {
  const uploadPromises = images.map(async (image) => {
    const timestamp = Date.now();
    const fileName = `${folder}/${timestamp}_${image.name}`;
    const storageRef = ref(storage, fileName);
    
    await uploadBytes(storageRef, image);
    return getDownloadURL(storageRef);
  });

  return Promise.all(uploadPromises);
};

// 게시물 목록 조회 (페이지네이션)
export const getPosts = async (
  limitCount: number = 10,
  lastDoc?: any,
  category?: string,
  tag?: string
) => {
  try {
      let q = query(
    collection(db, COLLECTIONS.POSTS),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );

  // 카테고리 필터
  if (category && category !== '전체') {
    q = query(
      collection(db, COLLECTIONS.POSTS),
      where('category', '==', category),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
  }

  // 태그 필터
  if (tag) {
    q = query(
      collection(db, COLLECTIONS.POSTS),
      where('tags', 'array-contains', tag),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
  }

    // 태그 필터
    if (tag) {
      q = query(
        collection(db, COLLECTIONS.POSTS),
        where('tags', 'array-contains', tag),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
    }

    // 페이지네이션
    if (lastDoc) {
      q = query(
        collection(db, COLLECTIONS.POSTS),
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc),
        limit(limitCount)
      );
    }

    const snapshot = await getDocs(q);
    const posts: CommunityPost[] = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      posts.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as CommunityPost);
    });

    return {
      posts,
      lastDoc: snapshot.docs[snapshot.docs.length - 1]
    };
  } catch (error) {
    console.error('게시물 목록 조회 오류:', error);
    throw error;
  }
};

// 게시물 상세 조회
export const getPost = async (postId: string): Promise<CommunityPost | null> => {
  try {
    const docRef = doc(db, COLLECTIONS.POSTS, postId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    } as CommunityPost;
  } catch (error) {
    console.error('게시물 조회 오류:', error);
    throw error;
  }
};

// 게시물 수정
export const updatePost = async (
  postId: string,
  updates: Partial<Pick<CommunityPost, 'title' | 'content' | 'category'>>
): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTIONS.POSTS, postId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.fromDate(new Date())
    });
  } catch (error) {
    console.error('게시물 수정 오류:', error);
    throw error;
  }
};

// 게시물 삭제
export const deletePost = async (postId: string): Promise<void> => {
  try {
    // 삭제 전 태그 정보 조회
    const postDoc = await getDoc(doc(db, COLLECTIONS.POSTS, postId));
    if (postDoc.exists()) {
      const postData = postDoc.data() as CommunityPost;
      
      // 게시물 삭제
      const docRef = doc(db, COLLECTIONS.POSTS, postId);
      await deleteDoc(docRef);
      
      // 태그 카운트 감소
      if (postData.tags && postData.tags.length > 0) {
        await decrementTagCounts(postData.tags);
      }
    }
  } catch (error) {
    console.error('게시물 삭제 오류:', error);
    throw error;
  }
};

// 조회수 증가
export const incrementViewCount = async (postId: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTIONS.POSTS, postId);
    await updateDoc(docRef, {
      viewCount: increment(1)
    });
  } catch (error) {
    console.error('조회수 증가 오류:', error);
    throw error;
  }
};

// 좋아요 토글
export const toggleLike = async (postId: string, userId: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTIONS.POSTS, postId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('게시물을 찾을 수 없습니다.');
    }

    const post = docSnap.data() as CommunityPost;
    const isLiked = post.likes?.includes(userId);

    if (isLiked) {
      // 좋아요 취소
      await updateDoc(docRef, {
        likes: arrayRemove(userId)
      });
    } else {
      // 좋아요 추가
      await updateDoc(docRef, {
        likes: arrayUnion(userId)
      });
    }
  } catch (error) {
    console.error('좋아요 토글 오류:', error);
    throw error;
  }
};

// 실시간 게시물 구독
export const subscribeToPost = (
  postId: string, 
  callback: (post: CommunityPost | null) => void
) => {
  const docRef = doc(db, COLLECTIONS.POSTS, postId);
  
  return onSnapshot(docRef, (doc) => {
    if (doc.exists()) {
      const data = doc.data();
      callback({
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as CommunityPost);
    } else {
      callback(null);
    }
  });
};

// 실시간 게시물 구독 (카테고리별 필터링 지원)
export const subscribeToPosts = (
  callback: (posts: CommunityPost[]) => void,
  category?: string,
  limitCount: number = 10,
  tag?: string
) => {
  let q = query(
    collection(db, COLLECTIONS.POSTS),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );

  // 카테고리 필터 적용
  if (category && category !== '전체') {
    q = query(
      collection(db, COLLECTIONS.POSTS),
      where('category', '==', category),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
  }

  // 태그 필터 적용
  if (tag) {
    q = query(
      collection(db, COLLECTIONS.POSTS),
      where('tags', 'array-contains', tag),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
  }

  return onSnapshot(q, (querySnapshot) => {
    const posts: CommunityPost[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      posts.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as CommunityPost);
    });
    
    callback(posts);
  }, (error) => {
    console.error('실시간 게시물 구독 오류:', error);
  });
}; 
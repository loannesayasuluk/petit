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
import type { KnowledgeArticle } from '../types';
import { COLLECTIONS } from '../types';

// 지식백과 글 생성
export const createKnowledgeArticle = async (
  articleData: Omit<KnowledgeArticle, 'id' | 'createdAt' | 'updatedAt' | 'viewCount' | 'likes'>,
  images?: File[]
): Promise<string> => {
  try {
    let imageUrls: string[] = [];

    // 이미지 업로드
    if (images && images.length > 0) {
      const uploadPromises = images.map(async (image) => {
        const timestamp = Date.now();
        const filename = `knowledge/${timestamp}_${image.name}`;
        const imageRef = ref(storage, filename);
        
        await uploadBytes(imageRef, image);
        return await getDownloadURL(imageRef);
      });

      imageUrls = await Promise.all(uploadPromises);
    }

    const now = Timestamp.now();
    const article: Omit<KnowledgeArticle, 'id'> = {
      ...articleData,
      imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
      viewCount: 0,
      likes: [],
      createdAt: now.toDate(),
      updatedAt: now.toDate()
    };

    const docRef = await addDoc(collection(db, COLLECTIONS.ARTICLES), article);
    console.log('지식백과 글 생성 완료:', docRef.id);
    
    return docRef.id;
  } catch (error) {
    console.error('지식백과 글 생성 오류:', error);
    throw error;
  }
};

// 지식백과 글 목록 조회 (페이지네이션)
export const getKnowledgeArticles = async (
  limitCount: number = 10,
  lastDoc?: any,
  category?: string
) => {
  try {
    let q = query(
      collection(db, COLLECTIONS.ARTICLES),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    // 카테고리 필터
    if (category) {
      q = query(
        collection(db, COLLECTIONS.ARTICLES),
        where('category', '==', category),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
    }

    // 페이지네이션
    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const querySnapshot = await getDocs(q);
    
    const articles: KnowledgeArticle[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      articles.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate()
      } as KnowledgeArticle);
    });

    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

    return {
      articles,
      lastDoc: lastVisible
    };
  } catch (error) {
    console.error('지식백과 글 목록 조회 오류:', error);
    throw error;
  }
};

// 특정 지식백과 글 조회
export const getKnowledgeArticle = async (articleId: string): Promise<KnowledgeArticle | null> => {
  try {
    const docRef = doc(db, COLLECTIONS.ARTICLES, articleId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate()
      } as KnowledgeArticle;
    } else {
      return null;
    }
  } catch (error) {
    console.error('지식백과 글 조회 오류:', error);
    throw error;
  }
};

// 지식백과 글 수정
export const updateKnowledgeArticle = async (
  articleId: string,
  updateData: Partial<Omit<KnowledgeArticle, 'id' | 'createdAt' | 'author' | 'viewCount' | 'likes'>>
): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTIONS.ARTICLES, articleId);
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: Timestamp.now()
    });
    
    console.log('지식백과 글 수정 완료:', articleId);
  } catch (error) {
    console.error('지식백과 글 수정 오류:', error);
    throw error;
  }
};

// 지식백과 글 삭제
export const deleteKnowledgeArticle = async (articleId: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTIONS.ARTICLES, articleId);
    await deleteDoc(docRef);
    
    console.log('지식백과 글 삭제 완료:', articleId);
  } catch (error) {
    console.error('지식백과 글 삭제 오류:', error);
    throw error;
  }
};

// 조회수 증가
export const incrementKnowledgeViewCount = async (articleId: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTIONS.ARTICLES, articleId);
    await updateDoc(docRef, {
      viewCount: increment(1)
    });
  } catch (error) {
    console.error('조회수 증가 오류:', error);
    throw error;
  }
};

// 좋아요 토글
export const toggleKnowledgeLike = async (articleId: string, userId: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTIONS.ARTICLES, articleId);
    const articleSnap = await getDoc(docRef);
    
    if (articleSnap.exists()) {
      const articleData = articleSnap.data() as KnowledgeArticle;
      const isLiked = articleData.likes.includes(userId);
      
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
    }
  } catch (error) {
    console.error('좋아요 토글 오류:', error);
    throw error;
  }
};

// 실시간 지식백과 글 구독
export const subscribeToKnowledgeArticles = (
  callback: (articles: KnowledgeArticle[]) => void,
  category?: string
) => {
  let q = query(
    collection(db, COLLECTIONS.ARTICLES),
    orderBy('createdAt', 'desc'),
    limit(20)
  );

  if (category) {
    q = query(
      collection(db, COLLECTIONS.ARTICLES),
      where('category', '==', category),
      orderBy('createdAt', 'desc'),
      limit(20)
    );
  }

  return onSnapshot(q, (querySnapshot) => {
    const articles: KnowledgeArticle[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      articles.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate()
      } as KnowledgeArticle);
    });
    
    callback(articles);
  });
}; 
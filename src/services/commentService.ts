import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy, 
  where,
  Timestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Comment } from '../types';
import { COLLECTIONS } from '../types';

// 댓글 생성
export const createComment = async (
  commentData: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  try {
    const now = new Date();
    const commentToSave = {
      ...commentData,
      createdAt: Timestamp.fromDate(now),
      updatedAt: Timestamp.fromDate(now)
    };

    const docRef = await addDoc(collection(db, COLLECTIONS.COMMENTS), commentToSave);
    return docRef.id;
  } catch (error) {
    console.error('댓글 생성 오류:', error);
    throw error;
  }
};

// 특정 게시물의 댓글 목록 조회
export const getCommentsByPostId = async (postId: string): Promise<Comment[]> => {
  try {
    const q = query(
      collection(db, COLLECTIONS.COMMENTS),
      where('postId', '==', postId),
      orderBy('createdAt', 'asc')
    );

    const snapshot = await getDocs(q);
    const comments: Comment[] = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      comments.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as Comment);
    });

    return comments;
  } catch (error) {
    console.error('댓글 목록 조회 오류:', error);
    throw error;
  }
};

// 댓글 수정
export const updateComment = async (
  commentId: string,
  content: string
): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTIONS.COMMENTS, commentId);
    await updateDoc(docRef, {
      content,
      updatedAt: Timestamp.fromDate(new Date())
    });
  } catch (error) {
    console.error('댓글 수정 오류:', error);
    throw error;
  }
};

// 댓글 삭제
export const deleteComment = async (commentId: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTIONS.COMMENTS, commentId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('댓글 삭제 오류:', error);
    throw error;
  }
};

// 댓글 수 조회
export const getCommentCount = async (postId: string): Promise<number> => {
  try {
    const q = query(
      collection(db, COLLECTIONS.COMMENTS),
      where('postId', '==', postId)
    );

    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    console.error('댓글 수 조회 오류:', error);
    return 0;
  }
};

// 실시간 댓글 구독
export const subscribeToComments = (
  postId: string, 
  callback: (comments: Comment[]) => void
) => {
  const q = query(
    collection(db, COLLECTIONS.COMMENTS),
    where('postId', '==', postId),
    orderBy('createdAt', 'asc')
  );
  
  return onSnapshot(q, (snapshot) => {
    const comments: Comment[] = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      comments.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as Comment);
    });

    callback(comments);
  });
}; 
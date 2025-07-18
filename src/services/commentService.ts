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
  onSnapshot,
  getDoc,
  arrayRemove,
  arrayUnion
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Comment } from '../types';
import { COLLECTIONS } from '../types';

// 댓글 생성 (대댓글 지원)
export const createComment = async (
  commentData: Omit<Comment, 'id' | 'createdAt' | 'updatedAt' | 'replies' | 'likes'>
): Promise<string> => {
  try {
    const now = new Date();
    const commentToSave = {
      ...commentData,
      likes: [], // 기본값으로 빈 배열 설정
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

// 특정 게시물의 댓글 목록 조회 (대댓글 구조화)
export const getCommentsByPostId = async (postId: string): Promise<Comment[]> => {
  try {
    const q = query(
      collection(db, COLLECTIONS.COMMENTS),
      where('postId', '==', postId),
      orderBy('createdAt', 'asc')
    );

    const snapshot = await getDocs(q);
    const allComments: Comment[] = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      allComments.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as Comment);
    });

    // 댓글을 중첩 구조로 변환
    return organizeCommentsHierarchy(allComments);
  } catch (error) {
    console.error('댓글 목록 조회 오류:', error);
    throw error;
  }
};

// 댓글을 중첩 구조로 조직화
const organizeCommentsHierarchy = (comments: Comment[]): Comment[] => {
  const commentMap = new Map<string, Comment>();
  const rootComments: Comment[] = [];

  // 모든 댓글을 맵에 저장하고 replies 배열 초기화
  comments.forEach(comment => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });

  // 댓글을 부모-자식 관계로 조직화
  comments.forEach(comment => {
    const commentWithReplies = commentMap.get(comment.id)!;
    
    if (comment.parentId && commentMap.has(comment.parentId)) {
      // 대댓글인 경우 부모 댓글의 replies에 추가
      const parent = commentMap.get(comment.parentId)!;
      parent.replies!.push(commentWithReplies);
    } else {
      // 최상위 댓글인 경우 루트 댓글 목록에 추가
      rootComments.push(commentWithReplies);
    }
  });

  return rootComments;
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

// 실시간 댓글 구독 (대댓글 구조화)
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
    const allComments: Comment[] = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      allComments.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as Comment);
    });

    // 댓글을 중첩 구조로 변환하여 콜백 호출
    const organizedComments = organizeCommentsHierarchy(allComments);
    callback(organizedComments);
  });
};

// 댓글 좋아요 토글
export const toggleCommentLike = async (commentId: string, userId: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTIONS.COMMENTS, commentId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('댓글을 찾을 수 없습니다.');
    }

    const comment = docSnap.data() as Comment;
    const isLiked = comment.likes?.includes(userId);

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
    console.error('댓글 좋아요 토글 오류:', error);
    throw error;
  }
}; 
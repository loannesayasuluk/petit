import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  increment, 
  query, 
  orderBy, 
  limit, 
  getDocs 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { COLLECTIONS } from '../types';
import type { Tag } from '../types';

/**
 * 태그 카운트 증가
 */
export async function incrementTagCount(tagName: string): Promise<void> {
  try {
    const tagRef = doc(db, COLLECTIONS.TAGS, tagName);
    const tagSnap = await getDoc(tagRef);

    if (tagSnap.exists()) {
      // 기존 태그 카운트 증가
      await updateDoc(tagRef, {
        count: increment(1),
        updatedAt: new Date()
      });
    } else {
      // 새 태그 생성
      await setDoc(tagRef, {
        id: tagName,
        count: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  } catch (error) {
    console.error(`태그 카운트 증가 오류 (${tagName}):`, error);
    throw error;
  }
}

/**
 * 태그 카운트 감소
 */
export async function decrementTagCount(tagName: string): Promise<void> {
  try {
    const tagRef = doc(db, COLLECTIONS.TAGS, tagName);
    const tagSnap = await getDoc(tagRef);

    if (tagSnap.exists()) {
      const currentCount = tagSnap.data().count || 0;
      
      if (currentCount > 1) {
        // 카운트 감소
        await updateDoc(tagRef, {
          count: increment(-1),
          updatedAt: new Date()
        });
      } else {
        // 카운트가 1 이하면 문서 삭제는 하지 않고 0으로 설정
        await updateDoc(tagRef, {
          count: 0,
          updatedAt: new Date()
        });
      }
    }
  } catch (error) {
    console.error(`태그 카운트 감소 오류 (${tagName}):`, error);
    throw error;
  }
}

/**
 * 여러 태그 카운트 일괄 증가
 */
export async function incrementTagCounts(tagNames: string[]): Promise<void> {
  try {
    const promises = tagNames.map(tagName => incrementTagCount(tagName));
    await Promise.all(promises);
  } catch (error) {
    console.error('태그 카운트 일괄 증가 오류:', error);
    throw error;
  }
}

/**
 * 여러 태그 카운트 일괄 감소
 */
export async function decrementTagCounts(tagNames: string[]): Promise<void> {
  try {
    const promises = tagNames.map(tagName => decrementTagCount(tagName));
    await Promise.all(promises);
  } catch (error) {
    console.error('태그 카운트 일괄 감소 오류:', error);
    throw error;
  }
}

/**
 * 인기 태그 목록 조회 (상위 N개)
 */
export async function getTopTags(limitCount: number = 10): Promise<Tag[]> {
  try {
    const tagsQuery = query(
      collection(db, COLLECTIONS.TAGS),
      orderBy('count', 'desc'),
      orderBy('updatedAt', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(tagsQuery);
    const tags: Tag[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      tags.push({
        id: doc.id,
        count: data.count || 0,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      });
    });

    // count가 0보다 큰 태그만 반환
    return tags.filter(tag => tag.count > 0);
  } catch (error) {
    console.error('인기 태그 조회 오류:', error);
    throw error;
  }
}

/**
 * 태그 업데이트 (게시물 수정 시 사용)
 */
export async function updateTagCounts(oldTags: string[], newTags: string[]): Promise<void> {
  try {
    // 제거된 태그들
    const removedTags = oldTags.filter(tag => !newTags.includes(tag));
    // 추가된 태그들
    const addedTags = newTags.filter(tag => !oldTags.includes(tag));

    // 병렬 처리
    await Promise.all([
      decrementTagCounts(removedTags),
      incrementTagCounts(addedTags)
    ]);
  } catch (error) {
    console.error('태그 업데이트 오류:', error);
    throw error;
  }
} 
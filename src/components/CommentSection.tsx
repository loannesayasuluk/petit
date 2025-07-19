import {
  Box,
  Text,
  Textarea,
  Button,
  Group,
  Stack,
  Divider,
  Alert,
  Card,
  ActionIcon,
  Menu,
  Loader,
  Center,
  Collapse
} from '@mantine/core';
import { IconMessage, IconDots, IconEdit, IconTrash, IconCornerDownRight, IconHeart, IconHeartFilled } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { EmptyState } from './EmptyState';
import { 
  createComment, 
  subscribeToComments, 
  updateComment, 
  deleteComment,
  toggleCommentLike 
} from '../services/commentService';
import type { Comment } from '../types';

interface CommentSectionProps {
  postId: string;
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return '방금 전';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
  return `${Math.floor(diffInSeconds / 86400)}일 전`;
}

interface CommentItemProps {
  comment: Comment;
  currentUserId?: string;
  userProfile: any;
  postId: string;
  onEdit: (commentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
  onReply: (parentId: string, content: string) => void;
  onLike: (commentId: string) => void;
  depth?: number;
}

function CommentItem({ 
  comment, 
  currentUserId, 
  userProfile,
  postId,
  onEdit, 
  onDelete, 
  onReply,
  onLike,
  depth = 0 
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [replyLoading, setReplyLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  
  const isOwner = currentUserId === comment.author.uid;
  const isLiked = currentUserId ? comment.likes?.includes(currentUserId) : false;
  const maxDepth = 3; // 최대 3단계까지만 중첩 허용

  const handleEditSubmit = async () => {
    if (!editContent.trim()) return;
    
    setLoading(true);
    try {
      await onEdit(comment.id, editContent.trim());
      setIsEditing(false);
    } catch (error) {
      console.error('댓글 수정 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCancel = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  const handleReplySubmit = async () => {
    if (!replyContent.trim()) return;
    
    setReplyLoading(true);
    try {
      await onReply(comment.id, replyContent.trim());
      setReplyContent('');
      setIsReplying(false);
    } catch (error) {
      console.error('대댓글 작성 오류:', error);
    } finally {
      setReplyLoading(false);
    }
  };

  const handleReplyCancel = () => {
    setReplyContent('');
    setIsReplying(false);
  };

  const handleLikeClick = async () => {
    if (likeLoading || !currentUserId) return;
    
    setLikeLoading(true);
    try {
      await onLike(comment.id);
    } finally {
      setTimeout(() => setLikeLoading(false), 300);
    }
  };

  return (
    <Box>
      <Card 
        withBorder 
        radius="md" 
        p="md"
        style={{ 
          marginLeft: depth > 0 ? `${depth * 20}px` : 0,
          borderLeft: depth > 0 ? '3px solid var(--mantine-color-blue-2)' : undefined
        }}
      >
        <Group justify="space-between" mb="xs">
          <Group gap="xs">
            <Text size="sm" fw={600}>
              {comment.author.avatar || '👤'} {comment.author.nickname}
            </Text>
            <Text size="xs" c="dimmed">
              {formatTimeAgo(comment.createdAt)}
            </Text>
          </Group>
          
          {isOwner && (
            <Menu shadow="md" width={120}>
              <Menu.Target>
                <ActionIcon variant="subtle" size="sm" color="gray">
                  <IconDots size="1rem" />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<IconEdit size="0.9rem" />}
                  onClick={() => setIsEditing(true)}
                >
                  수정
                </Menu.Item>
                <Menu.Item
                  leftSection={<IconTrash size="0.9rem" />}
                  color="red"
                  onClick={() => onDelete(comment.id)}
                >
                  삭제
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </Group>

        {isEditing ? (
          <Stack gap="sm">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.currentTarget.value)}
              placeholder="댓글을 입력하세요..."
              autosize
              minRows={2}
              maxRows={6}
            />
            <Group gap="sm" justify="flex-end">
              <Button
                variant="subtle"
                size="sm"
                onClick={handleEditCancel}
                disabled={loading}
              >
                취소
              </Button>
              <Button
                size="sm"
                onClick={handleEditSubmit}
                loading={loading}
                disabled={!editContent.trim()}
              >
                수정
              </Button>
            </Group>
          </Stack>
        ) : (
          <>
            <Text size="sm" style={{ whiteSpace: 'pre-wrap' }} mb="sm">
              {comment.content}
            </Text>
            
            {/* 댓글 액션 버튼들 */}
            <Group gap="md" justify="space-between">
              <Group gap="sm">
                {/* 좋아요 버튼 */}
                {currentUserId && (
                  <Group gap="xs">
                    <ActionIcon
                      variant="subtle"
                      color={isLiked ? 'red' : 'gray'}
                      size="sm"
                      onClick={handleLikeClick}
                      loading={likeLoading}
                      style={{
                        transform: isLiked ? 'scale(1.1)' : 'scale(1)',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {isLiked ? (
                        <IconHeartFilled 
                          size={14} 
                          style={{ 
                            animation: isLiked ? 'heartBeat 0.6s ease-in-out' : undefined 
                          }} 
                        />
                      ) : (
                        <IconHeart size={14} />
                      )}
                    </ActionIcon>
                    <Text 
                      size="xs" 
                      fw={isLiked ? 600 : 400}
                      c={isLiked ? 'red' : 'dimmed'}
                    >
                      {comment.likes?.length || 0}
                    </Text>
                  </Group>
                )}
              </Group>

              {/* 답글 버튼 */}
              {currentUserId && depth < maxDepth && (
                <Button
                  variant="subtle"
                  size="xs"
                  leftSection={<IconCornerDownRight size="0.8rem" />}
                  onClick={() => setIsReplying(true)}
                  color="blue"
                >
                  답글
                </Button>
              )}
            </Group>
          </>
        )}

        {/* 답글 작성 폼 */}
        <Collapse in={isReplying}>
          <Box mt="md" pt="md" style={{ borderTop: '1px solid var(--mantine-color-gray-3)' }}>
            <Group gap="xs" mb="sm">
              <Text size="sm" fw={600}>
                {userProfile?.avatar || '👤'} {userProfile?.nickname || '사용자'}
              </Text>
              <Text size="xs" c="dimmed">답글 작성 중...</Text>
            </Group>
            
            <Stack gap="sm">
              <Textarea
                placeholder={`${comment.author.nickname}님에게 답글을 남겨보세요...`}
                value={replyContent}
                onChange={(e) => setReplyContent(e.currentTarget.value)}
                autosize
                minRows={2}
                maxRows={4}
              />
              <Group justify="space-between">
                <Text size="xs" c="dimmed">
                  {replyContent.length}/500자
                </Text>
                <Group gap="sm">
                  <Button
                    variant="subtle"
                    size="sm"
                    onClick={handleReplyCancel}
                    disabled={replyLoading}
                  >
                    취소
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleReplySubmit}
                    loading={replyLoading}
                    disabled={!replyContent.trim() || replyContent.length > 500}
                  >
                    답글 작성
                  </Button>
                </Group>
              </Group>
            </Stack>
          </Box>
        </Collapse>
      </Card>

      {/* 대댓글 렌더링 */}
      {comment.replies && comment.replies.length > 0 && (
        <Box mt="sm">
          {comment.replies.map((reply) => (
            <Box key={reply.id} mt="sm">
              <CommentItem
                comment={reply}
                currentUserId={currentUserId}
                userProfile={userProfile}
                postId={postId}
                onEdit={onEdit}
                onDelete={onDelete}
                onReply={onReply}
                onLike={onLike}
                depth={depth + 1}
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { currentUser, userProfile } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [commentsLoading, setCommentsLoading] = useState(true);

  // 총 댓글 수 계산 (대댓글 포함)
  const getTotalCommentCount = (comments: Comment[]): number => {
    let count = 0;
    comments.forEach(comment => {
      count += 1; // 해당 댓글
      if (comment.replies) {
        count += getTotalCommentCount(comment.replies); // 대댓글들
      }
    });
    return count;
  };

  // 실시간 댓글 구독
  useEffect(() => {
    const unsubscribe = subscribeToComments(postId, (updatedComments) => {
      setComments(updatedComments);
      setCommentsLoading(false);
    });

    return unsubscribe;
  }, [postId]);

  const handleSubmitComment = async () => {
    if (!currentUser || !userProfile) {
      setError('로그인이 필요합니다.');
      return;
    }

    if (!newComment.trim()) {
      setError('댓글 내용을 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await createComment({
        postId,
        content: newComment.trim(),
        author: {
          uid: currentUser.uid,
          nickname: userProfile.nickname,
          avatar: userProfile.avatar,
        }
      });
      
      setNewComment('');
    } catch (error) {
      console.error('댓글 작성 오류:', error);
      setError('댓글 작성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleReplyComment = async (parentId: string, content: string) => {
    if (!currentUser || !userProfile) return;

    try {
      await createComment({
        postId,
        parentId,
        content,
        author: {
          uid: currentUser.uid,
          nickname: userProfile.nickname,
          avatar: userProfile.avatar,
        }
      });
    } catch (error) {
      console.error('대댓글 작성 오류:', error);
      throw error;
    }
  };

  const handleEditComment = async (commentId: string, content: string) => {
    try {
      await updateComment(commentId, content);
    } catch (error) {
      console.error('댓글 수정 오류:', error);
      throw error;
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('정말 댓글을 삭제하시겠습니까?')) return;
    
    try {
      await deleteComment(commentId);
    } catch (error) {
      console.error('댓글 삭제 오류:', error);
      alert('댓글 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleCommentLike = async (commentId: string) => {
    if (!currentUser) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      await toggleCommentLike(commentId, currentUser.uid);
    } catch (error) {
      console.error('댓글 좋아요 오류:', error);
      alert('좋아요 처리 중 오류가 발생했습니다.');
    }
  };

  const totalCommentsCount = getTotalCommentCount(comments);

  return (
    <Box>
      <Divider 
        my="xl" 
        labelPosition="center" 
        label={
          <Group gap="xs">
            <IconMessage size="1rem" />
            <Text fw={600}>댓글 ({totalCommentsCount})</Text>
          </Group>
        } 
      />

      {/* 댓글 작성 */}
      {currentUser ? (
        <Card withBorder radius="md" p="md" mb="md">
          <Stack gap="sm">
            <Group gap="xs" mb="xs">
              <Text size="sm" fw={600}>
                {userProfile?.avatar || '👤'} {userProfile?.nickname || '사용자'}
              </Text>
            </Group>
            
            <Textarea
              placeholder="따뜻한 댓글을 남겨주세요..."
              value={newComment}
              onChange={(e) => setNewComment(e.currentTarget.value)}
              autosize
              minRows={2}
              maxRows={6}
              error={error}
            />
            
            <Group justify="space-between">
              <Text size="xs" c="dimmed">
                {newComment.length}/500자
              </Text>
              <Button
                onClick={handleSubmitComment}
                loading={loading}
                disabled={!newComment.trim() || newComment.length > 500}
                size="sm"
              >
                댓글 작성
              </Button>
            </Group>
          </Stack>
        </Card>
      ) : (
        <Alert mb="md" radius="md">
          댓글을 작성하려면 로그인이 필요합니다.
        </Alert>
      )}

      {/* 댓글 목록 */}
      {commentsLoading ? (
        <Center py="xl">
          <Stack align="center" gap="md">
            <Loader size="md" />
            <Text size="sm" c="dimmed">댓글을 불러오는 중...</Text>
          </Stack>
        </Center>
      ) : comments.length === 0 ? (
        <EmptyState
          illustration="comments"
          title="아직 댓글이 없어요!"
          description="이 글에 대한 첫 번째 댓글을 남겨주세요. 따뜻한 소통의 시작이 되어주세요! 💬"
          actionText={currentUser ? "💬 첫 댓글 쓰기" : "🚀 로그인하고 댓글쓰기"}
          onAction={() => {
            if (currentUser) {
              // 댓글 입력창으로 포커스
              const textarea = document.querySelector('textarea[placeholder*="댓글"]') as HTMLTextAreaElement;
              textarea?.focus();
            } else {
              // TODO: 로그인 모달 열기
              console.log('로그인 필요');
            }
          }}
          size="sm"
        />
      ) : (
        <Stack gap="md">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={currentUser?.uid}
              userProfile={userProfile}
              postId={postId}
              onEdit={handleEditComment}
              onDelete={handleDeleteComment}
              onReply={handleReplyComment}
              onLike={handleCommentLike}
              depth={0}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
} 
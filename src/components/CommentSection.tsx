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
  Center
} from '@mantine/core';
import { IconMessage, IconDots, IconEdit, IconTrash } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  createComment, 
  subscribeToComments, 
  updateComment, 
  deleteComment 
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
  onEdit: (commentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
}

function CommentItem({ comment, currentUserId, onEdit, onDelete }: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [loading, setLoading] = useState(false);
  
  const isOwner = currentUserId === comment.author.uid;

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

  return (
    <Card withBorder radius="md" p="md">
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
        <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
          {comment.content}
        </Text>
      )}
    </Card>
  );
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { currentUser, userProfile } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [commentsLoading, setCommentsLoading] = useState(true);

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

  return (
    <Box>
      <Divider 
        my="xl" 
        labelPosition="center" 
        label={
          <Group gap="xs">
            <IconMessage size="1rem" />
            <Text fw={600}>댓글 ({comments.length})</Text>
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
        <Center py="xl">
          <Stack align="center" gap="md">
            <Text size="lg" c="dimmed">
              아직 댓글이 없습니다
            </Text>
            <Text size="sm" c="dimmed">
              첫 번째 댓글을 남겨보세요!
            </Text>
          </Stack>
        </Center>
      ) : (
        <Stack gap="md">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={currentUser?.uid}
              onEdit={handleEditComment}
              onDelete={handleDeleteComment}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
} 
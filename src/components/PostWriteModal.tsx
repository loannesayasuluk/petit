import { 
  Modal, 
  TextInput, 
  Textarea, 
  Button, 
  Group, 
  Stack, 
  Title, 
  Alert, 
  Select, 
  FileInput, 
  Image, 
  Box, 
  Text,
  ActionIcon,
  TagsInput
} from '@mantine/core';
import { IconPhoto, IconAlertCircle, IconX } from '@tabler/icons-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { createPost } from '../services/postService';
import type { CommunityPost } from '../types';
import { POST_CATEGORIES } from '../types';

interface PostWriteModalProps {
  opened: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function PostWriteModal({ opened, onClose, onSuccess }: PostWriteModalProps) {
  const { currentUser, userProfile } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<string>('일상');
  const [tags, setTags] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const clearForm = () => {
    setTitle('');
    setContent('');
    setCategory('일상');
    setTags([]);
    setImages([]);
    setError('');
  };

  const handleClose = () => {
    clearForm();
    onClose();
  };

  const handleImageSelect = (files: File[] | null) => {
    if (files) {
      setImages(files);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!currentUser || !userProfile) {
      setError('로그인이 필요합니다.');
      return;
    }

    if (!title.trim() || !content.trim()) {
      setError('제목과 내용을 모두 입력해주세요.');
      return;
    }

    if (title.length > 100) {
      setError('제목은 100자 이내로 입력해주세요.');
      return;
    }

    if (content.length > 2000) {
      setError('내용은 2000자 이내로 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const postData: Omit<CommunityPost, 'id' | 'createdAt' | 'updatedAt' | 'viewCount' | 'likes'> = {
        title: title.trim(),
        content: content.trim(),
        category: category as any,
        tags: tags.map(tag => tag.trim()).filter(tag => tag.length > 0),
        author: {
          uid: currentUser.uid,
          nickname: userProfile.nickname,
          avatar: userProfile.avatar,
        }
      };

      await createPost(postData, images);
      
      // 성공 시 폼 초기화 및 모달 닫기
      handleClose();
      onSuccess?.();
    } catch (error) {
      console.error('게시물 작성 오류:', error);
      setError('게시물 작성 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={
        <Title order={2} c="warm-coral.6">
          새 이야기 들려주기 ✍️
        </Title>
      }
      size="lg"
      centered
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
    >
      <Stack gap="md">
        {/* 오류 메시지 */}
        {error && (
          <Alert icon={<IconAlertCircle size="1rem" />} color="red">
            {error}
          </Alert>
        )}

        {/* 카테고리 선택 */}
        <Select
          label="카테고리"
          placeholder="어떤 이야기인가요?"
          data={POST_CATEGORIES.map(cat => ({ value: cat, label: cat }))}
          value={category}
          onChange={(value) => value && setCategory(value)}
          required
        />

        {/* 태그 입력 */}
        <TagsInput
          label="태그"
          placeholder="#사료추천, #건강상식 등을 입력하세요"
          value={tags}
          onChange={setTags}
          data={[
            '사료추천', '건강상식', '산책꿀팁', '응급처치', '훈련법', 
            '용품리뷰', '미용법', '놀이법', '운동법', '질병정보'
          ]}
          maxTags={5}
          acceptValueOnBlur
          clearable
          description="최대 5개까지 선택 가능합니다. 엔터키로 추가하세요."
        />

        {/* 제목 입력 */}
        <TextInput
          label="제목"
          placeholder="제목을 입력해주세요 (최대 100자)"
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
          required
          maxLength={100}
          rightSection={
            <Text size="xs" c="dimmed">
              {title.length}/100
            </Text>
          }
        />

        {/* 내용 입력 */}
        <Textarea
          label="내용"
          placeholder="우리 애기들의 이야기를 들려주세요! (최대 2000자)"
          value={content}
          onChange={(e) => setContent(e.currentTarget.value)}
          required
          minRows={6}
          maxRows={10}
          autosize
          maxLength={2000}
          rightSection={
            <Text size="xs" c="dimmed" style={{ marginTop: '4px' }}>
              {content.length}/2000
            </Text>
          }
        />

        {/* 이미지 업로드 */}
        <Box>
          <Text size="sm" fw={500} mb="xs">
            사진 첨부 (최대 5장)
          </Text>
          <FileInput
            placeholder="사진을 선택해주세요"
            leftSection={<IconPhoto size="1rem" />}
            multiple
            accept="image/*"
            onChange={handleImageSelect}
            disabled={images.length >= 5}
          />
          
          {/* 선택된 이미지 미리보기 */}
          {images.length > 0 && (
            <Box mt="sm">
              <Text size="xs" c="dimmed" mb="xs">
                선택된 이미지 ({images.length}/5)
              </Text>
              <Group gap="sm">
                {images.map((image, index) => (
                  <Box key={index} pos="relative">
                    <Image
                      src={URL.createObjectURL(image)}
                      alt={`preview-${index}`}
                      w={80}
                      h={80}
                      radius="md"
                      style={{ objectFit: 'cover' }}
                    />
                    <ActionIcon
                      size="sm"
                      color="red"
                      variant="filled"
                      pos="absolute"
                      top={-5}
                      right={-5}
                      onClick={() => removeImage(index)}
                    >
                      <IconX size="0.7rem" />
                    </ActionIcon>
                  </Box>
                ))}
              </Group>
            </Box>
          )}
        </Box>

        {/* 버튼 그룹 */}
        <Group justify="flex-end" mt="md">
          <Button
            variant="subtle"
            onClick={handleClose}
            disabled={loading}
          >
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            loading={loading}
            disabled={!title.trim() || !content.trim()}
          >
            글 올리기
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
} 
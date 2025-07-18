import { Modal, TextInput, PasswordInput, Button, Group, Text, Divider, Stack, Anchor, Title, Alert } from '@mantine/core';
import { IconBrandGoogle, IconMail, IconLock, IconUser, IconAlertCircle } from '@tabler/icons-react';
import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface AuthModalProps {
  opened: boolean;
  onClose: () => void;
  mode: 'login' | 'signup';
  onModeChange: (mode: 'login' | 'signup') => void;
}

export function AuthModal({ opened, onClose, mode, onModeChange }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const clearForm = () => {
    setEmail('');
    setPassword('');
    setNickname('');
    setConfirmPassword('');
    setError('');
  };

  const handleClose = () => {
    clearForm();
    onClose();
  };

  const createUserProfile = async (user: any, additionalData = {}) => {
    if (!user) return;
    
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      const { email } = user;
      const createdAt = new Date();
      
      try {
        await setDoc(userRef, {
          email,
          nickname: nickname || email?.split('@')[0] || '프티 사용자',
          createdAt,
          ...additionalData
        });
      } catch (error) {
        console.error('사용자 프로필 생성 중 오류:', error);
      }
    }
  };

  const handleEmailAuth = async () => {
    if (!email || !password) {
      setError('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    if (mode === 'signup') {
      if (!nickname) {
        setError('닉네임을 입력해주세요.');
        return;
      }
      if (password !== confirmPassword) {
        setError('비밀번호가 일치하지 않습니다.');
        return;
      }
      if (password.length < 6) {
        setError('비밀번호는 6자 이상이어야 합니다.');
        return;
      }
    }

    setLoading(true);
    setError('');

    try {
      if (mode === 'signup') {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        await createUserProfile(user);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      handleClose();
    } catch (error: any) {
      console.error(`${mode} 오류:`, error);
      
      // Firebase 오류 메시지를 한국어로 변환
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('이미 사용 중인 이메일입니다.');
          break;
        case 'auth/user-not-found':
          setError('등록되지 않은 이메일입니다.');
          break;
        case 'auth/wrong-password':
          setError('비밀번호가 올바르지 않습니다.');
          break;
        case 'auth/invalid-email':
          setError('유효하지 않은 이메일 형식입니다.');
          break;
        case 'auth/weak-password':
          setError('비밀번호가 너무 약합니다.');
          break;
        default:
          setError('오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError('');

    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);
      await createUserProfile(user);
      handleClose();
    } catch (error: any) {
      console.error('Google 로그인 오류:', error);
      setError('Google 로그인 중 오류가 발생했습니다.');
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
          {mode === 'login' ? '프티에 로그인하기' : '프티 가족이 되기'}
        </Title>
      }
      size="md"
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

        {/* 소셜 로그인 버튼들 */}
        <Stack gap="sm">
          <Button
            variant="outline"
            leftSection={<IconBrandGoogle size="1.2rem" />}
            fullWidth
            size="md"
            onClick={handleGoogleAuth}
            loading={loading}
            disabled={loading}
          >
            구글로 {mode === 'login' ? '로그인' : '가입하기'}
          </Button>
        </Stack>

        <Divider label="또는" labelPosition="center" />

        {/* 이메일 회원가입/로그인 폼 */}
        <Stack gap="sm">
          {mode === 'signup' && (
            <TextInput
              label="닉네임"
              placeholder="우리 애기들을 어떻게 불러드릴까요?"
              leftSection={<IconUser size="1rem" />}
              value={nickname}
              onChange={(e) => setNickname(e.currentTarget.value)}
              radius="md"
            />
          )}
          
          <TextInput
            label="이메일"
            placeholder="email@petit.com"
            leftSection={<IconMail size="1rem" />}
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            radius="md"
          />
          
          <PasswordInput
            label="비밀번호"
            placeholder="안전한 비밀번호를 입력하세요"
            leftSection={<IconLock size="1rem" />}
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            radius="md"
          />

          {mode === 'signup' && (
            <PasswordInput
              label="비밀번호 확인"
              placeholder="비밀번호를 다시 입력하세요"
              leftSection={<IconLock size="1rem" />}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.currentTarget.value)}
              radius="md"
            />
          )}
        </Stack>

        {/* 로그인/회원가입 버튼 */}
        <Button
          onClick={handleEmailAuth}
          size="md"
          radius="md"
          fullWidth
          loading={loading}
          disabled={loading}
          style={{
            marginTop: '1rem'
          }}
        >
          {mode === 'login' ? '로그인하기' : '프티 가족 되기'}
        </Button>

        {/* 모드 전환 */}
        <Group justify="center" gap="xs">
          <Text size="sm" c="dimmed">
            {mode === 'login' ? '아직 프티 가족이 아니신가요?' : '이미 프티 가족이신가요?'}
          </Text>
          <Anchor
            size="sm"
            onClick={() => {
              clearForm();
              onModeChange(mode === 'login' ? 'signup' : 'login');
            }}
            style={{ cursor: 'pointer' }}
          >
            {mode === 'login' ? '회원가입하기' : '로그인하기'}
          </Anchor>
        </Group>

        {/* 가입 시 약관 동의 */}
        {mode === 'signup' && (
          <Text size="xs" c="dimmed" ta="center" mt="sm">
            회원가입 시 프티의{' '}
            <Anchor size="xs">이용약관</Anchor>과{' '}
            <Anchor size="xs">개인정보처리방침</Anchor>에 동의하게 됩니다.
          </Text>
        )}
      </Stack>
    </Modal>
  );
} 
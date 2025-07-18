import { Menu, UnstyledButton, Text, Group, Divider, Badge, Stack, Box } from '@mantine/core';
import { IconBell, IconHeart, IconMessage, IconUserPlus, IconBook } from '@tabler/icons-react';

const notifications = [
  {
    id: 1,
    type: 'like',
    message: '햄찌사랑님이 회원님의 글을 좋아합니다',
    time: '5분 전',
    isRead: false,
    avatar: '🐹'
  },
  {
    id: 2,
    type: 'comment',
    message: '앵무박사님이 회원님의 글에 댓글을 남겼습니다',
    time: '1시간 전',
    isRead: false,
    avatar: '🦜'
  },
  {
    id: 3,
    type: 'follow',
    message: '렙타일킹님이 회원님을 팔로우하기 시작했습니다',
    time: '3시간 전',
    isRead: true,
    avatar: '🦎'
  },
  {
    id: 4,
    type: 'update',
    message: '고슴도치 사육법에 새로운 글이 업데이트되었습니다',
    time: '1일 전',
    isRead: true,
    avatar: '📚'
  }
];

function NotificationItem({ notification }: { notification: typeof notifications[0] }) {
  const getIcon = () => {
    switch (notification.type) {
      case 'like': return <IconHeart size="1rem" color="#ff6b6b" />;
      case 'comment': return <IconMessage size="1rem" color="#4c6ef5" />;
      case 'follow': return <IconUserPlus size="1rem" color="#51cf66" />;
      case 'update': return <IconBook size="1rem" color="#ff8c42" />;
      default: return <IconBell size="1rem" />;
    }
  };

  return (
    <Box
      p="sm"
      style={{
        backgroundColor: notification.isRead ? 'transparent' : 'var(--mantine-color-blue-0)',
        borderRadius: 'var(--mantine-radius-sm)',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease'
      }}
    >
      <Group gap="sm" wrap="nowrap">
        <Text size="lg">{notification.avatar}</Text>
        <Box style={{ flex: 1 }}>
          <Group gap="xs" mb="xs">
            {getIcon()}
            {!notification.isRead && (
              <Badge size="xs" color="blue" variant="filled" w={8} h={8} p={0} />
            )}
          </Group>
          <Text size="sm" lineClamp={2}>
            {notification.message}
          </Text>
          <Text size="xs" c="dimmed" mt="xs">
            {notification.time}
          </Text>
        </Box>
      </Group>
    </Box>
  );
}

interface NotificationDropdownProps {
  children: React.ReactNode;
}

export function NotificationDropdown({ children }: NotificationDropdownProps) {
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <Menu shadow="md" width={350} position="bottom-end">
      <Menu.Target>
        <UnstyledButton style={{ position: 'relative' }}>
          {children}
          {unreadCount > 0 && (
            <Badge
              size="xs"
              color="red"
              variant="filled"
              style={{
                position: 'absolute',
                top: -5,
                right: -5,
                padding: '2px 6px',
                fontSize: '10px',
                lineHeight: 1
              }}
            >
              {unreadCount}
            </Badge>
          )}
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown p={0}>
        <Box p="md" style={{ borderBottom: '1px solid var(--mantine-color-gray-2)' }}>
          <Group justify="space-between">
            <Text fw={600} size="sm">알림</Text>
            {unreadCount > 0 && (
              <Badge size="sm" color="blue" variant="light">
                {unreadCount}개의 새 알림
              </Badge>
            )}
          </Group>
        </Box>
        
        <Stack gap={0} mah={400} style={{ overflowY: 'auto' }}>
          {notifications.map((notification, index) => (
            <div key={notification.id}>
              <NotificationItem notification={notification} />
              {index < notifications.length - 1 && (
                <Divider mx="sm" />
              )}
            </div>
          ))}
        </Stack>

        <Box p="md" style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
          <Text 
            size="sm" 
            c="blue" 
            ta="center" 
            style={{ cursor: 'pointer' }}
          >
            모든 알림 보기
          </Text>
        </Box>
      </Menu.Dropdown>
    </Menu>
  );
} 
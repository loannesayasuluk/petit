import { Box, Container, Group, Text, Anchor, Divider, Stack } from '@mantine/core';

export function Footer() {
  return (
    <Box component="footer" bg="gray.1" mt="auto">
      <Container size="lg">
        <Box py="xl">
          <Group justify="space-between" align="flex-start">
            {/* 로고 및 소개 */}
            <Stack gap="md" style={{ flex: 1 }}>
              <Text fw={800} fz="lg" c="warm-coral.6">Petit</Text>
              <Text size="sm" c="dimmed" maw={300}>
                초보 집사를 위한 전문 케어 플랫폼<br/>
                전문가 검증 정보와 실전 경험으로 만드는 안심 케어 가이드
              </Text>
            </Stack>
            
            {/* 링크 그룹 */}
            <Group gap="xl" align="flex-start">
              <Stack gap="xs">
                <Text fw={700} size="sm">서비스</Text>
                <Anchor href="#" size="sm" c="dimmed">지식백과</Anchor>
                <Anchor href="#" size="sm" c="dimmed">커뮤니티</Anchor>
                <Anchor href="#" size="sm" c="dimmed">전문가 참여</Anchor>
              </Stack>
              
              <Stack gap="xs">
                <Text fw={700} size="sm">고객지원</Text>
                <Anchor href="#" size="sm" c="dimmed">공지사항</Anchor>
                <Anchor href="#" size="sm" c="dimmed">문의하기</Anchor>
                <Anchor href="#" size="sm" c="dimmed">FAQ</Anchor>
              </Stack>
              
              <Stack gap="xs">
                <Text fw={700} size="sm">정책</Text>
                <Anchor href="#" size="sm" c="dimmed">이용약관</Anchor>
                <Anchor href="#" size="sm" c="dimmed">개인정보처리방침</Anchor>
                <Anchor href="#" size="sm" c="dimmed">커뮤니티 가이드</Anchor>
              </Stack>
            </Group>
          </Group>
          
          <Divider my="lg" />
          
          <Group justify="space-between">
            <Text size="xs" c="dimmed">
              © 2024 Petit. All rights reserved.
            </Text>
            <Text size="xs" c="dimmed">
              Made with ❤️ for our beloved pets
            </Text>
          </Group>
        </Box>
      </Container>
    </Box>
  );
} 
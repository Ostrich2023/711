import {
  Container,
  Title,
  Text,
  Image,
  rem,
  Box,
  Stack,
  SimpleGrid,
  useMantineTheme,
} from '@mantine/core';

const features = [
  {
    title: 'Skill Wallet Creation',
    image: '/images/skill-wallet.png',
    description:
      'Each user is automatically assigned a digital Skill Wallet upon their first login — a permanent, secure space for verified skills, accessible anytime.',
  },
  {
    title: 'Submit & Track Skills',
    image: '/images/submit-track.png',
    description:
      'Submitting skills is easy: select the skill, upload your explanation and proof (files, images, etc). You can track approval status and get notified when your skill is verified.',
  },
  {
    title: 'Verification with Transparency',
    image: '/images/verification.png',
    description:
      'Teachers review and approve submissions through a clean interface. All verified skills are stored immutably — they can’t be edited or faked, and are trusted by employers.',
  },
  {
    title: 'Skill Visibility Control',
    image: '/images/visibility.png',
    description:
      'You decide who sees your skills. Show your verified skills to employers, keep others private, or use visibility toggles to control your professional profile.',
  },
  {
    title: 'Opportunities & Employer Match',
    image: '/images/employer-match.png',
    description:
      'Employers browse public skill graphs and post jobs or events. You can apply in one click — and employers can easily check your verified competencies.',
  },
];

export default function ServicesPage() {
  const theme = useMantineTheme();

  return (
    <Container size="lg" py="xl">
      <Title order={1} ta="center" fw={700}>
        What You Can Do With <span style={{ color: theme.colors.blue[6] }}>Kanavoogle</span>
      </Title>
      <Text ta="center" c="dimmed" mt="sm">
        A visual-first, verification-backed digital credential system for learners and organizations.
      </Text>

      <Stack gap={96} mt="xl">
        {features.map((feature, index) => (
          <SimpleGrid
            key={feature.title}
            cols={{ base: 1, md: 2 }}
            spacing={40}
            style={{
              flexDirection: 'row',
              direction: index % 2 === 0 ? 'ltr' : 'rtl',
            }}
          >
            <Box style={{ display: 'flex', justifyContent: 'center' }}>
              <Image
                src={feature.image}
                alt={feature.title}
                radius="lg"
                fit="contain"
                w="100%"
                maw={420}
                style={{ boxShadow: theme.shadows.md }}
              />
            </Box>

            <Box style={{ textAlign: index % 2 === 0 ? 'left' : 'right' }}>
              <Title order={3} mb={rem(8)} fw={600}>
                {feature.title}
              </Title>
              <Text size="sm" c="dimmed" lh={1.7}>
                {feature.description}
              </Text>
            </Box>
          </SimpleGrid>
        ))}
      </Stack>
    </Container>
  );
}

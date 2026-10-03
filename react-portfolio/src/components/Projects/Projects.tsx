import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Anchor,
  Box,
  Button,
  Chip,
  Group,
  Modal,
  Pill,
  rem,
  SimpleGrid,
  Stack,
  Text,
  Title,
  UnstyledButton,
} from '@mantine/core';
import { AnimatePresence, motion } from 'motion/react';
import { IconArrowRight, IconExternalLink } from '@tabler/icons-react';
import {
  blueGradient,
  lightColor,
  pillStyle,
  TerminalCard,
  TypedPrompt,
} from '../Terminal/Terminal';
import { VantaNETBackground } from '../VantaNETBackground/VantaNETBackground';
import { PROJECTS, TOPICS, type Project, type Topic } from '@/data/projects';
import classes from './Projects.module.css';

const MotionDiv = motion.div;

const topicLabel = (id: Topic) => TOPICS.find((t) => t.id === id)?.label ?? id;

function TopicTags({ topics }: { topics: Topic[] }) {
  return (
    <Group gap={6}>
      {topics.map((t) => (
        <Text key={t} ff="monospace" size="xs" fw={700} variant="gradient" gradient={blueGradient}>
          #{t}
        </Text>
      ))}
    </Group>
  );
}

function TechPills({ tech }: { tech: string[] }) {
  return (
    <Group gap={6}>
      {tech.map((t) => (
        <Pill key={t} size="sm" style={pillStyle}>
          {t}
        </Pill>
      ))}
    </Group>
  );
}

function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  return (
    <TerminalCard h="100%" p="lg" withTrafficLights={false}>
      <Stack gap="sm" h="100%">
        <Text ff="monospace" size="xs" c="dimmed" data-cursor-text>
          ~/projects/{project.slug}
        </Text>
        <Title order={4} fw={600} lh={1.3} data-cursor-text>
          {project.title}
        </Title>
        <Text size="sm" c="dimmed" fs="italic" data-cursor-text>
          {project.kind} · {project.date}
        </Text>
        <TopicTags topics={project.topics} />
        <Text size="sm" c="dimmed" lh={1.6} data-cursor-text style={{ flex: 1 }}>
          {project.summary}
        </Text>
        <TechPills tech={project.tech} />
        <Group justify="flex-end" mt="xs">
          <Button
            variant="subtle"
            color={lightColor}
            radius="md"
            size="compact-sm"
            ff="monospace"
            rightSection={<IconArrowRight style={{ width: rem(14), height: rem(14) }} />}
            onClick={onOpen}
          >
            cat README
          </Button>
        </Group>
      </Stack>
    </TerminalCard>
  );
}

function ProjectDetails({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <TerminalCard p="xl">
      <UnstyledButton
        onClick={onClose}
        aria-label="Close"
        style={{ position: 'absolute', top: rem(10), right: rem(16) }}
      >
        <Text ff="monospace" size="xs" c="dimmed">
          [esc]
        </Text>
      </UnstyledButton>
      <Stack gap="md" pt="md">
        <TypedPrompt text={`> cat ~/projects/${project.slug}/README.md`} active speed={35} />
        <Title order={2} fw={600} lh={1.25} data-cursor-text>
          {project.title}
        </Title>
        <Text size="sm" c="dimmed" fs="italic" data-cursor-text>
          {project.kind} · {project.date}
        </Text>
        <TopicTags topics={project.topics} />
        <TechPills tech={project.tech} />
        {project.links && (
          <Group gap="md">
            {project.links.map((l) => (
              <Anchor
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                c={lightColor}
                size="sm"
                ff="monospace"
                underline="hover"
              >
                <Group gap={4} component="span" wrap="nowrap">
                  {l.label}
                  <IconExternalLink style={{ width: rem(14), height: rem(14) }} />
                </Group>
              </Anchor>
            ))}
          </Group>
        )}
        <Box style={{ height: rem(1), background: 'currentColor', opacity: 0.12 }} />
        <Stack gap="sm">
          {project.details.map((paragraph, i) => (
            <Text key={i} size="sm" lh={1.75} data-cursor-text>
              {paragraph}
            </Text>
          ))}
        </Stack>
      </Stack>
    </TerminalCard>
  );
}

export function Projects() {
  const [searchParams, setSearchParams] = useSearchParams();
  const param = searchParams.get('topic');
  const topic: Topic | 'all' = TOPICS.some((t) => t.id === param) ? (param as Topic) : 'all';

  const [openSlug, setOpenSlug] = useState<string | null>(null);
  // Keep the last opened project around so the modal can animate out with its content.
  const [lastOpen, setLastOpen] = useState<Project | null>(null);

  const counts = useMemo(() => {
    const c = new Map<Topic, number>();
    for (const p of PROJECTS) {
      for (const t of p.topics) {
        c.set(t, (c.get(t) ?? 0) + 1);
      }
    }
    return c;
  }, []);

  const visible = topic === 'all' ? PROJECTS : PROJECTS.filter((p) => p.topics.includes(topic));

  const setTopic = (value: string) => {
    setSearchParams(value === 'all' ? {} : { topic: value }, { replace: true });
  };

  const open = (project: Project) => {
    setLastOpen(project);
    setOpenSlug(project.slug);
  };

  return (
    <Box className={classes.page}>
      {/* Fixed to the viewport so the network stays put while the content scrolls over it. */}
      <Box style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <VantaNETBackground />
      </Box>
      <Box className={classes.content}>
        <Stack gap="xs" mb="xl">
          <TypedPrompt
            text={topic === 'all' ? '> ls ~/projects' : `> ls ~/projects | grep ${topic}`}
            active
            speed={45}
          />
          <Title order={1} fw={500} data-cursor-text>
            Projects
          </Title>
          <Text c="dimmed" data-cursor-text>
            Notable technical projects, newest first. Filter by topic below.
          </Text>
        </Stack>

        <Chip.Group multiple={false} value={topic} onChange={setTopic}>
          <Group gap="xs" mb="xl">
            <Chip value="all" color={lightColor} radius="md" variant="outline" ff="monospace">
              all ({PROJECTS.length})
            </Chip>
            {TOPICS.filter((t) => counts.has(t.id)).map((t) => (
              <Chip
                key={t.id}
                value={t.id}
                color={lightColor}
                radius="md"
                variant="outline"
                ff="monospace"
              >
                {t.label.toLowerCase()} ({counts.get(t.id)})
              </Chip>
            ))}
          </Group>
        </Chip.Group>

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl" verticalSpacing="xl">
          <AnimatePresence mode="popLayout">
            {visible.map((p) => (
              <MotionDiv
                key={p.slug}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              >
                <ProjectCard project={p} onOpen={() => open(p)} />
              </MotionDiv>
            ))}
          </AnimatePresence>
        </SimpleGrid>

        {topic !== 'all' && (
          <Text ff="monospace" size="xs" c="dimmed" mt="xl">
            {visible.length} result{visible.length === 1 ? '' : 's'} for #{topic} (
            {topicLabel(topic)})
          </Text>
        )}
      </Box>

      <Modal
        opened={openSlug !== null}
        onClose={() => setOpenSlug(null)}
        withCloseButton={false}
        size={rem(860)}
        padding={0}
        radius={12}
        centered
        overlayProps={{ backgroundOpacity: 0.35 }}
        transitionProps={{ transition: 'pop', duration: 200 }}
        styles={{ content: { background: 'transparent', boxShadow: 'none', overflow: 'visible' } }}
      >
        {lastOpen && <ProjectDetails project={lastOpen} onClose={() => setOpenSlug(null)} />}
      </Modal>
    </Box>
  );
}

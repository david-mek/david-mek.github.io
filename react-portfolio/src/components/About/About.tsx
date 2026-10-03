import { useEffect, useRef, useState } from 'react';

import {
  ActionIcon,
  Anchor,
  Avatar,
  Box,
  Group,
  Indicator,
  Pill,
  Space,
  Stack,
  rem,
  Text,
  Title,
} from '@mantine/core';
import { AnimatePresence, motion, useInView } from 'motion/react';
import classes from './About.module.css';

import {
  IconBrandGithub,
  IconChevronLeft,
  IconChevronRight,
  IconMail,
  IconFileDescription,
  IconBrandLinkedin,
} from '@tabler/icons-react';

import { SnapTile } from '../SnapTile/SnapTile';
import {
  blueGradient,
  lightColor,
  Mono,
  pillStyle,
  TerminalCard,
  TypedPrompt,
} from '../Terminal/Terminal';
import { VectorFieldBackground } from '../VectorFieldBackground/VectorFieldBackground';
import { TuringTapeBackground } from '../TuringTapeBackground/TuringTapeBackground';

import picture_of_me from '../../images/me.jpg';
import { GameOfLifeBackground } from '../GameOfLifeBackground/GameOfLifeBackground';
// Backup background for the last tile; to restore it, swap it in below.
// import { VantaNETBackground } from '../VantaNETBackground/VantaNETBackground';

const MotionDiv = motion.div;

const cardVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 40 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir * -40 }),
};

function FilesPane() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const paneRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(paneRef, { amount: 0.45 });

  const navigate = (next: number) => {
    setDirection(next > activeIndex ? 1 : -1);
    setActiveIndex(next);
  };

  const files = [
    {
      prompt: '> ls ~/education',
      content: (
        <Stack gap="md">
          <Stack gap={2}>
            <Group justify="space-between" wrap="nowrap">
              <Text fw={700} size="1rem" data-cursor-text>
                University of Pennsylvania
              </Text>
              <Text size="sm" c="dimmed" data-cursor-text>
                Philadelphia, PA
              </Text>
            </Group>
            <Group justify="space-between" wrap="nowrap">
              <Text size="sm" c="dimmed" data-cursor-text fs="italic">
                M.S.E. in Computer Science, Software Systems & Cybersecurity focus.
              </Text>
              <Text size="sm" c="dimmed" fs="italic" data-cursor-text>
                Jan 2027 - Expected May 2028
              </Text>
            </Group>
            <Group justify="space-between" wrap="nowrap">
              <Text
                ff="monospace"
                size="sm"
                fw={700}
                variant="gradient"
                gradient={blueGradient}
                data-cursor-text
              >
                GPA: TBD
              </Text>
            </Group>

            <Space h="0.5rem" />

            <Group justify="space-between" wrap="nowrap">
              <Text fw={700} size="1rem" data-cursor-text>
                University of Michigan
              </Text>
              <Text size="sm" c="dimmed" data-cursor-text>
                Ann Arbor, MI
              </Text>
            </Group>
            <Group justify="space-between" wrap="nowrap">
              <Text size="sm" c="dimmed" data-cursor-text fs="italic">
                B.S.E. in Computer Science & Engineering.
              </Text>
              <Text size="sm" c="dimmed" fs="italic" data-cursor-text>
                August 2021 - May 2025
              </Text>
            </Group>
            <Group justify="space-between" wrap="nowrap">
              <Text size="sm" c="dimmed" data-cursor-text>
                Awards: Dean's list, Engineering Scholarship of Honor.
              </Text>
            </Group>
            <Group justify="space-between" wrap="nowrap">
              <Text
                ff="monospace"
                size="sm"
                fw={700}
                variant="gradient"
                gradient={blueGradient}
                data-cursor-text
              >
                GPA: 3.84 / 4.0
              </Text>
            </Group>
          </Stack>

          <Box style={{ height: rem(1), background: 'currentColor', opacity: 0.12 }} />

          <Stack gap="sm">
            <Text size="sm" c="dimmed" fw={600} data-cursor-text>
              Relevant Coursework
            </Text>
            <Box
              style={{
                display: 'flex',
                gap: 'var(--mantine-spacing-md)',
                overflowX: 'auto',
                scrollSnapType: 'x mandatory',
                paddingBottom: 'var(--mantine-spacing-xs)',
                scrollbarWidth: 'thin',
              }}
            >
              {[
                {
                  dir: 'architecture/',
                  courses: [
                    'General Computer Architecture',
                    'Out of Order Computer Architecture',
                    'Parallel Computer Architecture',
                    'Microarchitecture',
                    'GPU Architecture and Programming',
                  ],
                },
                {
                  dir: 'systems/',
                  courses: [
                    'Operating Systems',
                    'Distributed Systems',
                    'Compiler Design',
                    'Computer Security',
                  ],
                },
                {
                  dir: 'theory/',
                  courses: [
                    'Data Structures & Programming',
                    'Data Structures & Algorithms',
                    'Computability Theory',
                    'Computational Complexity Theory',
                    'Randomness in Computation',
                    'Cryptography',
                    'Machine Learning',
                  ],
                },
                {
                  dir: 'math/',
                  courses: [
                    'Single Variable Calculus',
                    'Multivariable & Vector Calculus',
                    'Applied Linear Algebra',
                    'Discrete Mathematics',
                    'Ordinary Differential Equations',
                    'Partial Differential Equations (BVPs)',
                    'Probability & Statistics',
                  ],
                },
              ].map((group) => (
                <Box
                  key={group.dir}
                  p="md"
                  style={{
                    flex: '0 0 auto',
                    scrollSnapAlign: 'start',
                    whiteSpace: 'nowrap',
                    borderRadius: 'var(--mantine-radius-md)',
                    background: 'rgba(33, 150, 243, 0.06)',
                    border: `${rem(1)} solid rgba(33, 150, 243, 0.25)`,
                  }}
                >
                  <Stack gap={2}>
                    <Text
                      ff="monospace"
                      size="sm"
                      fw={700}
                      variant="gradient"
                      gradient={blueGradient}
                      mb={4}
                      data-cursor-text
                    >
                      {group.dir}
                    </Text>
                    {group.courses.map((course) => (
                      <Text key={course} size="sm" c="dimmed" data-cursor-text>
                        · {course}
                      </Text>
                    ))}
                  </Stack>
                </Box>
              ))}
            </Box>
          </Stack>
        </Stack>
      ),
    },
    {
      prompt: '> ls ~/experience',
      content: (
        <Box
          style={{
            maxHeight: '45vh',
            overflowY: 'auto',
            paddingRight: 'var(--mantine-spacing-sm)',
            scrollbarWidth: 'thin',
          }}
        >
          <Stack gap="xl">
            {[
              {
                org: 'Analog Devices',
                location: 'Greater Boston, MA',
                roles: [
                  {
                    title: 'Associate Hardware & Systems Engineer',
                    period: 'Sep 2025 - Present',
                    current: true,
                    bullets: [
                      <>
                        Contributed to component requirement and microarchitectural specifications,{' '}
                        RTL, and DV for a mixed-signal power controller SoC.
                      </>,
                      <>
                        Built a GUI tool that consolidates and automates critical workflows, letting
                        engineers diagnose, simulate, and evaluate prospective customer workflows across
                        various IP. This involved full stack development utilizing <Mono>React</Mono> +{' '}
                        <Mono>TypeScript</Mono> for the UI, a <Mono>Python</Mono> <Mono>FastAPI</Mono> CRUD
                        backend, and networking code to distribute jobs and their dependencies across a
                        dedicated Linux compute cluster.
                      </>,
                    ],
                  },
                  {
                    title: 'Hardware & Systems Engineer Intern',
                    period: 'May - Aug 2025',
                    bullets: [
                      <>
                        Developed a custom machine learning model, data generation/augmentation and EDA
                        infrastructure, and training/evaluation scripts to provide fast, accurate
                        performance and power estimates for a proprietary hardware subsystem.
                      </>,
                    ],
                  },
                  {
                    title: 'Hardware & Systems Engineer Intern',
                    period: 'May - Aug 2024',
                    bullets: [
                      <>
                        Automated the PPA analysis workflow for a Neural Processing Unit's SDK: modifying
                        memory map tables, generating linker scripts, compiling TensorFlow Lite
                        networks into hardware executables, running <Mono>SystemC</Mono> simulations,
                        scraping logs for performance data, generating/simulating parameterizable
                        RTL, and performing power analysis.
                      </>,
                      <>
                        Profiled and optimized part of a <Mono>CUDA</Mono> & <Mono>C++</Mono> codebase for
                        5G signal processing (downconversion, OFDM via FFTs, channel estimation,
                        demodulation, and EVM calculation) on Nvidia GPUs, using{' '}
                        Nsight Systems, Nsight Compute, roofline analysis, and{' '}
                        <Mono>Python</Mono> scripting.
                      </>,
                    ],
                  },
                  {
                    title: 'System Software Engineer Intern',
                    period: 'May - Aug 2023',
                    bullets: [
                      <>
                        Worked on the product security team, developing a <Mono>SystemC</Mono> model of an
                        elliptic curve cryptography block in an embedded security enclave to aid its
                        functional verification and NIST certification.
                      </>,
                    ],
                  },
                ],
              },
              {
                org: 'University of Michigan',
                location: 'Ann Arbor, MI',
                roles: [
                  {
                    title: 'Teaching Assistant, EECS 483 (Compiler Design)',
                    period: 'Jan - May 2025',
                    bullets: [
                      <>
                        Worked with Professor{' '}
                        <Anchor
                          href="https://maxsnew.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          inherit
                          c={lightColor}
                          underline="hover"
                        >
                          Max S. New
                        </Anchor>{' '}
                        to hold office hours and support course logistics during the{' '}
                        <Anchor
                          href="https://maxsnew.com/teaching/eecs-483-wn25/index.html"
                          target="_blank"
                          rel="noopener noreferrer"
                          inherit
                          c={lightColor}
                          underline="hover"
                        >
                          Winter 2025
                        </Anchor>{' '}
                        semester.
                      </>,
                      <>
                        Assisted with the design, proctoring, and grading of exams, and hosted a weekly
                        lecture recitation co-taught with EECS PhD candidate Yuchen Jiang.
                      </>,
                      <>Rated an average 4.9/5 on teaching feedback surveys (~65% response rate).</>,
                    ],
                  },
                ],
              },
            ].map((company) => (
              <Stack key={company.org} gap="sm">
                <Group justify="space-between" wrap="nowrap">
                  <Text fw={700} size="1rem" data-cursor-text>
                    {company.org}
                  </Text>
                  <Text fw={700} size="sm" c="dimmed" data-cursor-text>
                    {company.location}
                  </Text>
                </Group>

                <Box style={{ paddingLeft: rem(22), marginLeft: rem(5) }}>
                  <Stack gap="lg">
                    {company.roles.map((role, i) => (
                      <Box key={role.title + role.period} style={{ position: 'relative' }}>
                        {i < company.roles.length - 1 && (
                          <Box
                            style={{
                              position: 'absolute',
                              left: rem(-22),
                              top: rem(10),
                              bottom: `calc(-1 * (var(--mantine-spacing-lg) + ${rem(10)}))`,
                              width: rem(2),
                              background: 'rgba(33, 150, 243, 0.25)',
                            }}
                          />
                        )}

                        <Box
                          style={{
                            position: 'absolute',
                            left: rem(-27),
                            top: rem(4),
                            width: rem(12),
                            height: rem(12),
                            borderRadius: '50%',
                            border: `${rem(2)} solid #2196f3`,
                            background: role.current
                              ? 'linear-gradient(90deg, #2196f3, #0d47a1)'
                              : 'var(--mantine-color-body)',
                            zIndex: 1,
                          }}
                        />

                        <Group justify="space-between" wrap="nowrap" align="flex-start" mb={6}>
                          <Text size="sm" fw={700} variant="gradient" gradient={blueGradient} data-cursor-text>
                            {role.title}
                          </Text>
                          <Text size="sm" c="dimmed" fs="italic" style={{ whiteSpace: 'nowrap' }} data-cursor-text>
                            {role.period}
                          </Text>
                        </Group>

                        <Stack gap={6}>
                          {role.bullets.map((b, j) => (
                            <Group key={j} gap={8} wrap="nowrap" align="flex-start">
                              <Text size="sm" c="dimmed" data-cursor-text>
                                ·
                              </Text>
                              <Text size="sm" c="dimmed" lh={1.6} data-cursor-text>
                                {b}
                              </Text>
                            </Group>
                          ))}
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Stack>
            ))}
          </Stack>
        </Box>
      ),
    },
  ];

  return (
    <Box
      ref={paneRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.5rem',
        padding: '2rem',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <MotionDiv
        whileHover={activeIndex > 0 ? { scale: 1.12 } : undefined}
        whileTap={activeIndex > 0 ? { scale: 0.96 } : undefined}
        transition={{ type: 'spring', stiffness: 320, damping: 20 }}
        style={{ flexShrink: 0 }}
      >
        <ActionIcon
          variant="gradient"
          gradient={blueGradient}
          size="2rem"
          radius="md"
          onClick={() => navigate(activeIndex - 1)}
          disabled={activeIndex === 0}
          aria-label="Previous"
        >
          <IconChevronLeft style={{ width: rem(22), height: rem(22) }} />
        </ActionIcon>
      </MotionDiv>

      {/* Padding + negative margin gives the window shadow room so overflow:hidden doesn't clip it */}
      <Box
        style={{
          flex: 1,
          maxWidth: 'calc(min(56.25rem, 76vw) + 7rem)',
          overflow: 'hidden',
          padding: '3.5rem',
          margin: '-3.5rem',
        }}
      >
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <MotionDiv
            key={activeIndex}
            custom={direction}
            variants={cardVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          >
            <TerminalCard>
              <Stack gap="lg" pt="md">
                <TypedPrompt text={files[activeIndex].prompt} active={inView} speed={100} />
                {files[activeIndex].content}
              </Stack>
            </TerminalCard>
          </MotionDiv>
        </AnimatePresence>
      </Box>

      <MotionDiv
        whileHover={activeIndex < files.length - 1 ? { scale: 1.12 } : undefined}
        whileTap={activeIndex < files.length - 1 ? { scale: 0.96 } : undefined}
        transition={{ type: 'spring', stiffness: 320, damping: 20 }}
        style={{ flexShrink: 0 }}
      >
        <ActionIcon
          variant="gradient"
          gradient={blueGradient}
          size="2rem"
          radius="md"
          onClick={() => navigate(activeIndex + 1)}
          disabled={activeIndex === files.length - 1}
          aria-label="Next"
        >
          <IconChevronRight style={{ width: rem(22), height: rem(22) }} />
        </ActionIcon>
      </MotionDiv>
    </Box>
  );
}

function AboutMachinePane() {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const paneRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(paneRef, { amount: 0.55 });

  return (
    <Box
      ref={paneRef}
      style={{
        width: '100%',
        height: '100%',
        background: 'var(--mantine-color-body)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <TuringTapeBackground machineRef={cardRef} />

      <MotionDiv
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 140, damping: 18 }}
        viewport={{ once: true, amount: 0.45 }}
        style={{ width: 'min(56.25rem, 92vw)', position: 'relative', zIndex: 1 }}
      >
        <TerminalCard ref={cardRef}>
          <Stack gap="lg" pt="md">
            <TypedPrompt text="> whoami" active={inView} />

            <Group align="center" wrap="nowrap" gap="xl">
              <Box miw={180} style={{ display: 'flex', justifyContent: 'center' }}>
                <Indicator
                  inline
                  size={16}
                  offset={8}
                  position="bottom-end"
                  color="teal"
                  withBorder
                  processing
                >
                  <Avatar src={picture_of_me} alt="David Mekhtiev" radius="xl" size={180} />
                </Indicator>
              </Box>

              <Stack gap="sm" flex={1}>
                <Title data-cursor-text order={2} fw={500}>
                  About me
                </Title>

                <Text data-cursor-text size="md" lh={1.8} c="dimmed">
                  Hi! My name is David, and I am a recent UMich CSE grad with over a year of industry experience. I am broadly interested in the research and development of performant, 
                  reliable, scalable, and maintainable software systems. Outside of the office, I enjoy music, reading, olympic weightlifting, and making occasionally decent art.
                </Text>
              </Stack>
            </Group>

            <Stack gap="sm" mt="sm">
              <Title order={4} fw={500} data-cursor-text>
                Programming Languages
              </Title>

              <Group gap="xs">
                <Pill style={pillStyle}>C</Pill>
                <Pill style={pillStyle}>C++</Pill>
                <Pill style={pillStyle}>CUDA</Pill>
                <Pill style={pillStyle}>Go</Pill>
                <Pill style={pillStyle}>JavaScript</Pill>
                <Pill style={pillStyle}>Python</Pill>
                <Pill style={pillStyle}>Rust</Pill>
                <Pill style={pillStyle}>SQL</Pill>
                <Pill style={pillStyle}>SystemVerilog</Pill>
                <Pill style={pillStyle}>TypeScript</Pill>
              </Group>
            </Stack>

            <Stack gap="sm" mt="sm">
              <Title order={4} fw={500} data-cursor-text>
                Expertise
              </Title>

              <Group gap="xs">
                <Pill style={pillStyle}>System Architecture</Pill>
                <Pill style={pillStyle}>Computer Architecture</Pill>
                <Pill style={pillStyle}>Theoretical Computer Science</Pill>
                <Pill style={pillStyle}>Machine Learning</Pill>
              </Group>
            </Stack>
          </Stack>
        </TerminalCard>
      </MotionDiv>
    </Box>
  );
}

// Keeps the scroller snapped to the current tile when its height changes (browser zoom,
// window resize). Browsers don't reliably re-snap, leaving the previous tile peeking in.
function useResnapOnResize(scrollerRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) {
      return;
    }

    let index = 0;
    // Height the current scroll offset was laid out against. Scroll events that fire mid-resize
    // still divide by the old height, so the tile index stays correct.
    let tileHeight = scroller.clientHeight;

    const onScroll = () => {
      index = Math.round(scroller.scrollTop / tileHeight);
    };

    const ro = new ResizeObserver(() => {
      tileHeight = scroller.clientHeight;
      scroller.scrollTo({ top: index * tileHeight, behavior: 'instant' });
    });

    scroller.addEventListener('scroll', onScroll, { passive: true });
    ro.observe(scroller);

    return () => {
      scroller.removeEventListener('scroll', onScroll);
      ro.disconnect();
    };
  }, [scrollerRef]);
}

export function About() {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  useResnapOnResize(scrollerRef);

  return (
    <Box
      ref={scrollerRef}
      style={{
        height: '100vh',
        overflowY: 'auto',
        scrollSnapType: 'y mandatory',
        scrollBehavior: 'smooth',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      <SnapTile>
        <Box
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            background: '#ffffff',
          }}
        >
          <VectorFieldBackground />

          <Box
            style={{
              position: 'relative',
              zIndex: 1,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Stack align="center" gap="0rem">
              <Title data-cursor-text className={classes.title} ta="center" mt={100} fw={500}>
                David Mekhtiev
              </Title>

              <Text
                data-cursor-text
                style={{
                  fontFamily: 'var(--mantine-font-family-monospace)',
                  lineHeight: 1.2,
                  paddingBottom: '0.1em',
                }}
                size="1.5rem"
                variant="gradient"
                gradient={blueGradient}
                fw={700}
              >
                Full time engineer. Part time tinkerer.
              </Text>

              <Space h="1rem" />

              <Group justify="space-between" align="center">
                <a
                  href="mailto:davidmek@umich.edu"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor-chip="Email"
                  style={{ display: 'inline-flex', color: 'inherit', textDecoration: 'none' }}
                >
                  <MotionDiv
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 20 }}
                    style={{ display: 'inline-flex' }}
                  >
                    <IconMail style={{ width: rem(42), height: rem(42) }} />
                  </MotionDiv>
                </a>

                <a
                  href="https://github.com/david-mek"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor-chip="GitHub"
                  style={{ display: 'inline-flex', color: 'inherit', textDecoration: 'none' }}
                >
                  <MotionDiv
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 20 }}
                    style={{ display: 'inline-flex' }}
                  >
                    <IconBrandGithub style={{ width: rem(42), height: rem(42) }} />
                  </MotionDiv>
                </a>

                <a
                  href="https://www.linkedin.com/in/david-mek/"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor-chip="LinkedIn"
                  style={{ display: 'inline-flex', color: 'inherit', textDecoration: 'none' }}
                >
                  <MotionDiv
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 20 }}
                    style={{ display: 'inline-flex' }}
                  >
                    <IconBrandLinkedin style={{ width: rem(42), height: rem(42) }} />
                  </MotionDiv>
                </a>

                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor-chip="Resume"
                  style={{ display: 'inline-flex', color: 'inherit', textDecoration: 'none' }}
                >
                  <MotionDiv
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 20 }}
                    style={{ display: 'inline-flex' }}
                  >
                    <IconFileDescription style={{ width: rem(42), height: rem(42) }} />
                  </MotionDiv>
                </a>
              </Group>
            </Stack>
          </Box>
        </Box>
      </SnapTile>

      <SnapTile>
        <AboutMachinePane />
      </SnapTile>

      <SnapTile>
        <Box
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
          }}
        >
          <GameOfLifeBackground />
          {/* <VantaNETBackground /> */}
          <FilesPane />
        </Box>
      </SnapTile>
    </Box>
  );
}
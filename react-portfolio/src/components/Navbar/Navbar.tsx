/*
    Authored by David Mekhtiev
    <davidmek@umich.edu>

    This defines the site navigation bar and utilizes the
    Mantine UI component library.
*/

// Core Mantine UI library components.
import {
  ActionIcon,
  Anchor,
  Box, 
  rem,
  Group,
  Button,
  Text,
  Container,
  useComputedColorScheme,
  useMantineColorScheme,
  HoverCard,
} from '@mantine/core'

// Icons
import {
  IconCode,
  IconMoonFilled,
  IconSunFilled
} from '@tabler/icons-react'

import { motion } from "framer-motion";

const MotionBox = motion.div;

// Client side navigation
import { useNavigate } from 'react-router-dom'
import { useIsMobile } from '@/hooks/useIsMobile'

// My custom gradients.
const crimsonGradient = { from: '#fe6969', to: '#C90016', deg: 90 };
const blueGradient = { from: '#2196f3', to: '#0d47a1', deg: 90 };
const lighterColor = '#2196f3';
const darkerColor = '#0d47a1';

// Tabler IconCode with gradient applied.
const GradientIconCode = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    style={{ width: rem(24), height: rem(24) }}
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="url(#blue-gradient)" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
  >   
    <defs>
      <linearGradient
        id="crimson-gradient"
        x1="0%"
        y1="0%"
        x2="100%"
        y2="100%"
        gradientUnits='userSpaceOnUse'
      >
        <stop offset="0%" stopColor='#fe6969'/>
        <stop offset="100%" stopColor='#C90016'/>
      </linearGradient>
      <linearGradient
        id="blue-gradient"
        x1="0%"
        y1="0%"
        x2="100%"
        y2="100%"
        gradientUnits='userSpaceOnUse'
      >
        <stop offset="0%" stopColor='#2196f3'/>
        <stop offset="100%" stopColor='#0d47a1'/>
      </linearGradient>
    </defs>
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M7 8l-4 4l4 4" />
    <path d="M17 8l4 4l-4 4" />
    <path d="M14 4l-4 16" />
  </svg>
);

export function Navbar() {
  // ----------------------------
  // |  CLIENT SIDE NAVIGATION  | 
  // ----------------------------
  const navigate = useNavigate();

  // ----------------------------
  // |       THEME TOGGLE       | 
  // ----------------------------
  // Starts on 'auto' (follows the system). The icon and toggle use the theme actually shown, so
  // in auto mode the icon is right and the first click always flips what you see; after that the
  // explicit choice is remembered.
  const { setColorScheme } = useMantineColorScheme();
  const colorScheme = useComputedColorScheme('light', { getInitialValueInEffect: false });
  const toggleColorScheme = () => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
  // On phones the pill spans the screen (minus a margin) with compact buttons, on one line.
  const isMobile = useIsMobile();

  // ----------------------------
  // |            UI            | 
  // ----------------------------
  return (
    <Box
      style={{
        position: 'fixed',
        top: rem(16),
        left: '50%',
        transform: 'translateX(-50%)',
        width: isMobile ? 'calc(100vw - 2rem)' : '50vw',
        zIndex: 1000,
      }}
    >
      <Container
        px={isMobile ? 'sm' : 'lg'}
        py="xs"
        style={{
          backdropFilter: `blur(${rem(10)})`,
          background:
            colorScheme === 'light'
              ? 'rgba(240, 240, 240, 0.5)'
              : 'rgba(17, 17, 17, 0.7)',
          borderRadius: rem(999),
          // crimson
          // border: '1px solid rgba(201, 0, 22, 0.6)',
          // boxShadow: '0 0 20px rgba(201, 0, 22, 0.6)',
          // blue
          border: `${rem(1)} solid ${lighterColor}`,
          boxShadow: `0 0 ${rem(20)} rgba(33, 150, 2243, 0.6)`
        }}
      >
        <Group justify="space-between" align="center" wrap="nowrap">

          {/* Logo */}
          <Group>
            <GradientIconCode/>
          </Group>

          {/* Navigation */}
          <Group gap={isMobile ? 0 : 's'} wrap="nowrap">
            <MotionBox
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <Button
                variant="subtle"
                onClick={() => navigate('/')}
                color={darkerColor}
                radius='lg'
                size={isMobile ? 'compact-md' : 'sm'}
              >
                <Text
                  variant="gradient"
                  gradient={blueGradient}
                  fw={600}
                >
                  About
                </Text>
              </Button>
            </MotionBox>

            <MotionBox
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <Button
                variant="subtle"
                onClick={() => navigate('/projects')}
                color={darkerColor}
                radius='lg'
                size={isMobile ? 'compact-md' : 'sm'}
              >
                <Text
                  variant="gradient"
                  gradient={blueGradient}
                  fw={600}
                >
                  Projects
                </Text>
              </Button>
            </MotionBox>

            <MotionBox
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <Button
                variant="subtle"
                onClick={() => navigate('/blog')}
                color={darkerColor}
                radius='lg'
                size={isMobile ? 'compact-md' : 'sm'}
              >
                <Text
                  variant="gradient"
                  gradient={blueGradient}
                  fw={600}
                >
                  Blog
                </Text>
              </Button>
            </MotionBox>
          </Group>

          {/* Theme toggle */}
          <Group>
            <ActionIcon
              variant="gradient"
              size="lg"
              radius="lg"
              onClick={() => toggleColorScheme()}
              gradient={blueGradient}
              aria-label={colorScheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {colorScheme === 'dark' ? (
                <IconSunFilled style={{ width: rem(18), height: rem(18) }} />
              ) : (
                <IconMoonFilled style={{ width: rem(18), height: rem(18) }} />
              )}
            </ActionIcon>
          </Group>

        </Group>
      </Container>
    </Box>
  );
}
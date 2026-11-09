import { useEffect, useState, type CSSProperties } from 'react';
import {
  ActionIcon,
  Button,
  Group,
  Popover,
  rem,
  SegmentedControl,
  Stack,
  Text,
} from '@mantine/core';
import { IconSettings } from '@tabler/icons-react';
import { motion } from 'motion/react';
import { blueGradient, lightColor } from '../Terminal/Terminal';
import terminalClasses from '../Terminal/Terminal.module.css';

// Reader-adjustable typography for blog posts, in the spirit of Wikipedia's "Appearance" menu.
// Choices are saved per browser and applied to the post body as CSS variables.

type FontId = 'sans' | 'serif' | 'mono';
type SizeId = 'sm' | 'md' | 'lg' | 'xl';
type SpacingId = 'compact' | 'standard' | 'relaxed';
type WidthId = 'narrow' | 'standard' | 'wide';

export type ReadingSettings = {
  font: FontId;
  size: SizeId;
  spacing: SpacingId;
  width: WidthId;
};

const DEFAULTS: ReadingSettings = { font: 'sans', size: 'md', spacing: 'standard', width: 'standard' };

const FONTS: Record<FontId, { label: string; family: string; scale: number }> = {
  sans: { label: 'Sans', family: 'var(--mantine-font-family)', scale: 1 },
  // Baskervville has a small x-height, so it's set a touch larger to read at the same size.
  serif: { label: 'Serif', family: "Baskervville, Georgia, 'Times New Roman', serif", scale: 1.12 },
  mono: { label: 'Mono', family: 'var(--mantine-font-family-monospace)', scale: 0.92 },
};
const SIZES: Record<SizeId, { label: string; rem: number }> = {
  sm: { label: 'Small', rem: 0.875 },
  md: { label: 'Standard', rem: 1 },
  lg: { label: 'Large', rem: 1.125 },
  xl: { label: 'X-Large', rem: 1.25 },
};
const SPACINGS: Record<SpacingId, { label: string; lineHeight: number }> = {
  compact: { label: 'Compact', lineHeight: 1.5 },
  standard: { label: 'Standard', lineHeight: 1.75 },
  relaxed: { label: 'Relaxed', lineHeight: 2 },
};
const WIDTHS: Record<WidthId, { label: string; px: number }> = {
  narrow: { label: 'Narrow', px: 620 },
  standard: { label: 'Standard', px: 760 },
  wide: { label: 'Wide', px: 960 },
};

const STORAGE_KEY = 'blog-reading-settings';

function load(): ReadingSettings {
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}');
    return {
      font: saved.font in FONTS ? saved.font : DEFAULTS.font,
      size: saved.size in SIZES ? saved.size : DEFAULTS.size,
      spacing: saved.spacing in SPACINGS ? saved.spacing : DEFAULTS.spacing,
      width: saved.width in WIDTHS ? saved.width : DEFAULTS.width,
    };
  } catch {
    return DEFAULTS;
  }
}

export function useReadingSettings() {
  const [settings, setSettings] = useState<ReadingSettings>(load);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Storage unavailable (private mode, blocked): settings just won't persist.
    }
  }, [settings]);

  return [settings, setSettings] as const;
}

// CSS variables consumed by .article / .prose in Blog.module.css.
export function readingStyle(s: ReadingSettings): CSSProperties {
  const font = FONTS[s.font];
  return {
    '--prose-font': font.family,
    '--prose-size': `${SIZES[s.size].rem * font.scale}rem`,
    '--prose-line-height': String(SPACINGS[s.spacing].lineHeight),
    '--prose-width': rem(WIDTHS[s.width].px),
  } as CSSProperties;
}

function Option<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: React.ReactNode }[];
  onChange: (value: T) => void;
}) {
  return (
    <Stack gap={6}>
      <Text ff="monospace" size="xs" fw={700} variant="gradient" gradient={blueGradient}>
        {label}
      </Text>
      <SegmentedControl
        fullWidth
        size="xs"
        radius="md"
        color={lightColor}
        // Mantine's dark track color matches the page background, so give it a faint tint.
        styles={{
          root: { background: 'light-dark(var(--mantine-color-gray-1), rgb(255 255 255 / 0.06))' },
        }}
        value={value}
        onChange={(v) => onChange(v as T)}
        data={options.map((o) => ({ value: o.value, label: o.label }))}
      />
    </Stack>
  );
}

const entries = <K extends string, V extends { label: string }>(record: Record<K, V>) =>
  (Object.keys(record) as K[]).map((value) => ({ value, label: record[value].label }));

export function ReadingSettingsButton({
  settings,
  onChange,
}: {
  settings: ReadingSettings;
  onChange: (next: ReadingSettings) => void;
}) {
  const [opened, setOpened] = useState(false);
  const set = <K extends keyof ReadingSettings>(key: K, value: ReadingSettings[K]) =>
    onChange({ ...settings, [key]: value });

  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      position="top-end"
      // The cog is position: fixed, so the panel is too; it stays put while the post scrolls.
      floatingStrategy="fixed"
      offset={12}
      radius={12}
      shadow="none"
      width={rem(320)}
      zIndex={950}
      // Fade only: a scaling transition makes SegmentedControl measure its options mid-animation
      // and misplace the selection indicator.
      transitionProps={{ transition: 'fade', duration: 150 }}
    >
      <Popover.Target>
        <motion.div
          style={{
            position: 'fixed',
            right: rem(24),
            bottom: `calc(${rem(24)} + env(safe-area-inset-bottom, 0px))`,
            zIndex: 950,
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 18 }}
        >
          <ActionIcon
            variant="gradient"
            gradient={blueGradient}
            size={rem(34)}
            radius="md"
            onClick={() => setOpened((o) => !o)}
            aria-label="Reading settings"
            aria-expanded={opened}
          >
            <IconSettings style={{ width: rem(24), height: rem(24) }} />
          </ActionIcon>
        </motion.div>
      </Popover.Target>

      <Popover.Dropdown
        className={terminalClasses.window}
        p="md"
        style={{
          background: 'var(--mantine-color-body)',
          border: 'none',
          maxWidth: 'calc(100vw - 2rem)',
        }}
      >
        <Stack gap="md">
          <Text ff="monospace" size="sm" c="dimmed">
            &gt; reading settings
          </Text>
          <Option
            label="font"
            value={settings.font}
            onChange={(v) => set('font', v)}
            options={(Object.keys(FONTS) as FontId[]).map((id) => ({
              value: id,
              // Each option is shown in its own typeface.
              label: <span style={{ fontFamily: FONTS[id].family }}>{FONTS[id].label}</span>,
            }))}
          />
          <Option label="size" value={settings.size} onChange={(v) => set('size', v)} options={entries(SIZES)} />
          <Option
            label="spacing"
            value={settings.spacing}
            onChange={(v) => set('spacing', v)}
            options={entries(SPACINGS)}
          />
          <Option label="width" value={settings.width} onChange={(v) => set('width', v)} options={entries(WIDTHS)} />
          <Group justify="flex-end">
            <Button
              variant="subtle"
              color={lightColor}
              size="compact-sm"
              ff="monospace"
              onClick={() => onChange(DEFAULTS)}
            >
              reset
            </Button>
          </Group>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}

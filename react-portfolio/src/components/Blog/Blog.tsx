import { Badge, Box, Group, Stack, Text, Title, UnstyledButton } from '@mantine/core';
import { useNavigate, useParams } from 'react-router-dom';
import { formatDate, getPost, POSTS, type PostMeta } from '@/blog/posts';
import { blueGradient, TerminalCard, TypedPrompt } from '../Terminal/Terminal';
import { Markdown } from './Markdown';
import { readingStyle, ReadingSettingsButton, useReadingSettings } from './ReadingSettings';
import classes from './Blog.module.css';

function PostMetaLine({ post }: { post: PostMeta }) {
  return (
    <Group gap="xs" wrap="wrap">
      <Text size="sm" c="dimmed" fs="italic" data-cursor-text>
        {formatDate(post.date)} · {post.readingMinutes} min read
      </Text>
      {post.draft && (
        <Badge size="sm" variant="light" color="yellow" ff="monospace">
          draft
        </Badge>
      )}
    </Group>
  );
}

function Tags({ tags }: { tags: string[] }) {
  if (!tags.length) {
    return null;
  }
  return (
    <Group gap={6}>
      {tags.map((t) => (
        <Text key={t} ff="monospace" size="xs" fw={700} variant="gradient" gradient={blueGradient}>
          #{t}
        </Text>
      ))}
    </Group>
  );
}

export function BlogIndex() {
  const navigate = useNavigate();

  return (
    <Box className={classes.page}>
      <Box className={classes.content}>
        <Stack gap="xs" mb="xl">
          <TypedPrompt text="> ls ~/blog" active speed={45} />
          <Title order={1} fw={500} data-cursor-text>
            Blog
          </Title>
          <Text c="dimmed" data-cursor-text>
            Some thoughts and opinions on things.
          </Text>
        </Stack>

        {POSTS.length === 0 ? (
          <Text
            ff="monospace"
            size="1.5rem"
            fw={700}
            variant="gradient"
            gradient={blueGradient}
            mt="xl"
            data-cursor-text
          >
            Coming soon.
          </Text>
        ) : (
          <Stack gap="lg">
            {POSTS.map((post) => (
              // The whole card is the link target; the custom cursor wraps it like a button.
              <UnstyledButton
                key={post.slug}
                onClick={() => navigate(`/blog/${post.slug}`)}
                aria-label={post.title}
                style={{ display: 'block', width: '100%', textAlign: 'left' }}
              >
                <TerminalCard p="lg" withTrafficLights={false}>
                  <Stack gap="xs">
                    <Text ff="monospace" size="xs" c="dimmed">
                      ~/blog/{post.slug}.md
                    </Text>
                    <Title order={3} fw={600} lh={1.3}>
                      {post.title}
                    </Title>
                    <PostMetaLine post={post} />
                    {post.summary && (
                      <Text size="sm" c="dimmed" lh={1.6}>
                        {post.summary}
                      </Text>
                    )}
                    <Tags tags={post.tags} />
                  </Stack>
                </TerminalCard>
              </UnstyledButton>
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
}

export function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = getPost(slug);
  const [settings, setSettings] = useReadingSettings();

  return (
    <Box className={classes.page}>
      {/* The post sits directly on the page background; readers adjust the type via the cog. */}
      <Box component="article" className={classes.article} style={readingStyle(settings)}>
        <UnstyledButton onClick={() => navigate('/blog')} mb="md">
          <Text ff="monospace" size="sm" c="dimmed">
            ← cd ~/blog
          </Text>
        </UnstyledButton>

        <Box>
          {post ? (
            <Stack gap="md">
              <TypedPrompt text={`> cat ~/blog/${post.slug}.md`} active speed={35} />
              <Title order={1} fw={600} lh={1.2} data-cursor-text>
                {post.title}
              </Title>
              <PostMetaLine post={post} />
              <Tags tags={post.tags} />
              <Box style={{ height: 1, background: 'currentColor', opacity: 0.12 }} />
              <Markdown post={post} />
            </Stack>
          ) : (
            <Stack gap="md">
              <TypedPrompt text={`> cat ~/blog/${slug}.md`} active speed={35} />
              <Text ff="monospace" c="dimmed">
                cat: {slug}.md: No such file or directory
              </Text>
            </Stack>
          )}
        </Box>
      </Box>
      {post && <ReadingSettingsButton settings={settings} onChange={setSettings} />}
    </Box>
  );
}

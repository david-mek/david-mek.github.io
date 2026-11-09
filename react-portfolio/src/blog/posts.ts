/*
  Blog posts are plain Markdown files under src/content/blog/, collected at build time:

    src/content/blog/my-post.md            → /blog/my-post
    src/content/blog/my-post/index.md      → /blog/my-post   (folder form, for posts with images)

  Files and folders starting with "_" are ignored (see _template.md for the format).
  Images referenced with relative paths (e.g. ./diagram.png) resolve against the post's folder.
*/

export type PostMeta = {
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD
  summary: string;
  tags: string[];
  draft: boolean;
  readingMinutes: number;
};

export type Post = PostMeta & {
  body: string;
  // Directory of the Markdown file, used to resolve relative image paths.
  dir: string;
};

const sources = import.meta.glob('../content/blog/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

// Every image under the blog folder, bundled and mapped to its final URL.
const images = import.meta.glob('../content/blog/**/*.{png,jpg,jpeg,gif,svg,webp,avif}', {
  query: '?url',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const ROOT = '../content/blog/';

// Minimal front matter: `key: value` lines, `[a, b]` lists, true/false, optional quotes.
function parseFrontMatter(raw: string): { data: Record<string, unknown>; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
  if (!match) {
    return { data: {}, body: raw };
  }
  const data: Record<string, unknown> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = /^([A-Za-z_][\w-]*)\s*:\s*(.*)$/.exec(line.trim());
    if (!kv) {
      continue;
    }
    const [, key, rawValue] = kv;
    const value = rawValue.trim();
    const unquote = (v: string) => v.replace(/^(['"])(.*)\1$/, '$2');
    if (value.startsWith('[') && value.endsWith(']')) {
      data[key] = value
        .slice(1, -1)
        .split(',')
        .map((v) => unquote(v.trim()))
        .filter(Boolean);
    } else if (value === 'true' || value === 'false') {
      data[key] = value === 'true';
    } else {
      data[key] = unquote(value);
    }
  }
  return { data, body: raw.slice(match[0].length) };
}

function slugFor(path: string) {
  const rel = path.slice(ROOT.length).replace(/\.md$/, '');
  return rel.endsWith('/index') ? rel.slice(0, -'/index'.length) : rel;
}

const isIgnored = (path: string) =>
  path
    .slice(ROOT.length)
    .split('/')
    .some((part) => part.startsWith('_'));

const allPosts: Post[] = Object.entries(sources)
  .filter(([path]) => !isIgnored(path))
  .map(([path, raw]) => {
    const { data, body } = parseFrontMatter(raw);
    const slug = slugFor(path);
    const words = body.split(/\s+/).filter(Boolean).length;
    return {
      slug,
      title: String(data.title ?? slug),
      date: String(data.date ?? ''),
      summary: String(data.summary ?? ''),
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      draft: data.draft === true,
      readingMinutes: Math.max(1, Math.round(words / 230)),
      body,
      dir: path.slice(0, path.lastIndexOf('/') + 1),
    };
  });

// Drafts show up in `npm run dev` but never in the deployed site.
export const POSTS: Post[] = allPosts
  .filter((p) => import.meta.env.DEV || !p.draft)
  .sort((a, b) => b.date.localeCompare(a.date));

export function getPost(slug: string | undefined) {
  return POSTS.find((p) => p.slug === slug);
}

// Resolves an image src from Markdown: absolute URLs pass through; relative paths are looked up
// among the bundled images, relative to the post's folder.
export function resolveImage(post: Post, src: string | undefined) {
  if (!src || /^(https?:)?\/\//.test(src) || src.startsWith('/') || src.startsWith('data:')) {
    return src;
  }
  // post.dir looks like "../content/blog/my-post/"; normalize "./" and "../" segments in src
  // against "content/blog/my-post/", then restore the glob keys' leading "../".
  const stack = post.dir.slice('../'.length).split('/').filter(Boolean);
  for (const part of src.split('/')) {
    if (part === '..') {
      stack.pop();
    } else if (part && part !== '.') {
      stack.push(part);
    }
  }
  return images[`../${stack.join('/')}`] ?? src;
}

export function formatDate(date: string) {
  const d = new Date(`${date}T00:00:00`);
  return Number.isNaN(d.getTime())
    ? date
    : d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

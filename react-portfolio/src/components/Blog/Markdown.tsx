import { Anchor, Title, type TitleOrder } from '@mantine/core';
import ReactMarkdown, { type Components } from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import 'katex/dist/katex.min.css';
import { resolveImage, type Post } from '@/blog/posts';
import { lightColor } from '../Terminal/Terminal';
import classes from './Blog.module.css';

// Renders a post's Markdown: GitHub-flavored Markdown (tables, task lists, footnotes,
// strikethrough), LaTeX via $inline$ / $$display$$ (KaTeX), and images relative to the post.
export function Markdown({ post }: { post: Post }) {
  // Overrides keep id/className (footnote anchors and the screen-reader-only "Footnotes" heading
  // rely on them).
  const heading =
    (order: TitleOrder) =>
    ({ children, id, className }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <Title order={order} id={id} className={className} fw={600} mt="xl" mb="sm" data-cursor-text>
        {children}
      </Title>
    );

  const components: Components = {
    // The post title is the page's h1, so Markdown headings start one level down.
    h1: heading(2),
    h2: heading(2),
    h3: heading(3),
    h4: heading(4),
    h5: heading(5),
    h6: heading(6),
    // A paragraph holding only an image renders as a bare <figure> (a figure can't sit in a <p>).
    p: ({ node, children }) => {
      const kids = node?.children ?? [];
      const onlyImage =
        kids.length === 1 && kids[0].type === 'element' && kids[0].tagName === 'img';
      return onlyImage ? <>{children}</> : <p data-cursor-text>{children}</p>;
    },
    li: ({ node: _node, children, ...props }) => (
      <li {...props} data-cursor-text>
        {children}
      </li>
    ),
    a: ({ node: _node, href, children, ...props }) => {
      const external = !!href && /^https?:\/\//.test(href);
      return (
        <Anchor
          {...props}
          href={href}
          c={lightColor}
          underline="hover"
          inherit
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {children}
        </Anchor>
      );
    },
    // ![alt](./image.png "Optional caption")
    img: ({ src, alt, title }) => {
      const url = resolveImage(post, typeof src === 'string' ? src : undefined);
      return (
        <figure>
          <img src={url} alt={alt ?? ''} loading="lazy" />
          {title && <figcaption>{title}</figcaption>}
        </figure>
      );
    },
  };

  return (
    <div className={classes.prose}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={components}
      >
        {post.body}
      </ReactMarkdown>
    </div>
  );
}

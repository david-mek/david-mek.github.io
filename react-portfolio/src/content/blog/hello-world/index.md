---
title: Hello, world
date: 2026-10-16
summary: A sample post showing what the blog supports — images, LaTeX, code, and tables. It's a draft, so it only appears on the dev server.
tags: [meta, architecture]
draft: true
---

This is a sample post. It's marked `draft: true`, so it shows up in `npm run dev` but never on the
deployed site. Delete it, or flip `draft` to `false`, whenever you like.

## Images

Images live next to the post and are referenced relatively. The text in quotes becomes a caption:

![Five pipeline stages, left to right](./pipeline.svg "The classic five-stage pipeline.")

## LaTeX

Inline math sits in the sentence: an ideal $k$-stage pipeline approaches a speedup of $k$, since
$T_{\text{pipelined}} \approx \frac{T_{\text{single}}}{k}$ once it's full.

Display math gets its own line:

$$
\text{Speedup}(n) = \frac{n \cdot k}{k + (n - 1)} \xrightarrow{\;n \to \infty\;} k
$$

## Code

Inline `code`, or fenced blocks:

```c
for (int i = 0; i < n; i++) {
    sum += a[i] * b[i];
}
```

## Tables and more

| Stage | Does                    |
| ----- | ----------------------- |
| IF    | Fetch the instruction   |
| EX    | Execute / compute addr. |
| WB    | Write the result back   |

> Quotes, ~~strikethrough~~, task lists, and footnotes[^1] work too.

- [x] Markdown
- [x] Images
- [x] LaTeX

[^1]: Like this one.

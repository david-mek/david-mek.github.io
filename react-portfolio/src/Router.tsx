import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { AboutPage } from './pages/About.page';
import { ProjectsPage } from './pages/Projects.page';

// The blog pulls in Markdown + KaTeX, so it's split out and only loaded when visited.
const BlogPage = lazy(() => import('./pages/Blog.page').then((m) => ({ default: m.BlogPage })));
const BlogPostPage = lazy(() =>
  import('./pages/BlogPost.page').then((m) => ({ default: m.BlogPostPage }))
);

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <AboutPage />,
      },
      {
        path: '/projects',
        element: <ProjectsPage />,
      },
      {
        path: '/blog',
        element: (
          <Suspense fallback={null}>
            <BlogPage />
          </Suspense>
        ),
      },
      {
        path: '/blog/:slug',
        element: (
          <Suspense fallback={null}>
            <BlogPostPage />
          </Suspense>
        ),
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}

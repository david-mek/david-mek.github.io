import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { AboutPage } from './pages/About.page';
import { BlogPage } from './pages/Blog.page';
import { ProjectsPage } from './pages/Projects.page';

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
        element: <BlogPage />,
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}

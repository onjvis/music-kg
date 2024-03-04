import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { AppRoute } from './models/enums/app-route.enum';
import Auth from './pages/auth/auth';
import Home from './pages/home';
import './styles.css';

const router = createBrowserRouter([
  {
    path: AppRoute.HOME,
    element: <Home />,
    children: [
      {
        path: AppRoute.AUTH,
        element: <Auth />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

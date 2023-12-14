import React from 'react';
import ReactDOM from "react-dom/client";
import ErrorPage from "./Error";
import Connexion from './Connexion';
import Register from './Register';
import LoginPage from './LoginPage';
import EventsListPage from './EventsListPage';
import EventDetailsPage from './EventDetailsPage';
import { Link } from "react-router-dom";


import {
    createBrowserRouter,
    RouterProvider,
  } from "react-router-dom";

  export default function (props) {
    const router = createBrowserRouter([
      
        {
          path: "/",
          element:<EventsListPage />,
          errorElement: <ErrorPage />
        },

        {
          path: "/connexion",
          element:<LoginPage />,
          errorElement: <ErrorPage />
        },

        {
          path: "/events",
          element:<EventsListPage />,
          errorElement: <ErrorPage />
        },
        {
          path: "/event/:eventId",
          element:<EventDetailsPage />,
          errorElement: <ErrorPage />
        },
        {
          path: "/register",
          element: <Register />,
          errorElement: <ErrorPage />
        },
      ]);

  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  )
}

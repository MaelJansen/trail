import React from 'react';
import ReactDOM from "react-dom/client";
import ErrorPage from "./Error";
import Connexion from './Connexion';
import LoginPage from './LoginPage';
import EventsListPage from './EventsListPage';
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

      ]);

  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  )
}

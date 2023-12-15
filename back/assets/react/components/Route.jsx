import React from 'react';
import ReactDOM from "react-dom/client";
import ErrorPage from "./Error";
import Login from './Login';
import RegisterPage from './RegisterPage';
import LoginPage from './LoginPage';
import EventsListPage from './EventsListPage';
import EventDetailsPage from './EventDetailsPage';
import RaceDetailsPage from './RaceDetailsPage';
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
          path: "/race/:raceId",
          element:<RaceDetailsPage />,
          errorElement: <ErrorPage />
        },

        {
          path: "/register",
          element: <RegisterPage />,
          errorElement: <ErrorPage />
        },
      ]);

  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  )
}

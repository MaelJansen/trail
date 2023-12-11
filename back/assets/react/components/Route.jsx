import React from 'react';
import ReactDOM from "react-dom/client";
import ErrorPage from "./Error";
import Connexion from './Connexion';
import Register from './Register';
import LoginPage from './LoginPage';
import Home from './Home'
import { Link } from "react-router-dom";


import {
    createBrowserRouter,
    RouterProvider,
  } from "react-router-dom";

  export default function (props) {
    const router = createBrowserRouter([
      
        {
          path: "/",
          element:<LoginPage />,
          errorElement: <ErrorPage />
        },
        {
          path: "/home",
          element:<Home />,
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

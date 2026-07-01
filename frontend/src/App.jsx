import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/login/Login";
import Register from "./pages/Register/Register";
import Archive from "./pages/Archive/Archive";
import Trash from "./pages/Trash/Trash";
import Reminders from "./pages/Reminders/Reminders";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./components/Toast";

function App() {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/archive",
          element: <Archive />,
        },
        {
          path: "/trash",
          element: <Trash />,
        },
        {
          path: "/reminders",
          element: <Reminders />,
        },
      ],
    },
  ]);

  return (
    <AuthProvider>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;

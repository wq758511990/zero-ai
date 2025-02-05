import LayoutPage from "@/components/Layout";
import Chat from "@/views/Chat";
import Index from "@/views/Index";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutPage />,
    children: [
      {
        path: "",
        element: <Index />,
      },
      {
        path: "chat",
        element: <Chat />,
      },
    ],
  },
]);

export const RouterDom = () => {
  return (
    <RouterProvider router={router} fallbackElement={<div>loading...</div>} />
  );
};

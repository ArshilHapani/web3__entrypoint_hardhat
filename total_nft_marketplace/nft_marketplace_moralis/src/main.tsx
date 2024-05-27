import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MoralisProvider } from "react-moralis";

import App from "./App.tsx";
import SellNFTPage from "./pages/SellNFT.tsx";

import "./index.css";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  {
    path: "/sellNFT",
    element: <SellNFTPage />,
  },
]);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MoralisProvider initializeOnMount={false}>
      <RouterProvider router={router} />
    </MoralisProvider>
  </React.StrictMode>
);
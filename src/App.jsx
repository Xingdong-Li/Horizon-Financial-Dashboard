import Login from "./pages/Login";

import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
//import Dashboard from "./pages/Dashboard";
import Loader from "./components/Utils/Loader";

import NotFoundPage from "./pages/NotFoundPage";

import "leaflet/dist/leaflet.css";

import Documents from "./pages/Documents";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import Sidebar from "./components/general/Sidebar";
import useAuth from "./hooks/useAuth";
import Home from "./pages/Home";
import MyBanks from "./pages/MyBank";
import TransactionHistory from "./pages/TransactionHistory";
import Visualization from "./pages/Visualization";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30000 },
  },
});

function App() {
  const { attributes: user, loading: authLoading } = useAuth();

  if (authLoading) return <Loader />;

  return (
    <>
      {user ? (
        <BrowserRouter>
          <Sidebar />
          <div className="lg:pl-64">
            <main className="mx-auto px-6">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route
                  path="/my-banks"
                  element={<MyBanks />}
                />
                <Route
                  path="/transaction-history"
                  element={<TransactionHistory />}
                />
                <Route path="/visualization" element={<Visualization />} />
                <Route path="/documents">
                  <Route
                    index
                    element={
                      <>
                        <ChakraProvider>
                          <QueryClientProvider client={queryClient}>
                            <Documents />
                          </QueryClientProvider>
                        </ChakraProvider>
                      </>
                    }
                  />
                  <Route path="*" element={<Navigate to="/documents" />} />
                </Route>
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      ) : (
        <Login />
      )}
    </>
  );
}

export default App;

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Chat from './pages/Chat';
import Monitoreo from './pages/Monitoreo';
import ExperienciaVR from './pages/ExperienciaVR';
import Recursos from './pages/Recursos';
import DetalleRecurso from './pages/DetalleRecurso';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* ───── Publicas (sin layout) ───── */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/registro"
              element={
                <PublicRoute>
                  <Registro />
                </PublicRoute>
              }
            />

            {/* ───── Protegidas (con layout) ───── */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Chat />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/vr"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ExperienciaVR />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/monitoreo"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Monitoreo />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* ───── Publicas con layout (recursos) ───── */}
            <Route
              path="/recursos"
              element={
                <Layout>
                  <Recursos />
                </Layout>
              }
            />
            <Route
              path="/recursos/:id"
              element={
                <Layout>
                  <DetalleRecurso />
                </Layout>
              }
            />

            {/* ───── Root y 404 ───── */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

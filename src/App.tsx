import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/ui/Toast';
import { useLenis } from './hooks/useLenis';
import { Navbar } from './components/ui/Navbar';
import { CommandPalette } from './components/ui/CommandPalette';
import { FooterSection } from './components/sections/FooterSection';
import { HomePage } from './pages/HomePage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { fetchProfile, fetchProjects } from './api/client';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes cache
      retry: 1,
    },
  },
});

function AppContent() {
  useLenis();

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => fetchProjects(),
  });

  return (
    <div className="relative min-h-screen bg-bg text-text-primary selection:bg-primary selection:text-white flex flex-col justify-between dot-grid-bg">
      {/* Soft Static Ambient Mesh Gradient Blobs */}
      <div className="ambient-blobs" aria-hidden="true">
        <div className="ambient-blob-1" />
        <div className="ambient-blob-2" />
        <div className="ambient-blob-3" />
      </div>

      {/* Floating Navbar */}
      {profile && (
        <Navbar
          profile={profile}
          onOpenCommandPalette={() => {
            const event = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true });
            window.dispatchEvent(event);
          }}
        />
      )}

      {/* Command Palette */}
      <CommandPalette projects={projects} resumeUrl={profile?.resumeUrl} />

      {/* Main Semantic Landmark */}
      <main id="main-content" className="flex-grow relative z-10">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects/:slug" element={<ProjectDetailPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Footer Landmark */}
      {profile && <FooterSection profile={profile} />}
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ToastProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

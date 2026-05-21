import { Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated } from './services/auth';
import LandingPage from './pages/LandingPage';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import TopTracksPage from './pages/TopTracksPage';
import TopArtistsPage from './pages/TopArtistsPage';
import GenresPage from './pages/GenresPage';
import MoodPage from './pages/MoodPage';
import HeatmapPage from './pages/HeatmapPage';
import PersonalityCardPage from './pages/PersonalityCardPage';

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="tracks" element={<TopTracksPage />} />
        <Route path="artists" element={<TopArtistsPage />} />
        <Route path="genres" element={<GenresPage />} />
        <Route path="mood" element={<MoodPage />} />
        <Route path="heatmap" element={<HeatmapPage />} />
        <Route path="personality" element={<PersonalityCardPage />} />
      </Route>
      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

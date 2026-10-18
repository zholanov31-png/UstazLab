import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import { PageLoading } from './components/ui';
import Landing from './pages/Landing';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import Assessment from './pages/Assessment';
import Modules from './pages/Modules';
import ModuleRun from './pages/ModuleRun';
import Methodology from './pages/Methodology';
import Sources from './pages/Sources';
import Methods from './pages/Methods';
import Gamification from './pages/Gamification';
import CaseStudy from './pages/CaseStudy';
import Visuals from './pages/Visuals';
import Literature from './pages/Literature';
import Research from './pages/Research';
import NotFound from './pages/NotFound';

function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <PageLoading />;
  if (!user) return <Navigate to="/auth" replace />;
  return children;
}

function RequireResearcher({ children }) {
  const { isResearcher, profile } = useAuth();
  if (!profile) return <PageLoading />;
  if (!isResearcher) return <Navigate to="/app" replace />;
  return children;
}

function PublicOnly({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <PageLoading />;
  if (user) return <Navigate to="/app" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicOnly><Landing /></PublicOnly>} />
      <Route path="/auth" element={<PublicOnly><AuthPage /></PublicOnly>} />

      <Route path="/app" element={<RequireAuth><Layout /></RequireAuth>}>
        <Route index element={<Dashboard />} />
        <Route path="assessment/:kind" element={<Assessment />} />
        <Route path="modules" element={<Modules />} />
        <Route path="modules/:moduleId" element={<ModuleRun />} />
        <Route path="methodology" element={<Methodology />} />
        <Route path="sources" element={<Sources />} />
        <Route path="methods" element={<Methods />} />
        <Route path="gamification" element={<Gamification />} />
        <Route path="case-study" element={<CaseStudy />} />
        <Route path="visuals" element={<Visuals />} />
        <Route path="literature" element={<Literature />} />
        <Route path="research" element={<RequireResearcher><Research /></RequireResearcher>} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

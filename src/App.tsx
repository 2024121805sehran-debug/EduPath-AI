import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { Footer } from './components/layout/Footer';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { SubjectsPage } from './pages/SubjectsPage';
import { SubjectDetailPage } from './pages/SubjectDetailPage';
import { TopicDetailPage } from './pages/TopicDetailPage';
import { QuizPage } from './pages/QuizPage';
import { CodingListPage } from './pages/CodingListPage';
import { CodingDetailPage } from './pages/CodingDetailPage';
import { ProgressPage } from './pages/ProgressPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { AITutorPage } from './pages/AITutorPage';
import { ProfilePage } from './pages/ProfilePage';
import { FloatingAITutor } from './components/ai/FloatingAITutor';

const AppLayout: React.FC = () => {
  const location = useLocation();

  const isFullWidthPage = location.pathname === '/' || location.pathname === '/onboarding' || location.pathname === '/auth';

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-white selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <div className="flex-1 flex w-full max-w-7xl mx-auto">
        {!isFullWidthPage && <Sidebar />}

        <main className={`flex-1 ${isFullWidthPage ? 'w-full' : 'p-4 sm:p-6 lg:p-8 max-w-full overflow-x-hidden'}`}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/subjects" element={<ProtectedRoute><SubjectsPage /></ProtectedRoute>} />
            <Route path="/subjects/:subjectId" element={<ProtectedRoute><SubjectDetailPage /></ProtectedRoute>} />
            <Route path="/subjects/:subjectId/topics/:topicId" element={<ProtectedRoute><TopicDetailPage /></ProtectedRoute>} />
            <Route path="/quiz/:quizId" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
            <Route path="/coding" element={<ProtectedRoute><CodingListPage /></ProtectedRoute>} />
            <Route path="/coding/:problemId" element={<ProtectedRoute><CodingDetailPage /></ProtectedRoute>} />
            <Route path="/progress" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
            <Route path="/achievements" element={<ProtectedRoute><AchievementsPage /></ProtectedRoute>} />
            <Route path="/ai-tutor" element={<ProtectedRoute><AITutorPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>

      {!isFullWidthPage && <FloatingAITutor />}
      {!isFullWidthPage && <MobileNav />}
      {isFullWidthPage && <Footer />}
    </div>
  );
};

export function App() {
  return (
    <UserProvider>
      <Router>
        <AppLayout />
      </Router>
    </UserProvider>
  );
}

export default App;


import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import RoleplayChat from './pages/RoleplayChat';
import VocabBuilder from './pages/VocabBuilder';
import GrammarCoach from './pages/GrammarCoach';
import Leaderboard from './pages/Leaderboard';
import VideoLearning from './pages/VideoLearning';
import GrammarGalaxy from './pages/GrammarGalaxy';
import BossBattle from './pages/BossBattle';
import MascotTalk from './pages/MascotTalk'; 
import MascotChat from './pages/MascotChat';
import SpeedRacer from './pages/SpeedRacer';
import WordWhack from './pages/WordWhack';
import Premium from './pages/Premium';
import BadgeTrading from './pages/BadgeTrading';
import AdminPanel from './pages/AdminPanel';
import UserProfileView from './pages/UserProfileView';
import Login from './pages/Login';
import { GamificationProvider, useGamification } from './context/GamificationContext';

// Auth Wrapper Component
const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userId } = useGamification();
  
  if (!userId) {
    return <Login />;
  }
  
  return <Layout>{children}</Layout>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthWrapper><Dashboard /></AuthWrapper>} />
      <Route path="/roleplay" element={<AuthWrapper><RoleplayChat /></AuthWrapper>} />
      <Route path="/talk" element={<AuthWrapper><MascotTalk /></AuthWrapper>} />
      <Route path="/talk/:id" element={<AuthWrapper><MascotChat /></AuthWrapper>} />
      <Route path="/vocab" element={<AuthWrapper><VocabBuilder /></AuthWrapper>} />
      <Route path="/grammar" element={<AuthWrapper><GrammarCoach /></AuthWrapper>} />
      <Route path="/videos" element={<AuthWrapper><VideoLearning /></AuthWrapper>} />
      <Route path="/leaderboard" element={<AuthWrapper><Leaderboard /></AuthWrapper>} />
      <Route path="/profile/:userId" element={<AuthWrapper><UserProfileView /></AuthWrapper>} />
      <Route path="/trading" element={<AuthWrapper><BadgeTrading /></AuthWrapper>} />
      <Route path="/premium" element={<AuthWrapper><Premium /></AuthWrapper>} />
      <Route path="/admin" element={<AuthWrapper><AdminPanel /></AuthWrapper>} />
      
      {/* Game Routes */}
      <Route path="/game/galaxy" element={<AuthWrapper><GrammarGalaxy /></AuthWrapper>} />
      <Route path="/game/boss" element={<AuthWrapper><BossBattle /></AuthWrapper>} />
      <Route path="/game/racer" element={<AuthWrapper><SpeedRacer /></AuthWrapper>} />
      <Route path="/game/whack" element={<AuthWrapper><WordWhack /></AuthWrapper>} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <GamificationProvider>
      <Router>
        <AppRoutes />
      </Router>
    </GamificationProvider>
  );
};

export default App;

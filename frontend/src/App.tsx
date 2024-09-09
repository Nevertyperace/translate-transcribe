import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home';
import Profile from './pages/profile';
import Register from './pages/register';
import LoginForm from './pages/login';
import TranscribeAudio from './pages/transcribe_audio';
import TranslateText from './pages/translate_text';
import Welcome from './pages/welcome';
import { GlobalStyle } from './styles/GlobalStyle';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const PrivateRoute: React.FC<{ path: string, element: React.ReactNode }> = ({ path, element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{element}</> : <Navigate to="/" replace />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <GlobalStyle />
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/home" element={<PrivateRoute path="/home" element={<Home />} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/profile" element={<PrivateRoute path="/profile" element={<Profile />} />} />
          <Route path="/transcribe_audio" element={<PrivateRoute path="/transcribe_audio" element={<TranscribeAudio />} />} />
          <Route path="/translate_text" element={<PrivateRoute path="/translate_text" element={<TranslateText />} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

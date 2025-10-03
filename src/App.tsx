import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Landing from './pages/Landing';
import Assessment, { AssessmentData } from './pages/Assessment';
import Dashboard from './pages/Dashboard';
import Results from './pages/Results';

function App() {
  const [currentCandidate, setCurrentCandidate] = useState<AssessmentData | null>(null);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Header />
        <Routes>
          <Route path="/" element={<Landing />} />
          {/* Main Assessment Route */}
          <Route
            path="/assessment/*"
            element={<Assessment onComplete={setCurrentCandidate} />}
          />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/results"
            element={
              currentCandidate ? (
                <Results candidate={currentCandidate} />
              ) : (
                <Navigate to="/assessment/resume" />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

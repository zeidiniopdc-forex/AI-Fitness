import { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Welcome from './pages/Welcome';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import PromptGenerator from './pages/PromptGenerator';
import ProgramImport from './pages/ProgramImport';
import Nutrition from './pages/Nutrition';
import NutritionImport from './pages/NutritionImport';
import Supplements from './pages/Supplements';
import SupplementImport from './pages/SupplementImport';
import WorkoutTracker from './pages/WorkoutTracker';
import CalendarPage from './pages/Calendar';
import Progress from './pages/Progress';

function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  const continueToApp = () => {
    setShowWelcome(false);
  };

  return (
    <ThemeProvider>
      <AppProvider>
        <HashRouter>
          {showWelcome ? <Welcome onContinue={continueToApp} /> : (
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/prompt" element={<PromptGenerator />} />
                <Route path="/import" element={<ProgramImport />} />
                <Route path="/nutrition" element={<Nutrition />} />
                <Route path="/nutrition-import" element={<NutritionImport />} />
                <Route path="/supplements" element={<Supplements />} />
                <Route path="/supplement-import" element={<SupplementImport />} />
                <Route path="/workout" element={<WorkoutTracker />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/progress" element={<Progress />} />
              </Routes>
            </Layout>
          )}
        </HashRouter>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;

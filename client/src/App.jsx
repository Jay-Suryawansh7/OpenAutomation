import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Automations from './pages/Automations';
import Home from './pages/Home';
import AIStudio from './pages/AIStudio';
import Contacts from './pages/Contacts';
import Forms from './pages/Forms';
import Refer from './pages/Refer';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/automations" element={<Automations />} />
          <Route path="/ai-studio" element={<AIStudio />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/forms" element={<Forms />} />
          <Route path="/refer" element={<Refer />} />
          <Route path="/settings" element={<Settings />} />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

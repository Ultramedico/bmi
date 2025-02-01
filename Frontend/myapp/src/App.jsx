import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/home/home';
import Dashboard from './components/dash/dashboard';
import Notification from './components/Notification/notification';

function App() {
  return (
    <Router>
      <Notification />
      <Routes>
      
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    
    </Router>
  );
}

export default App;
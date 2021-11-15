import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Navbar from './components/NavBar/NavBar';
import Home from './components/HomePage/Home';
import TopCoins from './components/TopCoins/TopCoins';
import News from './components/News/News';
import NotFound from './components/NotFound';

function App() {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/top-coins" element={<TopCoins />} />
          <Route path="/news" element={<News />} />
          <Route path="*" element={<NotFound  />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

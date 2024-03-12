
import './App.css';
import Register from './pages/Register';
import {BrowserRouter as Router, Routes,Route} from 'react-router-dom';
import Subscription from './pages/Subscription';
import Resume from './pages/Resume';
import Home from './pages/Home';

function App() {
  return (
    <div className="App">
     <Router>
      <Routes >
        <Route path="/" element={<Home/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/subscription" element={<Subscription/>} />
        <Route path="/resume" element={<Resume/>} />
      </Routes>
     </Router>
    </div>
  );
}

export default App;

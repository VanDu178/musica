import logo from './logo.svg';
import './App.css';
import Home from "./pages/Home"; // Import trang Home
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Đúng cách




function App() {
  return (
    <Router>
      <div className="App">
        {/* Điều hướng trang */}
        <Routes>
          <Route path="/" element={<Home />} /> {/* Trang mặc định là Home */}
        </Routes>
      </div>
    </Router>
  );
}


export default App;

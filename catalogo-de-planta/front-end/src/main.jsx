import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Maps from "./pages/maps.jsx";
import Catalogo from "./pages/catalogo.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
         <Router>
        <Routes>
          <Route path="/maps" element={<Maps />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/" element={<App />} />
        </Routes>
      </Router>
  </StrictMode>,
)

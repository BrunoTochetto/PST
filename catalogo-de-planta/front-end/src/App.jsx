import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Maps from "./pages/Maps";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/maps" element={<Maps />} />
      </Routes>
    </Router>
  );
}

export default App;
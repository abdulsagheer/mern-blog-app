// Importing Libraries
import { Routes, Route } from "react-router-dom";

// Importing Dependencies
import { Home } from "./components/Home/Home";
import Navbar from "./components/Navigation/Navbar";
import { Login } from "./components/Users/Login/Login";
import { Register } from "./components/Users/Register/Register";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;

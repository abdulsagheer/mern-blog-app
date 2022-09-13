// Importing Libraries
import { Routes, Route } from "react-router-dom";

// Importing Dependencies
import Home from "./components/Home/Home";
import Register from "./components/Users/Register/Register";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;

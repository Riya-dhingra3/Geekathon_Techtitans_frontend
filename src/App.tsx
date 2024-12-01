import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Analysis from "./component/Analysis";
import Login from "./component/Login";
import Signup from "./component/Signup";
import WithAuthProtection from "./component/WithAuthProtection";
import Dashboard from "./component/Dashboard";
import Home from "./component/HomePage";

function App() {
  const Protected = WithAuthProtection(Home);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Protected />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

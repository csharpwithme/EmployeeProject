import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/Login";
import EmployeeDashboard from "./components/EmployeeDashboard";
import EmployeeDetails from "./components/EmployeeDetails";
import Profile from "./components/Profile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<EmployeeDashboard />} />
        <Route path="/employee/:id" element={<EmployeeDetails />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;

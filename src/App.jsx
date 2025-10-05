import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LanguageSelection from "./pages/LanguageSelection";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Screening from "./pages/Screening";
import Home from "./pages/Home";
import Glucometer from "./pages/Glucometer";
import PhysicalActivity from "./pages/PhysicalActivity";
import Medication from "./pages/Medication";
import Nutrition from "./pages/Nutrition";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import Family from "./pages/Family";
import DoctorPatient from "./pages/DoctorPatient";
import DoctorDashboard from "./pages/DoctorDashboard";

function App() {
  const { token } = useSelector((state) => state.auth);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/language" element={<LanguageSelection />} />
        <Route
          path="/register"
          element={!token ? <Register /> : <Navigate to="/screening" />}
        />
        <Route
          path="/login"
          element={!token ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/screening"
          element={token ? <Screening /> : <Navigate to="/login" />}
        />
        <Route path="/" element={token ? <Home /> : <Navigate to="/login" />} />
        <Route
          path="/glucometer"
          element={token ? <Glucometer /> : <Navigate to="/login" />}
        />
        <Route
          path="/physical"
          element={token ? <PhysicalActivity /> : <Navigate to="/login" />}
        />
        <Route
          path="/medication"
          element={token ? <Medication /> : <Navigate to="/login" />}
        />
        <Route
          path="/nutrition"
          element={token ? <Nutrition /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={token ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="/chat"
          element={token ? <Chat /> : <Navigate to="/login" />}
        />
        <Route
          path="/family"
          element={token ? <Family /> : <Navigate to="/login" />}
        />
        <Route path="/doctor/patient/:userId" element={<DoctorPatient />} />

        {/* Doctor Dashboard */}
        <Route path="/doctor-side" element={<DoctorDashboard />} />

        <Route path="*" element={<Navigate to={token ? "/" : "/language"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

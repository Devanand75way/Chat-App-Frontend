import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import Authenticate from "./layouts/Authenticate";
import BasicLayout from "./layouts/BasicLayout";
const App: React.FC = () => {
  return (
    <Routes>
      <Route element={<Authenticate />}>
        <Route path="/" element={<HomePage />} />
      </Route>

      <Route element={<BasicLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
    </Routes>
  );
};

export default App;

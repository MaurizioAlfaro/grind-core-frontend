import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ReptilianzMain from "./reptilianz-main/App";
import ComingSoonPage from "./reptilianz-landing/components/ComingSoonPage";
import GrindCoreApp from "./GrindCoreApp";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ReptilianzMain />} />
        <Route path="/airdrop" element={<ComingSoonPage />} />
        <Route path="/minigame" element={<GrindCoreApp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;

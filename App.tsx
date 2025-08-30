import React, { useEffect } from "react";
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
  useEffect(() => {
    // Clear casino-related localStorage items
    localStorage.removeItem("casinoSuiteState");
    localStorage.removeItem("baccarat_chips");
    localStorage.removeItem("roulette_chips");
    localStorage.removeItem("blackjack_chips");
  }, []);
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

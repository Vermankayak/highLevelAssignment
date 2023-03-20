import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Transactions from "./Pages/Transactions";
import WalletHome from "./Pages/WalletHome";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<WalletHome />}/>
        <Route exact path="/transactions" element={<Transactions />}/>
      </Routes>
    </Router>
  );
}

export default App;

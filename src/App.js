import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Login/Login";
import CommonBanner from "./Components/Banner/CommonBanner";
import TreePanel from "./Components/NewTree/TreePanel";
import SplitPanel from './Components/Dashboard/SplitPanel';
import MenuListPage from "./Components/MenuList/MenuListPage";

function App() {
 
  
  return (
    <div className='App'>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="CommonBanner" element={<CommonBanner />} />
        <Route path="treePage" element={<TreePanel />} />
        <Route path="menuListItem" element={<MenuListPage />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;

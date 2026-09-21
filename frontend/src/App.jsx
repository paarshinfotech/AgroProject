
import {Route, Routes} from "react-router-dom";
import './App.css'
import Home from "./pages/Home";
import VendorList from "./Admin/Pages/VendorList";

function App() {
  

  return (
    <>
       <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/Vendor" element={<VendorList/>}/>
    </Routes>

    </>
  );
}

export default App;
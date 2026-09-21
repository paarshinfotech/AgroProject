import {Route, Routes} from "react-router-dom";
import './App.css'
import Home from "./pages/Home";
import VendorList from "./Admin/Pages/VendorList";



import CustomerManagement from "../src/Admin/Pages/CustomerManagement"

function App() {
  

  return (
    <>

      <CustomerManagement />

    </>
  );
}

export default App;

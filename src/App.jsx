import { BrowserRouter, Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import LoginPageAdmin from "./pages/LoginPageAdmin"
import RegisterPage from "./pages/RegisterPage"
import DashboardPage from "./pages/DashboardPage"
import DashboardPageAdmin from "./pages/DashboardPageAdmin"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import ProfilePage from "./pages/ProfilePage"
import KamarPageAdmin from "./pages/KamarPageAdmin"
import MusimPageAdmin from "./pages/MusimPageAdmin"
import TarifPageAdmin from "./pages/TarifPageAdmin"
import FasilitasTambahanPageAdmin from "./pages/FasilitasTambahanPageAdmin"
import ForgetPasswordPage from "./pages/ForgetPasswordPage"
import CustomerGrupPageAdmin from "./pages/CustomerGrupPageAdmin"
import TransaksiPageAdmin from "./pages/TransaksiPageAdmin"
import PembatalanPage from "./pages/PembatalanPage"
import PembatalanPageAdmin from "./pages/PembatalanPageAdmin"

function App() {
  return <>
    <ToastContainer theme={"light"}/>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/LoginPage" element={<LoginPage/>}/>
        <Route path="/RegisterPage" element={<RegisterPage/>}/>
        <Route path="/DashboardPage" element={<DashboardPage/>}/>
        <Route path="/ProfilePage" element={<ProfilePage/>}/>
        <Route path="/LoginPageAdmin" element={<LoginPageAdmin/>}/>
        <Route path="/DashboardPageAdmin" element={<DashboardPageAdmin/>}/>
        <Route path="/KamarPageAdmin" element={<KamarPageAdmin/>}/>
        <Route path="/FasilitasTambahanPageAdmin" element={<FasilitasTambahanPageAdmin/>}/>
        <Route path="/MusimPageAdmin" element={<MusimPageAdmin/>}/>
        <Route path="/TarifPageAdmin" element={<TarifPageAdmin/>}/>
        <Route path="/ForgetPasswordPage" element={<ForgetPasswordPage/>}/>
        <Route path="/CustomerGrupPageAdmin" element={<CustomerGrupPageAdmin/>}/>
        <Route path="/TransaksiPageAdmin" element={<TransaksiPageAdmin/>}/>
        <Route path="/PembatalanPage" element={<PembatalanPage/>}/>
        <Route path="/PembatalanPageAdmin" element={<PembatalanPageAdmin/>}/>
        
      </Routes>
    </BrowserRouter>
    </>
}

export default App

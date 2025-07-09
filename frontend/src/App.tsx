import { BrowserRouter, Routes, Route } from "react-router-dom"
import LoginPage from "./pages/LoginPage"; //sera el HOME tambien 
import AdminDashboard from './pages/AdminDashboard'; // pendiente Crear uno Basico 
import SecretariaCitas from './pages/SecretariaCitas'; //Pendiente crear uno basico 
import EspecialistaCalendario from './pages/EspecialistaCalendario'; //Pendiente crear uno basico 


function App() {
  return (
   <BrowserRouter>
   <Routes>
    <Route path='/' element={<LoginPage/>}/>
     <Route path='/admin/dashboard' element={<AdminDashboard/>}/>
      <Route path='/secretaria/citas' element={<SecretariaCitas/>}/>
       <Route path='/especialista/calendario' element={<EspecialistaCalendario/>}/>


   </Routes>
   </BrowserRouter>
  )
}

export default App
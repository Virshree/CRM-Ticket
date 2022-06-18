import './App.css';

import {BrowserRouter as Router,Routes,Route}from 'react-router-dom';
import {Suspense} from 'react';

import '@coreui/coreui/dist/css/coreui.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import 'react-circular-progressbar/dist/styles.css';


import Login from './pages/Login';
import Admin from './pages/Admin';
import RequireAuth from './components/RequireAuth';
import Customer from './pages/Customer';
import Engineer from './pages/Engineer';
import Notfound from './components/Notfound';
import Unauthorized from './components/Unauthorized';

function App() {

  const ROLES={
    "CUSTOMER":"CUSTOMER",
    "ENGINEER":"ENGINEER",
    "ADMIN":"ADMIN",
  }
  return (
    <Router>
      <Routes>
      <Route exact path="/" element=
      {<Suspense fallback={<div>Loading..</div>}>
        <Login/>
      </Suspense>}/>
       <Route path="unauthorized" element={<Unauthorized />} />   
       {/*Protected Routes are 
       provided bcoz no of one can access admin,customer,engineer*/}
      {/* <Route element={<RequireAuth allowedRoles={[ROLES.ADMIN]}/>} > */}
        <Route   path="/admin"  exact element={<Admin/>}/>
      {/* </Route>  */}
      
      <Route element={<RequireAuth allowedRoles={[ROLES.CUSTOMER]}/>} >
        <Route   path="/customer"  exact element={<Customer/>}/>
      </Route>
       {/* <Route element={<RequireAuth allowedRoles={[ROLES.ENGINEER]}/>} > */}
        <Route   path="/engineer"  exact element={<Engineer/>}/>
      {/* </Route> */}

        <Route path="/*" element={<Notfound />} />
   
     </Routes>
    </Router>
  );
}

export default App;

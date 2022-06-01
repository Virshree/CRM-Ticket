import './App.css';

import {BrowserRouter as Router,Routes,Route}from 'react-router-dom';
import {Suspense} from 'react';
import Login from './pages/Login';
function App() {
  return (
    <Router>
      <Routes>
      <Route exact path="/" element=
      {<Suspense fallback={<div>Loading..</div>}>
        <Login/>
      </Suspense>}/>
     </Routes>
    </Router>
  );
}

export default App;

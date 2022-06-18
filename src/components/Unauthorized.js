import React from 'react'
import { useNavigate } from 'react-router-dom';
import Not from '../assets/403.svg';

function Unauthorized() {

  const history = useNavigate();
  const goBack=()=>{
    history(-1);
  }
  return (
    <div className='d-flex justify-content-center align-items-center vh-100'>
      <div> 
          <h1>Unauthorized access</h1>
          <img src={Not} alt="403" width="400" height="400" />
          <div className='d-flex align-items-center justify-content-center'>
            <button className='btn btn-primary' onClick={goBack}>Back</button>
        </div>
        </div> 
    </div>
  )
}

export default Unauthorized;
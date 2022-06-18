import React from 'react';
import  not from'../assets/404.svg';
import { useNavigate } from 'react-router-dom';
function Notfound() {
  const history =useNavigate();
  const goBack=()=>{
    history(-1); //we can use history("/") it will work same as history.
  }
  return (
    <div className='d-flex justify-content-center align-content-center
     vh-100 mt-3 text-center'>
        <div>
            <h3>Hmm. This doesnt seem right</h3>
            <p>This page doesnt exist</p>
            <img src={not} alt="404" />
            <div>
            <button className='btn btn-primary'  onClick={goBack}>Back</button>
            </div>
        </div>
    </div>
  )
}

export default Notfound;
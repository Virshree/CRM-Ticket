import React, { useState } from 'react';
import {Dropdown,DropdownButton} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {userSignup,userLogin} from '../api/auth';


function Login() {
    const [showSigup,setShowSigup] =useState(false);
    const [userType,setuserType]=useState("CUSTOMER");
    const [userSignupData,setuserSignupData] = useState({});
    const [message,setMessage] = useState("");
    //const [userLoginData,setUserLoginData] = useState({});
    const toggleSignup=()=>{
        setShowSigup(!showSigup)
    }
    const handleSelect=(e)=>{
        setuserType(e);
    }
    //grab all the values 
    const updateSignupData=(e)=>{
        userSignupData[e.target.id]=e.target.value;
        console.log(userSignupData);
    }
    // const updateLoginData=(e)=>{
    //     userLoginData[e.target.id]=e.target.value;
    //     console.log(userLoginData);
    // }
    const signupFn=(e)=>{
         const username=userSignupData.username;
         const userId=userSignupData.userId;
         const email=userSignupData.email;
         const password=userSignupData.password;
         const data={
             name:username,
             userId:userId,
             email:email,
             password:password,
             userTypes:userType,
         }

         e.preventDefault();
        console.log('DATA',data);


         userSignup(data).then(function(response){
             console.log(response);

             if(response === 201){
               history(0);
             }
             
         })
         .catch(function(error){
             if(error.response.status === 400){
                 setMessage(error.response.data.message);
             }
             else{
                 console.log(error);
             }
         })


    }
    let history=useNavigate();
   
    const loginFn=(e)=>{
       
        const userId=userSignupData.userId;
        const password=userSignupData.password;

        const data={
            userId:userId,
            password:password
        }
       
        e.preventDefault();
         console.log(data);

        userLogin(data).then(function(response) {
            console.log(response);
            if(response.status === 200){
                if(response.data.message){
                    setMessage(response.data.message);
                }
                else{

                
                localStorage.setItem("name",response.data.name);
                localStorage.setItem("userId",response.data.userId);
                localStorage.setItem("email",response.data.email);
                localStorage.setItem("userTypes",response.data.userTypes);
                localStorage.setItem("userStatus",response.data.userStatus);
                localStorage.setItem("token",response.data.accessToken);
                if(response.data.userTypes === "CUSTOMER"){
                    history("/customer");

                     }
                else if(response.data.userTypes === "ENGINEER"){
                    history("/engineer");
                     }
                else{
                   history("/admin");
                }
            }
        }   

            
        }).catch(function(error){
             if(error.response.status ===400){
                 setMessage(error.response.data.message);
             }
             else{
                 console.log(error);
             }
         })
    }
  return (
    
    <div className="bg-primary d-flex justify-content-center align-items-center vh-100">
        <div className="card m-5 p-5" >
            <div className="row">
                <div className="col">
                    {!showSigup ? (
                        <div className="login">
                            {/*user id ,password,login button,toggle text*/}
                           <form onSubmit={loginFn}>
                               <h2 className='text-center '>LOGIN</h2>
                               <br/>
                               <div className="input-group m-1 ">
                                    <input type="text" className='form-control'
                                    placeholder='User ID' id='userId' onChange={updateSignupData}/>
                                </div>
                                   
                                <div className="input-group m-1 ">
                                     <input type="password" className='form-control'
                                    placeholder='Password' id='password' onChange={updateSignupData}/>
                                  </div>

                                <div className="input-group  m-1">
                                   <input type="submit" className='form-control btn btn-primary' value="Log in"/>
                                </div>
                                <div className='text-info text-center ' onClick={toggleSignup}>
                                    Don't have  an account ? Signup
                                </div>
                               
                           </form>
                        </div>
                    ):(<div className='signup'>
                             <form onSubmit={signupFn} >
                               <h2 className='text-center'>SIGNUP</h2>
                               <br/>
                               <div className="input-group m-1 ">
                                    <input type="text" className='form-control'
                                    placeholder='User ID' id='userId'
                                    onChange={updateSignupData}/>
                                </div>
                                 <div className="input-group m-1 ">
                                    <input type="text" className='form-control'
                                    placeholder='Username' id='username'
                                     onChange={updateSignupData}/>
                                </div> 
                               
                                    <input type="email" className='form-control m-1'
                                    placeholder='Email' id='email' onChange={updateSignupData}/>
                               
                                <div className="input-group m-1 ">
                                     <input type="password" className='form-control'
                                    placeholder='Password' id='password' onChange={updateSignupData}/>
                                  </div>

                                 <div className="input-group m-1 ">
                                     <span className='text-muted'>User Type</span>

                                     <DropdownButton 
                                     align="end"
                                     title={userType}
                                     variant='secondary'
                                     className='mx-1'
                                    
                                     onSelect={handleSelect}>
                                         <Dropdown.Item eventKey='CUSTOMER'>CUSTOMER</Dropdown.Item>
                                          <Dropdown.Item eventKey='ENGINEER'>ENGINEER</Dropdown.Item>
                                    </DropdownButton>
                                  </div>


                                <div className="input-group  m-1">
                                   <input type="submit" className='form-control btn btn-primary' value="Sign Up"/>
                                </div>
                                <div className='text-info text-center' onClick={toggleSignup}>
                                Already have an account ?Login 
                                </div>
                               <div>
                                   <div className="text-danger">{message}</div>
                               </div>
                           </form>
                    </div>)}
                </div>
            </div>
        </div>
    </div>
  )
}

export default Login
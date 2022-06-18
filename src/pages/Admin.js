
import React from 'react'
import Sidebar from '../components/Sidebar';
import {Button,  Form,  Modal} from 'react-bootstrap';
import Stack from 'react-bootstrap/Stack';

//import Dropdown from 'react-bootstrap/Dropdown';
//import DropdownButton from 'react-bootstrap/DropdownButton';
//Showing some representation of data
//graphs: to show statistics data
//access to viewing all the users.
//Admin=>Engineer=>approve/decline/assign=>change the status

//admin:tickets:view all the tickets
//edit details
import '../styles/admin.css';
import { CircularProgressbar,buildStyles } from 'react-circular-progressbar';
import MaterialTable from '@material-table/core';
import {useState} from 'react';
import { fetchTickets ,updateTicketData} from '../api/ticket';
import { useEffect } from 'react';
import { ExportCsv, ExportPdf } from '@material-table/exporters';
import { fetchUsers,updateUserData } from '../api/user';
//admin-can see tickets,user
function Admin() {

    const [userModal,setUserModal]=useState(false);
    const[ticketModal,setTicketModal]=useState(false);
    const [ticketDetails,setticketDetails] = useState([]);
    const[userDetails, setUserDetails] = useState([]);
    //ticket list
    const[selectedCurrTicket,setSelectedCurrTicket] = useState({});
    const[updateTicketModal,setupdateTicketModal] = useState(false);
    const[ticketCount,setTicketCount] = useState({});
    //userlist
    const[selectedCurrUser,setSelectedCurrUser] = useState({});
    const[updateUserModal,setUpdateUserModal] = useState(false);

    const updateSelectedCurrUser=(data)=>setSelectedCurrUser(data);

    //user modal close
    const onCloseUserModal = () =>
    {
      setUpdateUserModal(false);
    }
  
    const updateSelectedCurrTicket =(data)=>setSelectedCurrTicket(data);
  
    //ticket modal close
    const onCloseTicketModal =()=>{
      setupdateTicketModal(false);
    }
    const showUserModal=()=>{
      setUserModal(true);
    }
    const closeUserModal=()=>{
      setUserModal(false);
    }
    const showTicketModal=()=>{
      setTicketModal(true);
    }
    const closeTicketModal=()=>{
      setTicketModal(false);
    }

    useEffect(()=>{
      (async ()=>{
        fetchTicket()
      })()
    },[])
    const fetchTicket=()=>{
      fetchTickets().then(function(response){
        if(response.status===200){
          console.log(response);
          setticketDetails(response.data);
          //counting the tickets
          updateTicketCount(response.data);
        }
      }).catch((error)=>{
        console.log(error);
      })
    }

    useEffect(()=>{
      (async ()=>{
        fetchUser()
      })()
    },[])
    const fetchUser=(userId)=>{
      fetchUsers(userId).then(function(response){
        if(response.status===200){
          if(userId){
            setUserDetails(response.data);
          }
          else{
          setUserDetails(response.data);

          }
        }
      }).catch((error)=>{
        console.log(error);
      })
    }
     
    //read existing data tickets
    const editTickets=(ticketDetails)=>{
      const ticket={
        assignee:ticketDetails.assignee,
        description:ticketDetails.description,
        id:ticketDetails.id,
        reporter:ticketDetails.reporter,
        status:ticketDetails.status,
        ticketPriority:ticketDetails.ticketPriority,
        title:ticketDetails.title,
      }
      console.log(ticket);
      setSelectedCurrTicket(ticket);

      //open modal
      setupdateTicketModal(true);
    }

    //read the updated values fron the user
      const onTicketUpdate=(e)=>{
      if(e.target.name==="title")
      {
        selectedCurrTicket.title=e.target.value
      }
      else if(e.target.name==="description"){
        selectedCurrTicket.description=e.target.value
      }
       else if(e.target.name==="ticketPriority"){
        selectedCurrTicket.ticketPriority=e.target.value
      }
      else if(e.target.name==="assignee"){
        selectedCurrTicket.assignee=e.target.value
      }
       else if(e.target.name==="status"){
        selectedCurrTicket.status=e.target.value
      }
      updateSelectedCurrTicket(Object.assign({},selectedCurrTicket))
    }

    const updateTicket=(e)=>{
      e.preventDefault();
      updateTicketData(selectedCurrTicket.id,selectedCurrTicket).then(function(response){
       
        console.log("Ticket updated successfully");
        onCloseTicketModal();
      }).catch((error)=>{
        console.log(error);
      })
    }
    //ticket count logic
    const updateTicketCount=(tickets)=>{
        const data={
          in_progress:0,
          closed:0,
          open:0,
          blocked:0,
        }
        tickets.forEach((x)=>{
          if(x.status === 'OPEN'){
            data.open +=1;
          }
          else if(x.status === 'CLOSED'){
            data.closed +=1;
          }
          else if(x.status === 'BLOCKED'){
            data.blocked +=1;
              }
          else if(x.status === 'IN_PROGRESS'){
            data.in_progress +=1;
          }
            
            })
          setTicketCount(Object.assign({},data));
    }
    console.log(ticketCount);

    //userdetails updation function

    const editUsers=(userDetails)=>{
      const users={
        userId:userDetails.userId,
        name:userDetails.name,
        email:userDetails.email,
        userTypes:userDetails.userTypes,
        userStatus:userDetails.userStatus,
      }
      console.log(users);
      setSelectedCurrUser(users);
      //open modal
      setUpdateUserModal(true);
    }

    //read the existing data from user details
    const onUserUpdate=(e)=>{
        if(e.target.name==="name"){
          selectedCurrUser.name=e.target.value
        }
        else if(e.target.name==="email"){
          selectedCurrUser.email=e.target.value
        }
        else if(e.target.name==="userTypes"){
          selectedCurrUser.userTypes=e.target.value
        }
         else if(e.target.name==="userStatus"){
          selectedCurrUser.userStatus=e.target.value
        }
        updateSelectedCurrUser(Object.assign({},selectedCurrUser))
    }

    const updateUser=(e)=>{
      e.preventDefault();
      updateUserData(selectedCurrUser.userId,selectedCurrUser).then(function(response){
        console.log("User details updated successfully");
        onCloseUserModal();
      }).catch((error)=>{
        console.log(error);
      })
    }
  return (
    <div className="bg-light min-vh-100">
      <div className='row'>
        <div className='col-1'>
           <Sidebar/>
        </div>
        <div className='container col m-1'>
            <h3 className="text-primary text-center">Welcome Admin</h3>
            <p className="text-muted text-center">Take a quick look at your stats 
            below</p>

            <div className='row my-5 mx-2 text-center'>
              <div className='col my-1'>
                <div className='card shadow bg-primary bg-opacity-25 ' 
                style={{width: 12+'rem'}}>
                  <div className="cardbody border-b ">
                    <h5 className='card-subtitle'>
                      <i className="bi bi-pen text-primary mx-2 my-2"></i>
                      OPEN
                    </h5>
                    <hr/>
                    <div className='row'>
                      <div className='col' style={{height: '40px',width: '40px',
                      margin:'10px'}}>
                       {ticketCount.open}
                      </div>
                      <div className='col'>
                        <div style={{height: '40px',width: '40px',margin:'10px'}}>
                          <CircularProgressbar value={ticketCount.open} styles={buildStyles({
                          textColor:'blue',
                          pathColor:'darkBlue',

                        })}
                       >

                        </CircularProgressbar>
                        </div>
                        
                      </div>

                    </div>
                  </div>

                </div>

              </div>

              <div className='col my-1'>
                <div className='card shadow bg-warning bg-opacity-25 ' style={{width: 12+'rem'}}>
                  <div className="cardbody border-w ">
                    <h5 className='card-subtitle'>
                      <i class="bi bi-lightning-charge text-warning mx-2 my-2"></i>
                      PROGRESS
                    </h5>
                    <hr/>
                    <div className='row'>
                      <div className='col' style={{height: '40px',width: '40px',margin:'10px'}}>
                       {ticketCount.in_progress}
                      </div>
                      <div className='col'>
                        <div style={{height: '40px',width: '40px',margin:'10px'}}>
                          <CircularProgressbar value={ticketCount.in_progress} styles={buildStyles({
                          textColor:'blue',
                          pathColor:'Gold',

                        })}
                       >

                        </CircularProgressbar>
                        </div>
                        
                      </div>

                    </div>
                  </div>

                </div>

              </div>
            

            <div className='col my-1'>
                <div className='card shadow bg-success bg-opacity-25 ' style={{width: 12+'rem'}}>
                  <div className="cardbody border-s ">
                    <h5 className='card-subtitle'>
                      <i class="bi bi-check2-circle text-success mx-2 my-2"></i>
                      CLOSED
                    </h5>
                    <hr/>
                    <div className='row'>
                      <div className='col' style={{height: '40px',width: '40px',margin:'10px'}}>
                       {ticketCount.closed}
                      </div>
                      <div className='col'>
                        <div style={{height: '40px',width: '40px',margin:'10px'}}>
                          <CircularProgressbar value={ticketCount.closed} styles={buildStyles({
                          textColor:'blue',
                          pathColor:'darkGreen',

                        })}
                       >

                        </CircularProgressbar>
                        </div>
                        
                      </div>

                    </div>
                  </div>

                </div>

              </div>

              <div className='col my-1'>
                <div className='card shadow bg-secondary bg-opacity-25 ' style={{width: 12+'rem'}}>
                  <div className="cardbody border-g ">
                    <h5 className='card-subtitle'>
                     <i class="bi bi-slash-circle text-secondary mx-2 my-2"></i>
                      BLOCKED
                    </h5>
                    <hr/>
                    <div className='row'>
                      <div className='col' style={{height: '40px',width: '40px',margin:'10px'}}>
                        {ticketCount.blocked}
                      </div>
                      <div className='col'>
                        <div style={{height: '40px',width: '40px',margin:'10px'}}>
                          <CircularProgressbar value={ticketCount.blocked} styles={buildStyles({
                          textColor:'blue',
                          pathColor:'darkGrey',

                        })}
                       >

                        </CircularProgressbar>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


            </div>
            
                       

            <div>
                <MaterialTable
                onRowClick={(event,rowData)=>editTickets(rowData)}
                  data={ticketDetails}
                columns={[
                { title: 'Ticket ID',
                 field: 'id'
                 },

                { title: 'Title', 
                field: 'title' },
                 { title: 'Description', 
                field: 'description' },

                 { title: 'Reporter', 
                field: 'reporter' },

                 { title: 'Priority',  
                field: 'ticketPriority' },

                 { title: 'Assignee', 
                field: 'assignee' },
                {
                 title: "Status", 
                 field: "status", 
                  lookup: {
                  "OPEN": "OPEN", 
                  "IN_PROGRESS": "IN_PROGRESS", 
                  "CLOSED": "CLOSED",
                  "BLOCKED": "BLOCKED"
            }
          }
         ]}
         options={{
            exportMenu:[{
              label:'Export pdf',
              exportFunc:(cols,data)=>ExportPdf(cols,data,'Ticket Records')
            },
          {
            label:'Export Csv',
            exportFunc:(cols,data)=>ExportCsv(cols,data,'Ticket Records')   //Export excelfile
          }],
            headerStyle:{
              backgroundColor:"darkblue",
              color:"white"
            },
            rowStyle:{
              backgroundColor:"lavender"
            }
         }}
           
              title="TICKET RECORDS"
                />
             
               <Modal 
                show={updateTicketModal}
                onHide={onCloseTicketModal}
                 backdrop="static"
                centered>
                <Modal.Header closeButton>
                  <Modal.Title>Edit details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                     
                    <div className="p-1">
                      <h5 className="text-secondary">Ticket ID:{selectedCurrTicket.id}</h5>
                      <hr/>
                      <div className="input-group m-1 p-1" >
                        <label className="input-group-text">Title:
                        <input type="text" className="form-control"
                        name="title" value={selectedCurrTicket.title}
                        onChange={onTicketUpdate}
                       />
                        </label>
                       <div className="input-group m-1 p-1" >
                        <label className="input-group-text">Description:
                        <input type="text" className="form-control" 
                        value={selectedCurrTicket.description}
                        name="description"
                        onChange={onTicketUpdate}
                       />
                        </label>
                      </div> 
                      <div className="input-group m-1 p-1" >
                        <label className="input-group-text">Priority:
                        <input type="text" className="form-control" 
                        value={selectedCurrTicket.ticketPriority}
                        name="ticketPriority"
                        onChange={onTicketUpdate}
                        />
                        </label>
                      </div> 
                      <div className="input-group m-1 p-1" >
                        <label className="input-group-text">Assignee:
                        <input type="text" className="form-control" 
                        value={selectedCurrTicket.assignee}
                        name="assignee"
                        onChange={onTicketUpdate}
                      />
                        </label>
                      </div> 
                    </div>
                    <div className="input-group m-1 p-1" >
                        <label className="input-group-text">Status:
                        <input type="text" className="form-control" 
                        name="status"
                        value={selectedCurrTicket.status}
                        onChange={onTicketUpdate}
                        />
                        </label>
                      </div>  
                       

                      {/* <div className="input-group m-1 p-1">
                       <label className="input-group-text">Status:
                         <Form.Select>
                            <option>OPEN</option>
                            <option>IN_PROGRESS</option>
                            <option>BLOCKED</option>
                            <option>CLOSED</option>
                        </Form.Select>
                      </label>
                      
                      </div> */}
                    </div>
                     <hr/>
                  </Form>
                    <Stack direction="horizontal" gap={3} style={{float:'right'}}>
                    
                    <Button variant="secondary" >Close</Button>
                    <Button variant="primary" onClick={updateTicket} >Update</Button>

                  </Stack>
                </Modal.Body>
                 
                </Modal>

                   {/* <button className="btn btn-primary" onClick={showTicketModal}>Open Modal</button> */}
                    <hr/>
        <div style={{maxWidth: '100%'}}>
                <MaterialTable
                   onRowClick={(event,rowData)=>editUsers(rowData)}
                    data={userDetails}
                columns={[
                { title: 'User ID',
                 field: 'userId'
                 },
                { title: 'Name', 
                field: 'name' },
                 { title: 'Email', 
                field: 'email' },
                 { title: 'UserTypes',  
                field: 'userTypes',
                lookup:{
                  "ADMIN":"ADMIN",
                  "CUSTOMER": "CUSTOMER",
                  "ENGINEER": "ENGINEER",
                }
               },
                {
                 title: "UserStatus", 
                 field: "userStatus", 
                  lookup: {
                  "APPROVED": "APPROVED",
                  "PENDING": "PENDING", 
                  "REJECTED": "REJECTED",
            }
          }
         ]}
         options={{
            exportMenu:[{
              label:'Export pdf',
              exportFunc:(cols,data)=>ExportPdf(cols,data,'User Records')
            },
          {
            label:'Export Csv',
            exportFunc:(cols,data)=>ExportCsv(cols,data,'User Records')   //Export excelfile
          }],
            headerStyle:{
              backgroundColor:"darkblue",
              color:"white"
            },
            rowStyle:{
              backgroundColor:"lavender"
            }
         }}
            
              title="USER RECORDS"
                />
        </div>
            <Modal 
                show={updateUserModal}
                onHide={onCloseUserModal}
                 backdrop="static"
                centered>
                <Modal.Header closeButton>
                  <Modal.Title>Edit details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                     
                    <div className="p-1">
                      <h5 className="text-secondary">User ID:{selectedCurrUser.userId}</h5>
                      <hr/>
                       <div className="input-group m-1 p-1" >
                        <label className="input-group-text">Name:
                        <input type="text" className="form-control" name="name" 
                        value={selectedCurrUser.name}
                        onChange={onUserUpdate}/>
                        </label>
                      </div> 
                  
                      <div className="input-group m-1 p-1" >
                        <label className="input-group-text">Email:
                        <input type="text" className="form-control"  name="email"
                        value={selectedCurrUser.email}
                         onChange={onUserUpdate}/>
                        </label>
                      </div>
                       <div className="input-group m-1 p-1">
                       <label className="input-group-text">Type:
                         <input type="text" className="form-control" name="userTypes"
                         value={selectedCurrUser.userTypes}
                          onChange={onUserUpdate}/>
                      </label>
                      
                      </div>

                      <div className="input-group m-1 p-1">
                       <label className="input-group-text">Status:
                        <input type="text" className="form-control" name="userStatus"
                        value={selectedCurrUser.userStatus}
                         onChange={onUserUpdate}/>
                      </label>
                      
                      </div>
                    </div>
                     <hr/>
                  </Form>
                    <Stack direction="horizontal" gap={3} style={{float:'right'}}>
                    
                    <Button variant="secondary" >Close</Button>
                    <Button variant="primary" onClick={updateUser}>Update</Button>

                  </Stack>
                </Modal.Body>
                 
                </Modal>

                   {/* <button className="btn btn-primary" onClick={showUserModal}>Open Modal</button>      */}

               
               
            </div>
        </div>
      </div>
     
    </div>
  )
}

export default Admin
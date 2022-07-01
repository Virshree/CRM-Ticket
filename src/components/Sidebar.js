import React from 'react';
import {CSidebar,CSidebarNav,CNavTitle,CNavItem} from '@coreui/react';
import '../styles/sidebar.css';
function Sidebar() {
  const logout=()=>{
    localStorage.clear();
    
    //we can use navigate/link/router
    window.location.href='/';
  }
  return (
    <CSidebar unfoldable className="bg-black vh-100">
        <CSidebarNav >
         
            <CNavItem className="bg-dark text-center d-flex">
                    <i className="bi bi-bar-chart-fill m-2"></i>
                    <h5 className='mx-5 my-1 fw-bolder'>TETHERX</h5>
            </CNavItem>
            <CNavTitle className=''>
                    A Crm app for all your needs.
            </CNavTitle>
            <CNavItem className='d-flex'>
              <span class="material-symbols-outlined m-2 p-0">
                    home
              </span>
              <div className='mx-5 mx-2'>
                  Home
              </div>
            </CNavItem>
             
                <CNavItem className='d-flex '>
            
                    <i className="bi bi-box-arrow-left m-2"></i>
                      <div className='mx-5 mx-2 btn' onClick={logout}>
                            Logout
                      </div>
                  
                </CNavItem>
                
        </CSidebarNav>
    </CSidebar>
  )
}

export default Sidebar;
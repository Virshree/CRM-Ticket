import React from 'react';
import {CSidebar,CSidebarNav,CNavTitle,CNavItem} from '@coreui/react';
function Sidebar() {
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
                    <i className="bi bi-box-arrow-left m-2"></i>
                      <div className='mx-5 mx-1'>
                            Logout
                    </div>
              
                </CNavItem>
                  
        </CSidebarNav>
    </CSidebar>
  )
}

export default Sidebar;
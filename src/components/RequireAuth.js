import { useLocation,Outlet,Navigate } from "react-router-dom";

//admin,customer or engineer
//username-admin
//password-Welcome1
const RequireAuth=({allowedRoles})=>{
    const location=useLocation();
    return (
        localStorage.getItem("userTypes")=== allowedRoles[0]?
            <Outlet/> //outlet is just like placeholder
            :localStorage.getItem("userTypes")
            ?<Navigate to='/unauthorized' state={{from:location}} replace/>
            :<Navigate to='/' state={{from:location}} replace/>
            
    )
}
export default RequireAuth;
//<Navigate to='/unauthorized' state={{from:location}} replace/>
//admin
//customer :replace=>unauthorized
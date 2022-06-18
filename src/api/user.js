import axios from 'axios';

const BASE_URL=process.env.REACT_APP_SERVER_URL;

export async function fetchUsers(){
    return await axios.get(`${ BASE_URL}/crm/api/v1/users`, //method
    {
        headers:{
            'x-access-token':localStorage.getItem('token') //headers
        }
    },
    {
            "userId":localStorage.getItem('userId')     //body 
    }
    )
}

export async function updateUserData(userId, selectedCurrUser) {
    return await axios.put(`${ BASE_URL}/crm/api/v1/users/${ userId }`,selectedCurrUser, //method
    {
        headers:{
            'x-access-token':localStorage.getItem('token') //headers
        }
    },
    {
            "userId":localStorage.getItem("userId")     //body 
    }
    )
}
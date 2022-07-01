import axios from 'axios';

const BASE_URL=process.env.REACT_APP_SERVER_URL;

export async function getAllUser(userId){
    return await axios.get(`${ BASE_URL}/crm/api/v1/users/${userId}`, //method
    {
        headers:{
            'x-access-token':localStorage.getItem('token') //headers
        }
    })
}

export async function updateUserData(userId, data) {
    return await axios.put(`${ BASE_URL}/crm/api/v1/users/${userId}`,data, //method
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
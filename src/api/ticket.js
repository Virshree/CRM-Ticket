//axios library
import axios from "axios";
//url:crm/api/v1/tickets
//authorization:pass the  correct token x-access-token,userId
//async await used to delay for fetching api
//post api:allow the user to create the tickets
//put api:allow the engineer,user to edit the tickets

const BASE_URL = process.env.REACT_APP_SERVER_URL;

//to fetch ticket use get method
export async function fetchTicket() {
  return await axios.get(
    `${BASE_URL}/crm/api/v1/tickets/`, //method
    {
      headers: {
        "x-access-token": localStorage.getItem("token"), //headers
      },
    },
    {
      userId: localStorage.getItem("userId"),
    }
  );
}
//POST API
//method:post
//url:/crm/api/v1/tickets/

export async function ticketCreation(data) {
  return axios.post(`${BASE_URL}/crm/api/v1/tickets/`, data, {
    headers: {
      "x-access-token": localStorage.getItem("token"),
    },
  });
}

//put method to update ticket
export async function ticketUpdation(id, selectedCurrTicket) {
  return await axios.put(
    `${BASE_URL}/crm/api/v1/tickets/${id}`,
    selectedCurrTicket, //method
    {
      headers: {
        "x-access-token": localStorage.getItem("token"), //headers
      },
    },
    {
      userId: localStorage.getItem("userId"), //body
    }
  );
}

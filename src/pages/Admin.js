import React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import Stack from "react-bootstrap/Stack";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import MaterialTable from "@material-table/core";
import { useState } from "react";
import { useEffect } from "react";
import { ExportCsv, ExportPdf } from "@material-table/exporters";
import { getAllUser, updateUserData } from "../api/user";

import "../styles/admin.css";
import Sidebar from "../components/Sidebar";
import { fetchTicket, ticketUpdation } from "../api/ticket";

//admin-can see tickets,user

function Admin() {
  //user list
  const [userModal, setUserModal] = useState(false);
  const [userList, setUserList] = useState([]);
  const [userDetails, setUserDetails] = useState({});

  //const[ticketModal,setTicketModal]=useState(false);
  const [ticketDetails, setticketDetails] = useState([]);
  const [ticketUpdateModal, setTicketUpdateModal] = useState(false);
  //ticket list
  const [selectedCurrTicket, setSelectedCurrTicket] = useState({});
  //ticket count
  const [ticketCount, setTicketCount] = useState({});
  //message state
  const [message, setMessage] = useState("");

  const logoutFn = () => {
    localStorage.clear();
    window.location.href("/");
  };
  //user modal open
  const showUserModal = () => setUserModal(true);
  //user modal close
  const onCloseUserModal = () => {
    setUserModal(false);
    setUserDetails({});
  };

  const updateSelectedCurrTicket = (data) => setSelectedCurrTicket(data);

  //ticket modal close
  const closeTicketUpdationModal = () => setTicketUpdateModal(false);

  useEffect(() => {
    (async () => {
      fetchTickets();
    })();
  }, []);
  const fetchTickets = () => {
    fetchTicket()
      .then(function (response) {
        if (response.status === 200) {
          // console.log(response);
          setticketDetails(response.data);
          //counting the tickets
          updateTicketCount(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
        logoutFn();
      });
  };
  //call fetchUser in useEffect
  useEffect(() => {
    (async () => {
      fetchUser("");
    })();
  }, []);
  //fetch user
  const fetchUser = (userId) => {
    getAllUser(userId)
      .then(function (response) {
        if (response.status === 200) {
          if (userId) {
            //console.log(response.data);
            setUserDetails(response.data[0]);
            showUserModal();
          } else {
            setUserList(response.data);
          }
        }
      })
      .catch((error) => {
        console.log(error);
        logoutFn();
      });
  };

  //read existing data tickets
  const editTickets = (ticketDetails) => {
    const ticket = {
      assignee: ticketDetails.assignee,
      description: ticketDetails.description,
      id: ticketDetails.id,
      reporter: ticketDetails.reporter,
      status: ticketDetails.status,
      ticketPriority: ticketDetails.ticketPriority,
      title: ticketDetails.title,
    };
    // console.log("CRM Ticket",ticket);
    //store the existing values that we grabbed in a state
    setSelectedCurrTicket(ticket);
    //open modal
    setTicketUpdateModal(true);
  };

  //read the updated values fron the user
  const onTicketUpdate = (e) => {
    if (e.target.name === "title") {
      selectedCurrTicket.title = e.target.value;
    } else if (e.target.name === "description") {
      selectedCurrTicket.description = e.target.value;
    } else if (e.target.name === "ticketPriority") {
      selectedCurrTicket.ticketPriority = e.target.value;
    } else if (e.target.name === "assignee") {
      selectedCurrTicket.assignee = e.target.value;
    } else if (e.target.name === "status") {
      selectedCurrTicket.status = e.target.value;
    }
    updateSelectedCurrTicket(Object.assign({}, selectedCurrTicket));
  };

  //call the api for ticket
  const updateTicket = (e) => {
    e.preventDefault();
    ticketUpdation(selectedCurrTicket.id, selectedCurrTicket)
      .then(function (response) {
        setMessage("Ticket Updated Successfully");
        closeTicketUpdationModal();
        fetchTickets();
      })
      .catch((error) => {
        if (error.response.status === 400) setMessage(error.message);
        else if (error.response.status === 401) logoutFn();
        else console.log(error);
      });
  };
  //ticket count logic
  const updateTicketCount = (tickets) => {
    const data = {
      in_progress: 0,
      closed: 0,
      open: 0,
      blocked: 0,
    };
    tickets.forEach((x) => {
      if (x.status === "OPEN") {
        data.open += 1;
      } else if (x.status === "CLOSED") {
        data.closed += 1;
      } else if (x.status === "BLOCKED") {
        data.blocked += 1;
      } else if (x.status === "IN_PROGRESS") {
        data.in_progress += 1;
      }
    });
    setTicketCount(Object.assign({}, data));
    //console.log(data);
  };
  //console.log(ticketCount);

  //userdetails updation function
  const updateUserDetail = () => {
    const data = {
      userType: userDetails.userTypes,
      userStatus: userDetails.userStatus,
      userName: userDetails.name,
    };
    updateUserData(userDetails.userId, data)
      .then(function (response) {
        if (response.status === 200) {
          console.log(response.data);
          setMessage(response.message);
          let idx = userList.findIndex(
            (obj) => obj.userId === userDetails.userId
          );
          userList[idx] = userDetails;
          onCloseUserModal();
          setMessage("User detail updated successfully");
        }
      })
      .catch(function (error) {
        if (error.status === 400) setMessage(error.message);
        else if (error.response.status === 401) {
          logoutFn();
        } else console.log(error);
      });
  };

  //edit user details
  const changeUserDetail = (e) => {
    if (e.target.name === "status") userDetails.userStatus = e.target.value;
    else if (e.target.name === "name") userDetails.name = e.target.value;
    else if (e.target.name === "type") userDetails.userTypes = e.target.value;
    setUserDetails(userDetails);
    setUserModal(e.target.value);
  };
  return (
    <div className="bg-light min-vh-100">
      <div className="row">
        <div className="col-1">
          <Sidebar />
        </div>
        <div className="container col m-1">
          <h3 className="text-primary text-center">
            Welcome {localStorage.getItem("name")}
          </h3>
          <p className="text-muted text-center">
            Take a quick look at your stats below
          </p>

          <div className="row my-5 mx-2 text-center">
            <div className="col my-1">
              <div
                className="card shadow bg-primary bg-opacity-25 "
                style={{ width: 12 + "rem" }}
              >
                <div className="cardbody border-b ">
                  <h5 className="card-subtitle">
                    <i className="bi bi-pen text-primary mx-2 my-2"></i>
                    OPEN
                  </h5>
                  <hr />
                  <div className="row">
                    <div
                      className="col"
                      style={{ height: "40px", width: "40px", margin: "10px" }}
                    >
                      {ticketCount.open}
                    </div>
                    <div className="col">
                      <div
                        style={{
                          height: "40px",
                          width: "40px",
                          margin: "10px",
                        }}
                      >
                        <CircularProgressbar
                          value={ticketCount.open}
                          styles={buildStyles({
                            textColor: "blue",
                            pathColor: "darkBlue",
                          })}
                        ></CircularProgressbar>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col my-1">
              <div
                className="card shadow bg-warning bg-opacity-25 "
                style={{ width: 12 + "rem" }}
              >
                <div className="cardbody border-w ">
                  <h5 className="card-subtitle">
                    <i class="bi bi-lightning-charge text-warning mx-2 my-2"></i>
                    PROGRESS
                  </h5>
                  <hr />
                  <div className="row">
                    <div
                      className="col"
                      style={{ height: "40px", width: "40px", margin: "10px" }}
                    >
                      {ticketCount.in_progress}
                    </div>
                    <div className="col">
                      <div
                        style={{
                          height: "40px",
                          width: "40px",
                          margin: "10px",
                        }}
                      >
                        <CircularProgressbar
                          value={ticketCount.in_progress}
                          styles={buildStyles({
                            textColor: "blue",
                            pathColor: "Gold",
                          })}
                        ></CircularProgressbar>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col my-1">
              <div
                className="card shadow bg-success bg-opacity-25 "
                style={{ width: 12 + "rem" }}
              >
                <div className="cardbody border-s ">
                  <h5 className="card-subtitle">
                    <i class="bi bi-check2-circle text-success mx-2 my-2"></i>
                    CLOSED
                  </h5>
                  <hr />
                  <div className="row">
                    <div
                      className="col"
                      style={{ height: "40px", width: "40px", margin: "10px" }}
                    >
                      {ticketCount.closed}
                    </div>
                    <div className="col">
                      <div
                        style={{
                          height: "40px",
                          width: "40px",
                          margin: "10px",
                        }}
                      >
                        <CircularProgressbar
                          value={ticketCount.closed}
                          styles={buildStyles({
                            textColor: "blue",
                            pathColor: "darkGreen",
                          })}
                        ></CircularProgressbar>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col my-1">
              <div
                className="card shadow bg-secondary bg-opacity-25 "
                style={{ width: 12 + "rem" }}
              >
                <div className="cardbody border-g ">
                  <h5 className="card-subtitle">
                    <i class="bi bi-slash-circle text-secondary mx-2 my-2"></i>
                    BLOCKED
                  </h5>
                  <hr />
                  <div className="row">
                    <div
                      className="col"
                      style={{ height: "40px", width: "40px", margin: "10px" }}
                    >
                      {ticketCount.blocked}
                    </div>
                    <div className="col">
                      <div
                        style={{
                          height: "40px",
                          width: "40px",
                          margin: "10px",
                        }}
                      >
                        <CircularProgressbar
                          value={ticketCount.blocked}
                          styles={buildStyles({
                            textColor: "blue",
                            pathColor: "darkGrey",
                          })}
                        ></CircularProgressbar>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-success fs-3">
            {message.includes("Ticket") ? message : ""}
          </div>
          <div style={{ maxWidth: "100%", margin: "50px" }}>
            <MaterialTable
              onRowClick={(event, rowData) => editTickets(rowData)}
              data={ticketDetails}
              columns={[
                { title: "Ticket ID", field: "id" },

                { title: "Title", field: "title" },
                {
                  title: "Description",
                  field: "description",
                  filtering: false,
                },

                { title: "Reporter", field: "reporter" },

                { title: "Priority", field: "ticketPriority" },

                { title: "Assignee", field: "assignee" },
                {
                  title: "Status",
                  field: "status",
                  lookup: {
                    OPEN: "OPEN",
                    IN_PROGRESS: "IN_PROGRESS",
                    CLOSED: "CLOSED",
                    BLOCKED: "BLOCKED",
                  },
                },
              ]}
              options={{
                filtering: true,

                exportMenu: [
                  {
                    label: "Export pdf",
                    exportFunc: (cols, data) =>
                      ExportPdf(cols, data, "Ticket Records"),
                  },
                  {
                    label: "Export Csv",
                    exportFunc: (cols, data) =>
                      ExportCsv(cols, data, "Ticket Records"), //Export excelfile
                  },
                ],
                headerStyle: {
                  backgroundColor: "darkblue",
                  color: "white",
                },
                rowStyle: {
                  backgroundColor: "lavender",
                },
              }}
              title="TICKET RECORDS"
            />

            <Modal
              show={ticketUpdateModal}
              onHide={closeTicketUpdationModal}
              backdrop="static"
              keyboard={false}
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>Edit details</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onClick={updateTicket}>
                  <div className="p-1">
                    <h5 className="text-secondary">
                      Ticket ID:{selectedCurrTicket.id}
                    </h5>
                    <hr />
                    <div className="input-group m-1 p-1">
                      <label className="input-group-text">
                        Title:
                        <input
                          type="text"
                          className="form-control"
                          name="title"
                          value={selectedCurrTicket.title}
                          onChange={onTicketUpdate}
                          required
                        />
                      </label>
                      <div className="input-group m-1 p-1">
                        <label className="input-group-text">
                          Description:
                          <input
                            type="text"
                            className="form-control"
                            value={selectedCurrTicket.description}
                            name="description"
                            onChange={onTicketUpdate}
                          />
                        </label>
                      </div>
                      <div className="input-group m-1 p-1">
                        <label className="input-group-text">
                          Priority:
                          <input
                            type="text"
                            className="form-control"
                            value={selectedCurrTicket.ticketPriority}
                            name="ticketPriority"
                            onChange={onTicketUpdate}
                          />
                        </label>
                      </div>
                      <div className="input-group m-1 p-1">
                        <label className="input-group-text">Assignee:</label>
                        <select
                          className="form-select"
                          name="assignee"
                          value={selectedCurrTicket.assignee}
                          onChange={onTicketUpdate}
                        >
                          {/* we want the full user list printed ere so that we can assign the new user 
                              - The user List is coming from the getUsers api ===> userDetails
                              - We only want to print engineers 
                          */}
                          {userList.map((e, key) => {
                            if (e.userTypes === "ENGINEER")
                              return (
                                <option key={key} value={e.value}>
                                  {e.name}
                                </option>
                              );
                            else return undefined;
                          })}
                        </select>
                      </div>
                    </div>
                    <div className="input-group m-1 p-1">
                      <label className="input-group-text">Status:</label>
                      <select
                        className="form-select"
                        name="status"
                        value={selectedCurrTicket.status}
                        onChange={onTicketUpdate}
                      >
                        <option value="OPEN">OPEN</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="BLOCKED">BLOCKED</option>
                        <option value="CLOSED">CLOSED</option>
                      </select>
                    </div>
                  </div>
                  <hr />
                </Form>
                <Stack
                  direction="horizontal"
                  gap={3}
                  style={{ float: "right" }}
                >
                  <Button
                    variant="secondary"
                    onClick={() => closeTicketUpdationModal()}
                  >
                    Close
                  </Button>
                  <Button variant="primary" type="submit">
                    Update
                  </Button>
                </Stack>
              </Modal.Body>
            </Modal>
            <hr />
            {/* User records*/}
            <div className="text-success fs-3">
              {message.includes("User") ? message : ""}
            </div>

            <div style={{ maxWidth: "100%" }}>
              <MaterialTable
                onRowClick={(event, rowData) => fetchUser(rowData.userId)}
                data={userList}
                columns={[
                  { title: "User ID", field: "userId" },
                  { title: "Name", field: "name" },
                  { title: "Email", field: "email" },
                  {
                    title: "UserTypes",
                    field: "userTypes",
                    lookup: {
                      ADMIN: "ADMIN",
                      CUSTOMER: "CUSTOMER",
                      ENGINEER: "ENGINEER",
                    },
                  },
                  {
                    title: "UserStatus",
                    field: "userStatus",
                    lookup: {
                      APPROVED: "APPROVED",
                      PENDING: "PENDING",
                      REJECTED: "REJECTED",
                    },
                  },
                ]}
                options={{
                  filtering: true,
                  sorting: true,
                  exportMenu: [
                    {
                      label: "Export pdf",
                      exportFunc: (cols, data) =>
                        ExportPdf(cols, data, "User Records"),
                    },
                    {
                      label: "Export Csv",
                      exportFunc: (cols, data) =>
                        ExportCsv(cols, data, "User Records"), //Export excelfile
                    },
                  ],
                  headerStyle: {
                    backgroundColor: "darkblue",
                    color: "white",
                  },
                  rowStyle: {
                    backgroundColor: "lavender",
                  },
                }}
                title="USER RECORDS"
              />
            </div>
            <Modal
              show={userModal}
              onHide={onCloseUserModal}
              backdrop="static"
              keyboard={false}
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>Edit details</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={updateUserDetail}>
                  <div className="p-1">
                    <h5 className="text-secondary">
                      User ID:{userDetails.userId}
                    </h5>
                    <hr />
                    <div className="input-group m-1 p-1">
                      <label className="input-group-text">
                        Name:
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          value={userDetails.name}
                          onChange={changeUserDetail}
                        />
                      </label>
                    </div>

                    <div className="input-group m-1 p-1">
                      <label className="input-group-text">
                        Email:
                        <input
                          type="text"
                          className="form-control"
                          name="email"
                          value={userDetails.email}
                          onChange={changeUserDetail}
                        />
                      </label>
                    </div>
                    <div className="input-group m-1 p-1">
                      <label className="input-group-text">Type:</label>
                      <select
                        className="form-select"
                        name="type"
                        value={userDetails.userTypes}
                        onChange={changeUserDetail}
                      >
                        <option value="ADMIN">ADMIN</option>
                        <option value="CUSTOMER">CUSTOMER</option>
                        <option value="ENGINEER">ENGINEER</option>
                      </select>
                    </div>

                    <div className="input-group m-1 p-1">
                      <label className="input-group-text">Status:</label>
                      <select
                        name="status"
                        className="form-select"
                        value={userDetails.userStatus}
                        onChange={changeUserDetail}
                      >
                        <option value="APPROVED">APPROVED</option>
                        <option value="REJECTED">REJECTED</option>
                        <option value="PENDING">PENDING</option>
                      </select>
                    </div>
                  </div>
                  <hr />
                </Form>
                <Stack
                  direction="horizontal"
                  gap={3}
                  style={{ float: "right" }}
                >
                  <Button
                    variant="secondary"
                    onClick={() => onCloseUserModal()}
                  >
                    Close
                  </Button>
                  <Button variant="primary" onClick={() => updateUserDetail()}>
                    Update
                  </Button>
                </Stack>
              </Modal.Body>
            </Modal>
          </div>
        </div>
      </div>
      <br />
      <footer>
        <div className="text-center py-3">
          © 2022 Copyright:
          <a
            href="https://relevel.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Relevel by Unacademy
          </a>
        </div>
      </footer>
    </div>
  );
}

export default Admin;

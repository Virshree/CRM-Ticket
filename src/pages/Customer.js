import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import MaterialTable from "@material-table/core";
import { ExportCsv, ExportPdf } from "@material-table/exporters";
import { Modal, Button } from "react-bootstrap";
import { fetchTicket, ticketCreation, ticketUpdation } from "../api/ticket";
/*
UI : 
: Sidebar
: Cards : react circular progress bar 
: Material Table : to display all the tickets 
: Modal : raise a new ticket 
LOGIC : 
All state values : 
: modal : raise ticket, updateTicket
: ticketDetails : to store all the tickets raised by the user : fetch tickets 
: ticketCount : segregating the tickets according to their status
: currTicket : to update the details , edit the tickets
//1.grab the value in state
// 2 .store the value
*/

function Customer() {
  const [raiseTicketModal, setRaiseTicketModal] = useState(false);
  //get all the ticket created by user.
  const [ticketDetails, setticketDetails] = useState([]);
  const [message, setMessage] = useState("");
  const showTicketModal = () => setRaiseTicketModal(true);
  const closeTicketModal = () => {
    setRaiseTicketModal(false);
  };

  //calling api on first render
  useEffect(() => {
    (async () => {
      fetchTickets();
    })();
  }, []);

  //get all ticket
  const fetchTickets = () => {
    fetchTicket()
      .then(function (response) {
        console.log(response.data);
        setticketDetails(response.data);
      })
      .catch(function (error) {
        console.log(error);
        setMessage(error.message);
      });
  };

  //Post a ticket
  const createTicket = (e) => {
    e.preventDefault();
    const data = {
      title: e.target.title.value,
      description: e.target.description.value,
    };
    console.log(data);
    //call api
    ticketCreation(data)
      .then(function (response) {
        if (response.status === 201) {
          console.log(response);
          setMessage("Ticket created successfully");
          closeTicketModal();
          fetchTickets();
        }
      })
      .catch((error) => {
        console.log(error);
        setMessage(error.message);
      });
  };
  return (
    <>
      <div className="bg-light text-center min-vh-100">
        <div className="col-1">
          <Sidebar />
        </div>
        <div className="container">
          <div className="text-center">
            <h3 className="text-success">Welcome, Customer</h3>
            <div className="row container  my-5 mx-4 text-center">
              <div className="col my-1 p-2">
                <div
                  className="borders-b card bg-primary bg-opacity-25 p-2"
                  style={{ width: 12 + "rem" }}
                >
                  <div className="cardbody">
                    <h5 className="card-subtitle">
                      <i className="bi bi-pen text-primary mx-2"></i>
                      OPEN
                    </h5>
                    <hr />
                    <div className="row ">
                      <div className="col">6</div>
                      <div className="col">
                        <div style={{ height: 30, width: 30 }}>
                          <CircularProgressbar
                            value={6}
                            styles={buildStyles({
                              textColor: "blue",
                              pathColor: "darkBlue",
                            })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col my-1 p-2">
                <div
                  className="borders-b card bg-warning bg-opacity-25 p-2"
                  style={{ width: 12 + "rem" }}
                >
                  <div className="cardbody">
                    <h5 className="card-subtitle">
                      <i className="bi bi-lightning-charge text-warning mx-2"></i>
                      PROGRESS
                    </h5>
                    <hr />
                    <div className="row">
                      <div className="col"> {5}</div>
                      <div className="col">
                        <div style={{ height: 30, width: 30 }}>
                          <CircularProgressbar
                            value={5}
                            styles={buildStyles({
                              textColor: "yellow",
                              pathColor: "darkgoldenrod",
                            })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col my-1 p-2">
                <div
                  className="borders-b card bg-success bg-opacity-25 p-2"
                  style={{ width: 12 + "rem" }}
                >
                  <div className="cardbody">
                    <h5 className="card-subtitle">
                      <i className="bi bi-check2-circle text-success mx-2"></i>
                      CLOSED
                    </h5>
                    <hr />
                    <div className="row">
                      <div className="col">{7}</div>
                      <div className="col">
                        <div style={{ height: 30, width: 30 }}>
                          <CircularProgressbar
                            value={7}
                            styles={buildStyles({
                              textColor: "green",
                              pathColor: "darkolivegreen",
                            })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col my-1 p-2">
                <div
                  className="borders-b card bg-secondary bg-opacity-25 p-2"
                  style={{ width: 12 + "rem" }}
                >
                  <div className="cardbody">
                    <h5 className="card-subtitle">
                      <i className="bi bi-slash-circle text-secondary mx-2"></i>
                      BLOCKED
                    </h5>
                    <hr />
                    <div className="row">
                      <div className="col">{0}</div>
                      <div className="col">
                        <div style={{ height: 30, width: 30 }}>
                          <CircularProgressbar
                            value={0}
                            styles={buildStyles({
                              textColor: "grey",
                              pathColor: "silver",
                            })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr />
          <div className="container">
            <div className="text-success fs-3">
              {message.includes("Ticket") ? message : ""}
            </div>
            <MaterialTable
              data={ticketDetails}
              columns={[
                {
                  title: "Ticket ID",
                  field: "id",
                },
                {
                  title: "TITLE",
                  field: "title",
                },
                {
                  title: "DESCRIPTIONS",
                  field: "description",
                  filtering: false,
                },
                {
                  title: "PRIORITY",
                  field: "ticketPriority",
                },
                {
                  title: "ASSIGNEE",
                  field: "assignee",
                },
                {
                  title: "Status",
                  field: "status",
                  lookup: {
                    OPEN: "OPEN",
                    IN_PROGRESS: "IN_PROGRESS",
                    BLOCKED: "BLOCKED",
                    CLOSED: "CLOSED",
                  },
                },
              ]}
              options={{
                filtering: true,
                headerStyle: {
                  backgroundColor: "darkgreen",
                  color: "#fff",
                },
              }}
              title="TICKETS RAISED BY YOU"
            />
          </div>

          <hr />
          <div className="container text-center">
            <button
              className="form-control btn btn-success"
              onClick={showTicketModal}
            >
              Raise Ticket
            </button>

            {raiseTicketModal ? (
              <Modal
                show={raiseTicketModal}
                onHide={closeTicketModal}
                bakdrop="static"
                centered
              >
                <Modal.Header closeButton>
                  <Modal.Title>Create Ticket</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <form onSubmit={createTicket}>
                    <div className="p-1">
                      <div className="input-group p-1">
                        <input
                          type="text"
                          name="title"
                          className="form-control"
                          placeholder="Title"
                        />
                      </div>
                      <div className="input-group p-1">
                        <textarea
                          type="text"
                          name="description"
                          className="form-control"
                          placeholder="Description"
                        />
                      </div>

                      <div className="input-group d-flex justify-content-center">
                        <div className="m-1">
                          <Button variant="secondary">Cancel</Button>
                        </div>
                        <div className="m-1">
                          <Button variant="success" type="submit">
                            Create
                          </Button>
                        </div>
                      </div>
                    </div>
                  </form>
                </Modal.Body>
              </Modal>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Customer;

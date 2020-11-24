import {
    serviceMaker,
    methods,
    api
  } from "./index.js"
  

  export const getTicket = (officeId) => serviceMaker(
    `/tickets/office/${officeId}`,
    methods.GET,
    api.NGB
  );
  export const createTicket = (office_Id,payload) => serviceMaker(
    `/tickets/office/${office_Id}`,
    methods.POST,
    api.NGB,
    payload
  );
  export const updateTicket = (ticket_Id,payload) => serviceMaker(
    `/tickets/office/${ticket_Id}`,
    methods.PUT,
    api.NGB,
    payload
  );
  export const closeTicket = (ticket_Id,payload) => serviceMaker(
    `/tickets/office/close/${ticket_Id}`,
    methods.PUT,
    api.NGB,
    payload
  );
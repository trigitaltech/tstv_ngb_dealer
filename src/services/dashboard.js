import {
    serviceMaker,
    methods,
    api
  } from "./index.js"
  
  export const getCardData = () => serviceMaker('/clients/dashboard', methods.GET, api.NGB);
  export const getClientCounts = () => serviceMaker('/runreports/ClientCounts?genericResultSet=false', methods.GET, api.NGB)
  export const getSTBCounts = () => serviceMaker('/runreports/STBCount?genericResultSet=false', methods.GET, api.NGB)
  export const getAmountCollected = () => serviceMaker(
    `/runreports/Paymode Collection Chart?R_endDate=2019-12-31&R_officeId=-1&R_startDate=2019-12-01&genericResultSet=false`,
    methods.GET,
    api.NGB
  )
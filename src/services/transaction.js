import {
    serviceMaker,
    methods,
    api
  } from "./index.js"
  
  export const getactivationsBySE = (officeId,fromDate, toDate) => serviceMaker(
    `/runreports/ClientActivationsForDelaer?R_startDate=${fromDate}&R_endDate=${toDate}&R_officeId=${officeId}`
  ,
    methods.GET,
    api.NGB
  );

  export const currentactivationsBySE = (officeId,fromDate, toDate) => serviceMaker(
    `/runreports/ActivationReportAlongWithPlansAndProvisioning?R_startDate=${fromDate}&R_endDate=${toDate}&R_officeId=${officeId}`
  ,
    methods.GET,
    api.NGB
  );

  export const getactivations = (officeId) => serviceMaker(
    `/runreports/ClientActivationsForDelaer/${officeId}`,
    methods.GET,
    api.NGB
  );

  export const getTransactionHistoryOfficeBySE = (officeId,fromDate, toDate) => serviceMaker(
    `/financialTransactions/officeid/${officeId}?fromDate=${fromDate}&toDate=${toDate}`,
    methods.GET,
    api.NGB
  );

  export const getTransactionHistoryOffice = (officeId) => serviceMaker(
    `/financialTransactions/officeid/${officeId}`,
    methods.GET,
    api.NGB
  );

  // https://tstvbilling.com:8877/ngbplatform/api/v1/runreports/ClientActivationsForDelaer?R_endDate=2020-11-17&R_startDate=2020-11-16&R_officeId=10
import {
    serviceMaker,
    methods,
    api
  } from "./index.js"

  export const getoffice= () => serviceMaker(
    `/offices/officesView?limit=14&offset=0`,
    methods.GET,
    api.NGB
  );

export const getvouchercodes= () => serviceMaker(
    `/itemsales/template`,
    methods.GET,
    api.NGB
  );

  export const getVoucherRequest = (officeId) => serviceMaker(
    `/itemsales/voucherrequest/${officeId}`,
    methods.GET,
    api.NGB
  );
  export const createVoucher = (payload) => serviceMaker(
    `/itemsales`,
    methods.POST,
    api.NGB,
    payload
  );
  export const voucherView = (id) => serviceMaker(
    `/vouchers/requestdetails/${id}`,
    methods.GET,
    api.NGB
  );
  export const exportVoucher = (client_id,payload) => serviceMaker(
    `/vouchers/export/${client_id}`,
    methods.POST,
    api.NGB,
    payload
  );

  export const exportVoucherView = (id) => serviceMaker(
    `/vouchers/exportrequestdetails/${id}`,
    methods.GET,
    api.NGB
  );

  export const vouchersDownload = (id) => serviceMaker(
    `vouchers/download/${id}`,
    methods.GET,
    api.NGB
  );
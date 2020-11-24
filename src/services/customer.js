import { serviceMaker, methods, api } from './index.js'

export const  getStatusService = (id) =>
serviceMaker(`/revpay/status/${id}`, methods.GET, api.NGB)


export const searchCustomer = (customerBy, query) =>
  serviceMaker(
    `/clients/search/${customerBy}?columnValue=${query}`,
    methods.GET,
    api.NGB
  )
  export const verifyusername = (username) =>
  serviceMaker(
    `/users/verifyusername/${username}`,
    methods.GET,
    api.NGB
  )
  export const verifyemail = (email) =>
  serviceMaker(
    `/users/verifyemail/${email}`,
    methods.GET,
    api.NGB
  )
 
  export const confirmemail = (email) =>
  serviceMaker(
    `/users/generatekey/${email}`,
    methods.PUT,
    api.NGB
  )
  export const changepassword = (id,payload) =>
  serviceMaker(
    `/users/validate/${id}`,
    methods.PUT,
    api.NGB,
    payload
  )
  export const updatepassword = (id,payload) =>
  serviceMaker(
    `/users/${id}`,
    methods.PUT,
    api.NGB,
    payload
  )

export const searchCustomerId = (id) =>
  serviceMaker(`/clients/getclient360?key=id&value=${id}`, methods.GET, api.NGB)

export const orderByClient = (planType, id) =>
  serviceMaker(
    `/orders/getRenewalOrderByClient?planType=${planType}&clientId=${id}`,
    methods.GET,
    api.NGB
  )

export const transaction = (clientId, fromDate, toDate) =>
  serviceMaker(
    `/transactionhistory/${clientId}?fromDate=${fromDate}&limit=14&offset=0&toDate=${toDate}`,
    methods.GET,
    api.NGB
  )

export const selectedMovieList = (name) =>
  serviceMaker(`/assets/PWMovieItemDetails/${name}`, methods.GET, api.NGB)

  export const ordersdisconnect = () =>
  serviceMaker(`/orders/disconnect`, methods.GET, api.NGB)
  
export const movieItemDetails = () =>
  serviceMaker(`/assets/mediadata`, methods.GET, api.NGB)

export const movieList = (id) =>
  serviceMaker(`/eventorder?clientId=${id}`, methods.GET, api.NGB)

export const moviePurchase = (customerid, payload) =>
  serviceMaker(
    `/orders/TOVDtopUp`,
    methods.POST,
    api.NGB,
    payload
  )

export const makeOnlinePayment = (payload) =>
  serviceMaker('/revpay/createorder',methods.POST, api.NGB,payload)

export const topUp = (orderId, payload) =>
  serviceMaker(`/orders/topUp/${orderId}`, methods.POST, api.NGB, payload)

export const refresh = (payload) =>
  serviceMaker(`/orders/retrackOsdmessage`, methods.POST, api.NGB, payload)
 
  export const  redeem = (payload) =>
  serviceMaker(`/redemption`, methods.POST, api.NGB, payload)
 
  export const  cancelplan = (orderId,payload) =>
  serviceMaker(`/orders/${orderId}`, methods.PUT, api.NGB, payload)
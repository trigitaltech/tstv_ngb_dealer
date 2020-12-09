import {
    serviceMaker,
    methods,
    api
} from "./index.js"

export const authAPI = (username, password) => serviceMaker(`/authentication?username=${username}&password=${password}`, methods.POST, api.NGB, '', {})
export const registerTemplete = () => serviceMaker(`/clients/template`, methods.GET, api.NGB)
export const cityTemplete = (city) => serviceMaker(`/address/template/${city}`, methods.GET, api.NGB)

export const simpleactivation = (payload) => serviceMaker(`/activationprocess/simpleactivation`, methods.POST, api.NGB, payload)

export const editcustomer = (payload,id) => serviceMaker (`/clients/${id}`, methods.PUT, api.NGB, payload)
export const plandetails = () => serviceMaker(`/chargecode/template`, methods.GET, api.NGB)

export const planlist = () => serviceMaker(`/usercataloge/salesPlanCategory?category=all`, methods.GET, api.NGB)

export const plans = () => serviceMaker(`/plans`, methods.GET, api.NGB)

export const planprice = (id) => serviceMaker(`/prices/${id}?template=true`, methods.GET, api.NGB)

export const  redeem = (payload) =>
serviceMaker(`/redemption`, methods.POST, api.NGB, payload)
export const plandata = (id,cid,sid) => serviceMaker(`/salescataloge/salescataloges/${id}?clientId=${cid}&clientServiceId=${sid}&planId=0`, methods.GET, api.NGB)

export const addplan = (id,payload) => serviceMaker(`/multipleorders/${id}`, methods.POST, api.NGB,payload)

 

export const searchvoucher = (id) => serviceMaker(`/vouchers/verify?pinNumber=${id}`, methods.GET, api.NGB)

export const voucherreport = (id) => serviceMaker(`/runreports/VoucherSearch?R_pinNo=${id}`, methods.GET, api.NGB)


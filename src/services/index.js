import axios from 'axios'
import https from 'https'

export function isValidResponse (resp) {
  return resp && resp.status === 200 && resp.data.status === 1
}

export const NGB = axios.create({

  // baseURL: 'https://localhost/ngbplatform/api/v1/'
  // baseURL: 'https://tstvbilling.com:8877/ngbplatform/api/v1/'
  // baseURL: 'https://tstvbilling.com/ngbplatform/api/v1/',
  baseURL: 'https://tstv.nextgenerationbilling.com/ngbplatform/api/v1/',
  // baseURL: 'https://demo.nextgenerationbilling.com/ngbplatform/api/v1/',
})

export const api = {
  NGB,
}

export const methods = {
  DELETE: 'DELETE',
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  WITHOUT_BODY_POST: 'WITHOUT_BODY_POST'
}

export class APIError {
  message

  constructor (msg) {
    this.message = msg
  }

  get getMessage () {
    return this.message
  }
}

export let headers = {
  'Content-Type': 'application/json',
  'X-Obs-Platform-TenantId': 'default'
}

export const setAuthorizationHeader = (token) => {
  headers.Authorization = `Basic ${token}`
}
export const removeHeader = (key) => {
  delete headers[key];
}
export const setHeader = (key, value) => {
  headers[key] = value;
}

export const serviceMaker = async (url, type, service, data) => {
  try {
    let result
    const APIInstance = NGB
    
    switch (type) {
      case 'GET': {
        result = await APIInstance.get(url,{ headers: headers })
        break
      }
      case 'POST': {
        result = await APIInstance.post(url, data, { headers: headers })
        break
      }
      case 'PUT': {
        result = await APIInstance.put(url, data, { headers: headers })
        break
      }
      case 'DELETE': {
        result = await APIInstance.delete(url, { headers: headers })
        break
      }
      default: {
        // eslint-disable-next-line no-throw-literal
        throw 'InvalidMethod'
      }
    }
    if (!isValidResponse) {
      // eslint-disable-next-line no-throw-literal
      throw 'InvalidResponse'
    }
    return result
  } catch (err) {
    // tslint:disable-next-line:no-console
    throw new APIError(err.response ? err.response.data : 'Something went wrong')
  }
}

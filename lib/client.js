import axios from "axios"
import { baseURL  } from "./baseURL"

export const client = axios.create({ 
    baseURL,
    withCredentials: true,
})
export function medusaRequest(method, path = "", payload = {}) {
  const options = {
    method,
    withCredentials: true,
    url: path,
    data: payload,
    json: true,
  }
  return client(options)
}

export const multipartRequest = (path, payload) => {
  const options = {
    withCredentials: true,
    headers: {
      "content-type": "multipart/form-data",
    },
  }

  return client.post(path, payload, options)
}

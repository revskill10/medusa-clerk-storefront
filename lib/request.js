import axios from "axios"

let baseURL = "http://localhost:9000"


// takes precedence over NEXT_PUBLIC_STORE_URL
if (process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL) {
  baseURL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
}
const headers = {
    'Authorization': `Bearer ${process.env.API_TOKEN}`
}
export const client = axios.create({ baseURL, headers })

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

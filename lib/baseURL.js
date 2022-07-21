let baseURL = "http://localhost:9000"

// takes precedence over NEXT_PUBLIC_STORE_URL
if (process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL) {
  baseURL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
}

export { baseURL }
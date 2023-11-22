import axios from 'axios'

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'X-Cassandra-Token': process.env.CLIENT_TOKEN
}

export const serverApi = axios.create({
  baseURL: process.env.BASE_URL,
  headers,
})

serverApi.interceptors.response.use(
  (response) => response.data,
  (err) => {
    return err.response
  }
)

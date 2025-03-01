import axios from 'axios'

// Deprecated
const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'X-Cassandra-Token': process.env.CLIENT_TOKEN
}

// Deprecated
export const serverApi = axios.create({
  baseURL: process.env.BASE_URL,
  headers,
})

// Deprecated
serverApi.interceptors.response.use(
  (response) => response.data,
  (err) => {
    return err.response
  }
)

const v2Headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  // 'X-Access-Token': process.env.CLIENT_TOKEN
}

export const v2Api = axios.create({
  headers: v2Headers,
});

v2Api.interceptors.response.use(
  (response) => response,
  (err) => {
    return err.response
  }
)

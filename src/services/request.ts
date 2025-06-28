import axios from 'axios'
import { useTokenStore } from '@/stores/token.ts'

const baseURL = '/api'
const instance = axios.create({ baseURL })

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    const tokenStore = useTokenStore()
    if (tokenStore.token.access_token) {
      config.headers.Authorization =
        tokenStore.token.token_type + ' ' + tokenStore.token.access_token
    }
    return config
  },
  (err) => {
    return Promise.reject(err)
  },
)
// 响应拦截器
instance.interceptors.response.use(
  (result) => {
    if (result.data.status_code == 0) {
      return result.data
    }
    return Promise.reject(result)
  },
  (err) => {
    return Promise.reject(err)
  },
)

export default instance

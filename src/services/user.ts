import request from '@/services/request.ts'

interface Response {
  status_code: number
  message: string
  timestamp: string
  data: any
}

interface UserData {
  username: string
  password: string
}

interface UserInfo {
  id: number
  username: string
  email: string
  phone: string
  role: string
}

interface UserPassword {
  password: string
  new_password: string
  re_password: string
}

// 登录接口
export const userLoginService = async (login_data: UserData) => {
  const data = (await request.post('/user/login', login_data)) as any
  const response: Response = {
    status_code: data.status_code,
    message: data.message,
    timestamp: data.timestamp,
    data: data.data,
  }
  return response
}

// 注册接口
export const userRegisterService = async (signup_data: UserData) => {
  const data = (await request.post('/user/register', signup_data)) as any
  const response: Response = {
    status_code: data.status_code,
    message: data.message,
    timestamp: data.timestamp,
    data: data.data,
  }
  return response
}

// 获取用户信息接口
export const getUserInfoService = async () => {
  const data = (await request.get('/user/info')) as any
  const response: Response = {
    status_code: data.status_code,
    message: data.message,
    timestamp: data.timestamp,
    data: data.data,
  }
  return response
}

// 更新用户信息接口
export const updateUserInfoService = async (user_info: UserInfo) => {
  const data = (await request.patch('/user/update', user_info)) as any
  const response: Response = {
    status_code: data.status_code,
    message: data.message,
    timestamp: data.timestamp,
    data: data.data,
  }
  return response
}

// 修改用户密码接口
export const updateUserPasswordService = async (password: UserPassword) => {
  const data = (await request.patch('/user/password', password)) as any
  const response: Response = {
    status_code: data.status_code,
    message: data.message,
    timestamp: data.timestamp,
    data: data.data,
  }
  return response
}

// 获取用户列表接口
export const getUserListService = async (params: any) => {
  const data = (await request.get('/user/list', { params })) as any
  const response: Response = {
    status_code: data.status_code,
    message: data.message,
    timestamp: data.timestamp,
    data: data.data,
  }
  return response
}

// 删除用户接口
export const deleteUserService = async (params: any) => {
  const data = (await request.delete('/user/delete', { params })) as any
  const response: Response = {
    status_code: data.status_code,
    message: data.message,
    timestamp: data.timestamp,
    data: data.data,
  }
  return response
}

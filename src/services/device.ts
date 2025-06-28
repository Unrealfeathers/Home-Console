import request from '@/services/request.ts'

interface Response {
  status_code: number
  message: string
  timestamp: string
  data: any
}

// 增加设备接口
export const addDeviceService = async (params: any) => {
  const data = (await request.post('/device/add', params)) as any
  const response: Response = {
    status_code: data.status_code,
    message: data.message,
    timestamp: data.timestamp,
    data: data.data,
  }
  return response
}

// 删除设备接口
export const deleteDeviceService = async (params: any) => {
  const data = (await request.delete('/device/delete', { params })) as any
  const response: Response = {
    status_code: data.status_code,
    message: data.message,
    timestamp: data.timestamp,
    data: data.data,
  }
  return response
}

// 获取设备列表接口
export const getDeviceListService = async (params: any) => {
  const data = (await request.get('/device/list', { params })) as any
  const response: Response = {
    status_code: data.status_code,
    message: data.message,
    timestamp: data.timestamp,
    data: data.data,
  }
  return response
}

// 更新设备接口
export const updateDeviceService = async (params: any) => {
  const data = (await request.patch('/device/update', params)) as any
  const response: Response = {
    status_code: data.status_code,
    message: data.message,
    timestamp: data.timestamp,
    data: data.data,
  }
  return response
}

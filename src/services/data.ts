import request from '@/services/request.ts'

interface Response {
  status_code: number
  message: string
  timestamp: string
  data: any
}

// 获取数据列表接口
export const getDataListService = async (params: any) => {
  const data = (await request.get('/data/list', { params })) as any
  const response: Response = {
    status_code: data.status_code,
    message: data.message,
    timestamp: data.timestamp,
    data: data.data,
  }
  return response
}

// 删除数据接口
export const deleteDataService = async (params: any) => {
  const data = (await request.delete('/data/delete', { params })) as any
  const response: Response = {
    status_code: data.status_code,
    message: data.message,
    timestamp: data.timestamp,
    data: data.data,
  }
  return response
}

import request from '@/utils/request'

export function getResume() {
  return request.get('/resume')
}

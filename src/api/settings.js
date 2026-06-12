import request from '@/utils/request'

export function getSiteSettings() {
  return request.get('/settings')
}

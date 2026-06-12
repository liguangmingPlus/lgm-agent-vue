import request from '@/utils/request'

export function getTimelineList(params) {
  return request.get('/timeline', { params })
}

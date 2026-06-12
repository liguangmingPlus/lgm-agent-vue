import request from '@/utils/request'

export function getGuestbookList(params) {
  return request.get('/guestbook', { params })
}

export function postMessage(data) {
  return request.post('/guestbook', data)
}

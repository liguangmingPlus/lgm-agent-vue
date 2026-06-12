import request from '@/utils/request'

export function getFriendList() {
  return request.get('/friends')
}

export function applyFriendLink(data) {
  return request.post('/friends/apply', data)
}

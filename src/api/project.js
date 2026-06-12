import request from '@/utils/request'

export function getProjectList(params) {
  return request.get('/projects', { params })
}

export function getProjectDetail(id) {
  return request.get(`/projects/${id}`)
}

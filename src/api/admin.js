import request from '@/utils/request'

export function adminGetArticleList(params) {
  return request.get('/admin/articles', { params })
}

export function adminGetArticle(id) {
  return request.get(`/admin/articles/${id}`)
}

export function adminCreateArticle(data) {
  return request.post('/admin/articles', data)
}

export function adminUpdateArticle(id, data) {
  return request.put(`/admin/articles/${id}`, data)
}

export function adminDeleteArticle(id) {
  return request.delete(`/admin/articles/${id}`)
}

export function adminGetCategoryList(params) {
  return request.get('/admin/categories', { params })
}

export function adminCreateCategory(data) {
  return request.post('/admin/categories', data)
}

export function adminUpdateCategory(id, data) {
  return request.put(`/admin/categories/${id}`, data)
}

export function adminDeleteCategory(id) {
  return request.delete(`/admin/categories/${id}`)
}

export function adminGetTagList(params) {
  return request.get('/admin/tags', { params })
}

export function adminCreateTag(data) {
  return request.post('/admin/tags', data)
}

export function adminUpdateTag(id, data) {
  return request.put(`/admin/tags/${id}`, data)
}

export function adminDeleteTag(id) {
  return request.delete(`/admin/tags/${id}`)
}

export function adminGetProjectList(params) {
  return request.get('/admin/projects', { params })
}

export function adminGetProject(id) {
  return request.get(`/admin/projects/${id}`)
}

export function adminCreateProject(data) {
  return request.post('/admin/projects', data)
}

export function adminUpdateProject(id, data) {
  return request.put(`/admin/projects/${id}`, data)
}

export function adminDeleteProject(id) {
  return request.delete(`/admin/projects/${id}`)
}

export function adminGetResumeInfo() {
  return request.get('/admin/resume/info')
}

export function adminUpdateResumeInfo(data) {
  return request.put('/admin/resume/info', data)
}

export function adminGetExperienceList() {
  return request.get('/admin/resume/experiences')
}

export function adminCreateExperience(data) {
  return request.post('/admin/resume/experiences', data)
}

export function adminUpdateExperience(id, data) {
  return request.put(`/admin/resume/experiences/${id}`, data)
}

export function adminDeleteExperience(id) {
  return request.delete(`/admin/resume/experiences/${id}`)
}

export function adminGetEducationList() {
  return request.get('/admin/resume/educations')
}

export function adminCreateEducation(data) {
  return request.post('/admin/resume/educations', data)
}

export function adminUpdateEducation(id, data) {
  return request.put(`/admin/resume/educations/${id}`, data)
}

export function adminDeleteEducation(id) {
  return request.delete(`/admin/resume/educations/${id}`)
}

export function adminGetSkillList() {
  return request.get('/admin/resume/skills')
}

export function adminCreateSkill(data) {
  return request.post('/admin/resume/skills', data)
}

export function adminUpdateSkill(id, data) {
  return request.put(`/admin/resume/skills/${id}`, data)
}

export function adminDeleteSkill(id) {
  return request.delete(`/admin/resume/skills/${id}`)
}

export function adminGetGuestbookList(params) {
  return request.get('/admin/guestbook', { params })
}

export function adminReplyMessage(id, data) {
  return request.put(`/admin/guestbook/${id}/reply`, data)
}

export function adminDeleteMessage(id) {
  return request.delete(`/admin/guestbook/${id}`)
}

export function adminGetFriendList(params) {
  return request.get('/admin/friends', { params })
}

export function adminCreateFriend(data) {
  return request.post('/admin/friends', data)
}

export function adminUpdateFriend(id, data) {
  return request.put(`/admin/friends/${id}`, data)
}

export function adminDeleteFriend(id) {
  return request.delete(`/admin/friends/${id}`)
}

export function adminGetTimelineList(params) {
  return request.get('/admin/timeline', { params })
}

export function adminCreateTimeline(data) {
  return request.post('/admin/timeline', data)
}

export function adminUpdateTimeline(id, data) {
  return request.put(`/admin/timeline/${id}`, data)
}

export function adminDeleteTimeline(id) {
  return request.delete(`/admin/timeline/${id}`)
}

export function adminGetSettings() {
  return request.get('/admin/settings')
}

export function adminUpdateSettings(data) {
  return request.put('/admin/settings', data)
}

export function adminUpload(file) {
  const formData = new FormData()
  formData.append('file', file)
  return request.post('/admin/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export function adminGetDashboard() {
  return request.get('/admin/dashboard')
}

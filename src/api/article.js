import request from '@/utils/request'

export function getArticleList(params) {
  return request.get('/articles', { params })
}

export function getArticleDetail(id) {
  return request.get(`/articles/${id}`)
}

export function searchArticles(params) {
  return request.get('/articles/search', { params })
}

export function getCategories() {
  return request.get('/categories')
}

export function getTags() {
  return request.get('/tags')
}

import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/FrontLayout.vue'),
    children: [
      { path: '', name: 'Home', component: () => import('@/views/home/HomeView.vue') },
      { path: 'blog', name: 'Blog', component: () => import('@/views/blog/BlogList.vue') },
      { path: 'blog/:id', name: 'BlogDetail', component: () => import('@/views/blog/BlogDetail.vue') },
      { path: 'projects', name: 'Projects', component: () => import('@/views/project/ProjectList.vue') },
      { path: 'projects/:id', name: 'ProjectDetail', component: () => import('@/views/project/ProjectDetail.vue') },
      { path: 'resume', name: 'Resume', component: () => import('@/views/resume/ResumeView.vue') },
      { path: 'about', name: 'About', component: () => import('@/views/about/AboutView.vue') },
      { path: 'guestbook', name: 'Guestbook', component: () => import('@/views/guestbook/GuestbookView.vue') },
      { path: 'friends', name: 'Friends', component: () => import('@/views/friends/FriendsView.vue') },
      { path: 'agent', name: 'Agent', component: () => import('@/views/agent/AgentChat.vue') }
    ]
  },
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: () => import('@/views/admin/AdminLogin.vue')
  },
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/admin/dashboard' },
      { path: 'dashboard', name: 'Dashboard', component: () => import('@/views/admin/DashboardView.vue') },
      { path: 'articles', name: 'ArticleManage', component: () => import('@/views/admin/ArticleManage.vue') },
      { path: 'articles/edit/:id?', name: 'ArticleEdit', component: () => import('@/views/admin/ArticleEdit.vue') },
      { path: 'categories', name: 'CategoryManage', component: () => import('@/views/admin/CategoryManage.vue') },
      { path: 'tags', name: 'TagManage', component: () => import('@/views/admin/TagManage.vue') },
      { path: 'projects', name: 'ProjectManage', component: () => import('@/views/admin/ProjectManage.vue') },
      { path: 'projects/edit/:id?', name: 'ProjectEdit', component: () => import('@/views/admin/ProjectEdit.vue') },
      { path: 'resume', name: 'ResumeManage', component: () => import('@/views/admin/ResumeManage.vue') },
      { path: 'guestbook', name: 'GuestbookManage', component: () => import('@/views/admin/GuestbookManage.vue') },
      { path: 'friends', name: 'FriendManage', component: () => import('@/views/admin/FriendManage.vue') },
      { path: 'timeline', name: 'TimelineManage', component: () => import('@/views/admin/TimelineManage.vue') },
      { path: 'settings', name: 'SiteSettings', component: () => import('@/views/admin/SiteSettings.vue') }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('token')
    if (!token) {
      next({ name: 'AdminLogin', query: { redirect: to.fullPath } })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router

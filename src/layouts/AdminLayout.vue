<template>
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <div class="admin-logo">管理后台</div>
      <el-menu :default-active="$route.path" router background-color="#1a1a2e" text-color="#a0aec0" active-text-color="#60a5fa">
        <el-menu-item index="/admin/dashboard"><el-icon><Odometer /></el-icon>仪表盘</el-menu-item>
        <el-menu-item index="/admin/articles"><el-icon><Document /></el-icon>文章管理</el-menu-item>
        <el-menu-item index="/admin/categories"><el-icon><Folder /></el-icon>分类管理</el-menu-item>
        <el-menu-item index="/admin/tags"><el-icon><PriceTag /></el-icon>标签管理</el-menu-item>
        <el-menu-item index="/admin/projects"><el-icon><Monitor /></el-icon>项目管理</el-menu-item>
        <el-menu-item index="/admin/resume"><el-icon><User /></el-icon>简历管理</el-menu-item>
        <el-menu-item index="/admin/guestbook"><el-icon><ChatDotRound /></el-icon>留言管理</el-menu-item>
        <el-menu-item index="/admin/friends"><el-icon><Link /></el-icon>友链管理</el-menu-item>
        <el-menu-item index="/admin/timeline"><el-icon><Clock /></el-icon>时间轴管理</el-menu-item>
        <el-menu-item index="/admin/settings"><el-icon><Setting /></el-icon>站点设置</el-menu-item>
      </el-menu>
    </aside>
    <main class="admin-main">
      <header class="admin-header">
        <span class="header-title">{{ $route.meta.title || '管理后台' }}</span>
        <div class="header-right">
          <span class="admin-name">{{ adminName }}</span>
          <el-button type="danger" size="small" @click="handleLogout">退出登录</el-button>
        </div>
      </header>
      <div class="admin-content">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Odometer, Document, Folder, PriceTag, Monitor, User, ChatDotRound, Link, Clock, Setting } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const adminName = computed(() => userStore.userInfo?.username || '管理员')

onMounted(async () => {
  if (userStore.token && !userStore.userInfo) {
    try {
      await userStore.fetchUserInfo()
    } catch (e) {
      // ignore
    }
  }
})

function handleLogout() {
  userStore.logout()
  router.push({ name: 'AdminLogin' })
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
}

.admin-sidebar {
  width: 220px;
  background-color: #1a1a2e;
  overflow-y: auto;
  flex-shrink: 0;
}

.admin-logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.admin-header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background-color: #fff;
  border-bottom: 1px solid #e4e7ed;
  flex-shrink: 0;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.admin-name {
  font-size: 14px;
  color: #606266;
}

.admin-content {
  flex: 1;
  padding: 20px;
  background-color: #f5f7fa;
  overflow-y: auto;
}
</style>

<template>
  <div class="admin-login">
    <div class="login-card glass-card">
      <h2 class="login-title">管理后台登录</h2>
      <form @submit.prevent="handleLogin">
        <div class="login-field">
          <input
            v-model="form.username"
            type="text"
            class="glass-input"
            placeholder="用户名"
            autocomplete="username"
          />
        </div>
        <div class="login-field">
          <input
            v-model="form.password"
            type="password"
            class="glass-input"
            placeholder="密码"
            autocomplete="current-password"
          />
        </div>
        <button type="submit" class="glass-btn login-btn" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const form = reactive({
  username: '',
  password: ''
})
const loading = ref(false)

async function handleLogin() {
  if (!form.username || !form.password) {
    ElMessage.error('请输入用户名和密码')
    return
  }
  loading.value = true
  try {
    await userStore.login(form.username, form.password)
    const redirect = route.query.redirect || '/admin/dashboard'
    router.push(redirect)
  } catch (err) {
    ElMessage.error(err.response?.data?.message || '登录失败，请检查用户名和密码')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.admin-login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1a1a2e;
}

.login-card {
  max-width: 400px;
  width: 100%;
  margin: 0 auto;
}

.login-title {
  color: #fff;
  text-align: center;
  margin: 0 0 30px;
  font-size: 24px;
}

.login-field {
  margin-bottom: 20px;
}

.login-btn {
  width: 100%;
  padding: 12px 20px;
  font-size: 16px;
  border-radius: 8px;
  background: rgba(96, 165, 250, 0.3);
  border-color: rgba(96, 165, 250, 0.5);
}

.login-btn:hover:not(:disabled) {
  background: rgba(96, 165, 250, 0.5);
  border-color: rgba(96, 165, 250, 0.7);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>

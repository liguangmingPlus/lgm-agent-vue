<template>
  <div class="page-container">
    <h1 class="page-title iUp">友情链接</h1>

    <div v-if="friendList.length" class="friend-grid iUp">
      <a
        v-for="(friend, idx) in friendList"
        :key="idx"
        :href="friend.url"
        target="_blank"
        rel="noopener noreferrer"
        class="glass-card friend-card"
      >
        <img v-if="friend.logo" :src="friend.logo" alt="" class="friend-logo" />
        <div v-else class="friend-logo-placeholder">{{ friend.name?.charAt(0) }}</div>
        <div class="friend-info">
          <h4 class="friend-name">{{ friend.name }}</h4>
          <p class="friend-desc">{{ friend.description }}</p>
        </div>
      </a>
    </div>

    <div class="glass-card apply-form iUp">
      <h3 class="section-title">申请友链</h3>
      <div class="form-group">
        <input v-model="form.name" type="text" class="glass-input" placeholder="站点名称" />
      </div>
      <div class="form-group">
        <input v-model="form.url" type="text" class="glass-input" placeholder="站点地址" />
      </div>
      <div class="form-group">
        <input v-model="form.logo" type="text" class="glass-input" placeholder="Logo 地址" />
      </div>
      <div class="form-group">
        <input v-model="form.description" type="text" class="glass-input" placeholder="站点描述" />
      </div>
      <button class="glass-btn" @click="handleApply">提交申请</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getFriendList, applyFriendLink } from '@/api/friends'
import { ElMessage } from 'element-plus'

const friendList = ref([])

const form = ref({
  name: '',
  url: '',
  logo: '',
  description: ''
})

async function fetchList() {
  try {
    const res = await getFriendList()
    friendList.value = res.data || []
  } catch (e) {
    // ignore
  }
}

async function handleApply() {
  if (!form.value.name.trim()) {
    ElMessage.warning('请输入站点名称')
    return
  }
  if (!form.value.url.trim()) {
    ElMessage.warning('请输入站点地址')
    return
  }
  try {
    await applyFriendLink({
      name: form.value.name,
      url: form.value.url,
      logo: form.value.logo,
      description: form.value.description
    })
    ElMessage.success('申请已提交，等待审核')
    form.value = { name: '', url: '', logo: '', description: '' }
  } catch (e) {
    // ignore
  }
}

onMounted(async () => {
  await fetchList()
  requestAnimationFrame(() => {
    document.querySelectorAll('.iUp').forEach(el => el.classList.add('up'))
  })
})
</script>

<style scoped>
.friend-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.friend-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
  text-decoration: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.friend-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
}

.friend-logo {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.friend-logo-placeholder {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--blue-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  flex-shrink: 0;
}

.friend-info {
  overflow: hidden;
}

.friend-name {
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.friend-desc {
  color: rgba(255, 255, 255, 0.5);
  font-size: 13px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.apply-form {
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 14px;
}

@media (max-width: 768px) {
  .friend-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .friend-grid {
    grid-template-columns: 1fr;
  }
}
</style>

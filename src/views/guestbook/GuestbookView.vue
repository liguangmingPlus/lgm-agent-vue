<template>
  <div class="page-container">
    <h1 class="page-title iUp">留言板</h1>

    <div class="glass-card post-form iUp">
      <h3 class="section-title">发表留言</h3>
      <div class="form-group">
        <input
          v-model="form.nickname"
          type="text"
          class="glass-input"
          placeholder="昵称"
        />
      </div>
      <div class="form-group">
        <textarea
          v-model="form.content"
          class="glass-input"
          placeholder="留言内容"
          style="min-height: 100px; resize: vertical"
        ></textarea>
      </div>
      <button class="glass-btn" @click="handleSubmit">提交留言</button>
    </div>

    <div class="message-list">
      <div v-for="(msg, idx) in messageList" :key="idx" class="glass-card message-item iUp">
        <div class="message-header">
          <span class="message-nickname">{{ msg.nickname }}</span>
          <span class="message-date">{{ msg.createTime }}</span>
        </div>
        <p class="message-content">{{ msg.content }}</p>
        <div v-if="msg.reply" class="admin-reply">
          <span class="reply-label">管理员回复:</span>
          <p class="reply-content">{{ msg.reply }}</p>
        </div>
      </div>
    </div>

    <div v-if="total > pageSize" class="pagination iUp">
      <button class="glass-btn pagination-btn" :disabled="currentPage <= 1" @click="changePage(currentPage - 1)">上一页</button>
      <span class="pagination-info">{{ currentPage }} / {{ totalPages }}</span>
      <button class="glass-btn pagination-btn" :disabled="currentPage >= totalPages" @click="changePage(currentPage + 1)">下一页</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getGuestbookList, postMessage } from '@/api/guestbook'
import { ElMessage } from 'element-plus'

const form = ref({
  nickname: '',
  content: ''
})

const messageList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

async function fetchList() {
  try {
    const res = await getGuestbookList({ page: currentPage.value, pageSize: pageSize.value })
    messageList.value = res.data.list || res.data.records || []
    total.value = res.data.total || 0
  } catch (e) {
    // ignore
  }
}

async function handleSubmit() {
  if (!form.value.nickname.trim()) {
    ElMessage.warning('请输入昵称')
    return
  }
  if (!form.value.content.trim()) {
    ElMessage.warning('请输入留言内容')
    return
  }
  try {
    await postMessage({
      nickname: form.value.nickname,
      content: form.value.content
    })
    ElMessage.success('留言成功')
    form.value.nickname = ''
    form.value.content = ''
    currentPage.value = 1
    await fetchList()
  } catch (e) {
    // ignore
  }
}

function changePage(page) {
  currentPage.value = page
  fetchList()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(async () => {
  await fetchList()
  requestAnimationFrame(() => {
    document.querySelectorAll('.iUp').forEach(el => el.classList.add('up'))
  })
})
</script>

<style scoped>
.post-form {
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 14px;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.message-item {
  padding: 18px 20px;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.message-nickname {
  color: #fff;
  font-weight: 700;
  font-size: 15px;
}

.message-date {
  color: rgba(255, 255, 255, 0.35);
  font-size: 12px;
}

.message-content {
  color: rgba(255, 255, 255, 0.75);
  font-size: 14px;
  line-height: 1.7;
}

.admin-reply {
  margin-top: 12px;
  padding: 12px 14px;
  background: rgba(96, 165, 250, 0.1);
  border-left: 3px solid var(--blue-accent);
  border-radius: 0 8px 8px 0;
}

.reply-label {
  font-size: 12px;
  color: var(--blue-accent);
  font-weight: 600;
  display: block;
  margin-bottom: 4px;
}

.reply-content {
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  line-height: 1.6;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
}

.pagination-btn {
  padding: 6px 16px;
  font-size: 13px;
}

.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination-info {
  color: rgba(255, 255, 255, 0.5);
  font-size: 13px;
}
</style>

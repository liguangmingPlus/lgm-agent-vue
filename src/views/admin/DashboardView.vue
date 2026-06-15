<template>
  <div class="dashboard-view">
    <el-row :gutter="20">
      <el-col :span="6" v-for="item in statCards" :key="item.label">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-number">{{ item.value }}</div>
          <div class="stat-label">{{ item.label }}</div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { adminGetDashboard } from '@/api/admin'

const statCards = ref([
  { label: '文章总数', value: 0 },
  { label: '项目总数', value: 0 },
  { label: '留言总数', value: 0 },
  { label: '友链总数', value: 0 }
])

onMounted(async () => {
  try {
    const res = await adminGetDashboard()
    const data = res.data
    statCards.value = [
      { label: '文章总数', value: data.articleCount ?? 0 },
      { label: '项目总数', value: data.projectCount ?? 0 },
      { label: '留言总数', value: data.messageCount ?? 0 },
      { label: '友链总数', value: data.friendCount ?? 0 }
    ]
  } catch (e) {
    // ignore
  }
})
</script>

<style scoped>
.dashboard-view {
  padding: 0;
}

.stat-card {
  text-align: center;
}

.stat-number {
  font-size: 36px;
  font-weight: 700;
  color: #409eff;
  line-height: 1.2;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-top: 8px;
}
</style>

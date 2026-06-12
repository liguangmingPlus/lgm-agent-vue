<template>
  <div class="project-detail-page">
    <div class="page-container">
      <button class="glass-btn back-btn iUp" @click="goBack">← 返回列表</button>

      <div v-if="project" class="detail-content">
        <h1 class="detail-title iUp">{{ project.name }}</h1>

        <img
          v-if="project.coverImage"
          :src="project.coverImage"
          :alt="project.name"
          class="detail-cover iUp"
        />

        <div v-if="project.techStack?.length" class="tech-tags iUp">
          <span v-for="tech in project.techStack" :key="tech" class="tag">{{ tech }}</span>
        </div>

        <div v-if="project.description" class="detail-desc iUp" v-html="project.description"></div>

        <div v-if="project.screenshots?.length" class="screenshots iUp">
          <h3 class="section-title">项目截图</h3>
          <div class="screenshot-list">
            <img
              v-for="(shot, idx) in project.screenshots"
              :key="idx"
              :src="shot"
              :alt="'截图 ' + (idx + 1)"
              class="screenshot-img"
            />
          </div>
        </div>

        <div class="action-buttons iUp">
          <a
            v-if="project.sourceUrl"
            class="glass-btn"
            :href="project.sourceUrl"
            target="_blank"
            rel="noopener"
          >
            查看源码
          </a>
          <a
            v-if="project.demoUrl"
            class="glass-btn primary"
            :href="project.demoUrl"
            target="_blank"
            rel="noopener"
          >
            在线演示
          </a>
        </div>
      </div>

      <div v-else-if="loading" class="loading-tip">加载中...</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getProjectDetail } from '@/api/project'
import { useIUp } from '@/composables/useIUp'

const route = useRoute()
const router = useRouter()
useIUp()

const project = ref(null)
const loading = ref(false)

function goBack() {
  router.push({ name: 'Projects' })
}

async function fetchDetail() {
  loading.value = true
  try {
    const res = await getProjectDetail(route.params.id)
    project.value = res.data
  } catch (_) {
    project.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDetail()
})
</script>

<style scoped>
.project-detail-page {
  min-height: 100vh;
}

.back-btn {
  margin-bottom: 24px;
}

.detail-title {
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  text-align: center;
  margin-bottom: 24px;
  line-height: 1.4;
}

.detail-cover {
  width: 100%;
  border-radius: 12px;
  margin-bottom: 24px;
  object-fit: cover;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: center;
  margin-bottom: 24px;
}

.detail-desc {
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 32px;
  font-size: 15px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 16px;
}

.screenshots {
  margin-bottom: 32px;
}

.screenshot-list {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 8px;
}

.screenshot-img {
  height: 240px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}

.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 16px;
}

.loading-tip {
  text-align: center;
  color: var(--text-muted);
  padding: 60px 0;
  font-size: 16px;
}

@media (max-width: 768px) {
  .detail-title {
    font-size: 22px;
  }

  .screenshot-img {
    height: 180px;
  }
}
</style>

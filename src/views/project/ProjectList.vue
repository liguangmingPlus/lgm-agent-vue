<template>
  <div class="page-container">
    <h1 class="page-title iUp">项目</h1>

    <div class="filter-bar iUp">
      <button
        v-for="cat in projectCategories"
        :key="cat.value"
        class="glass-btn"
        :class="{ active: activeCategory === cat.value }"
        @click="selectCategory(cat.value)"
      >
        {{ cat.label }}
      </button>
    </div>

    <div class="project-grid">
      <div
        v-for="project in projectList"
        :key="project.id"
        class="project-card glass-card iUp"
        @click="goDetail(project.id)"
      >
        <img
          v-if="project.coverImage"
          :src="project.coverImage"
          :alt="project.name"
          class="project-cover"
        />
        <div v-else class="project-cover project-cover-placeholder">
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
        </div>
        <div class="project-body">
          <h3 class="project-name">{{ project.name }}</h3>
          <p class="project-desc">{{ project.description }}</p>
          <div class="project-tags">
            <span v-for="tech in project.techStack" :key="tech" class="tag">{{ tech }}</span>
          </div>
        </div>
        <div class="project-footer">
          <a
            v-if="project.sourceUrl"
            class="glass-btn small"
            :href="project.sourceUrl"
            target="_blank"
            rel="noopener"
            @click.stop
          >
            源码
          </a>
          <a
            v-if="project.demoUrl"
            class="glass-btn small primary"
            :href="project.demoUrl"
            target="_blank"
            rel="noopener"
            @click.stop
          >
            演示
          </a>
        </div>
      </div>
    </div>

    <div v-if="!loading && projectList.length === 0" class="empty-tip">
      暂无项目
    </div>

    <div v-if="total > pageSize" class="pagination">
      <button class="glass-btn" :disabled="currentPage <= 1" @click="changePage(currentPage - 1)">上一页</button>
      <button
        v-for="p in totalPages"
        :key="p"
        class="glass-btn"
        :class="{ active: p === currentPage }"
        @click="changePage(p)"
      >
        {{ p }}
      </button>
      <button class="glass-btn" :disabled="currentPage >= totalPages" @click="changePage(currentPage + 1)">下一页</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getProjectList } from '@/api/project'
import { useIUp } from '@/composables/useIUp'

const router = useRouter()
useIUp()

const projectCategories = [
  { label: '全部', value: '' },
  { label: '开源项目', value: '开源项目' },
  { label: '工作项目', value: '工作项目' },
  { label: '个人项目', value: '个人项目' }
]

const projectList = ref([])
const activeCategory = ref('')
const currentPage = ref(1)
const pageSize = ref(9)
const total = ref(0)
const loading = ref(false)

const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

async function fetchProjects() {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value
    }
    if (activeCategory.value) params.category = activeCategory.value
    const res = await getProjectList(params)
    projectList.value = res.data?.records || res.data?.list || []
    total.value = res.data?.total || 0
  } catch (_) {
    projectList.value = []
  } finally {
    loading.value = false
  }
}

function selectCategory(value) {
  activeCategory.value = value
  currentPage.value = 1
  fetchProjects()
}

function changePage(page) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  fetchProjects()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function goDetail(id) {
  router.push({ name: 'ProjectDetail', params: { id } })
}

onMounted(() => {
  fetchProjects()
})
</script>

<style scoped>
.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 32px;
  justify-content: center;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.project-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  cursor: pointer;
}

.project-cover {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-radius: 8px 8px 0 0;
}

.project-cover-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.03);
}

.project-body {
  padding: 16px 20px 12px;
  flex: 1;
}

.project-name {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 8px;
  transition: color 0.3s;
}

.project-card:hover .project-name {
  color: var(--accent-color);
}

.project-desc {
  font-size: 14px;
  color: var(--text-muted);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 12px;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.project-footer {
  display: flex;
  gap: 8px;
  padding: 12px 20px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.empty-tip {
  text-align: center;
  color: var(--text-muted);
  padding: 60px 0;
  font-size: 16px;
}

@media (max-width: 1024px) {
  .project-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .project-grid {
    grid-template-columns: 1fr;
  }
}
</style>

<template>
  <div class="page-container">
    <h1 class="page-title iUp">博客</h1>

    <div class="filter-bar iUp">
      <div class="filter-row">
        <button
          v-for="cat in categoryList"
          :key="cat.id ?? 'all'"
          class="glass-btn"
          :class="{ active: activeCategory === (cat.id ?? '') }"
          @click="selectCategory(cat.id ?? '')"
        >
          {{ cat.name }}
        </button>
      </div>
      <div class="filter-row tag-row">
        <button
          v-for="tag in tagList"
          :key="tag.id"
          class="glass-btn small"
          :class="{ active: activeTag === tag.id }"
          @click="selectTag(tag.id)"
        >
          {{ tag.name }}
        </button>
      </div>
      <div class="search-row">
        <input
          v-model="keyword"
          class="glass-input"
          placeholder="搜索文章..."
          @keyup.enter="handleSearch"
        />
        <button class="glass-btn primary" @click="handleSearch">搜索</button>
      </div>
    </div>

    <div class="article-list">
      <div
        v-for="article in articleList"
        :key="article.id"
        class="article-card glass-card iUp"
        @click="goDetail(article.id)"
      >
        <img
          v-if="article.coverImage"
          :src="article.coverImage"
          :alt="article.title"
          class="article-cover"
        />
        <div class="article-info">
          <h3 class="article-title">{{ article.title }}</h3>
          <p class="article-summary">{{ article.summary }}</p>
          <div class="article-meta">
            <span v-if="article.categoryName" class="meta-item">{{ article.categoryName }}</span>
            <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
            <span class="meta-item">{{ article.createTime }}</span>
            <span class="meta-item">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              {{ article.viewCount }}
            </span>
          </div>
        </div>
      </div>

      <div v-if="!loading && articleList.length === 0" class="empty-tip">
        暂无文章
      </div>
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
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getArticleList, getCategories, getTags, searchArticles } from '@/api/article'
import { useIUp } from '@/composables/useIUp'

const router = useRouter()
useIUp()

const articleList = ref([])
const categoryList = ref([{ id: '', name: '全部' }])
const tagList = ref([])
const activeCategory = ref('')
const activeTag = ref(null)
const keyword = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const loading = ref(false)

const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

async function fetchCategories() {
  try {
    const res = await getCategories()
    categoryList.value = [{ id: '', name: '全部' }, ...(res.data || [])]
  } catch (_) {}
}

async function fetchTags() {
  try {
    const res = await getTags()
    tagList.value = res.data || []
  } catch (_) {}
}

async function fetchArticles() {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value
    }
    if (activeCategory.value) params.categoryId = activeCategory.value
    if (activeTag.value) params.tagId = activeTag.value

    let res
    if (keyword.value.trim()) {
      params.keyword = keyword.value.trim()
      res = await searchArticles(params)
    } else {
      res = await getArticleList(params)
    }
    articleList.value = res.data?.records || res.data?.list || []
    total.value = res.data?.total || 0
  } catch (_) {
    articleList.value = []
  } finally {
    loading.value = false
  }
}

function selectCategory(id) {
  activeCategory.value = id
  currentPage.value = 1
  fetchArticles()
}

function selectTag(id) {
  activeTag.value = activeTag.value === id ? null : id
  currentPage.value = 1
  fetchArticles()
}

function handleSearch() {
  currentPage.value = 1
  fetchArticles()
}

function changePage(page) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  fetchArticles()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function goDetail(id) {
  router.push({ name: 'BlogDetail', params: { id } })
}

onMounted(() => {
  fetchCategories()
  fetchTags()
  fetchArticles()
})
</script>

<style scoped>
.filter-bar {
  margin-bottom: 32px;
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.tag-row {
  margin-bottom: 16px;
}

.search-row {
  display: flex;
  gap: 8px;
  max-width: 400px;
}

.search-row .glass-input {
  flex: 1;
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.article-card {
  display: flex;
  padding: 20px;
  cursor: pointer;
  gap: 20px;
}

.article-cover {
  width: 200px;
  height: 140px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}

.article-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.article-title {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 8px;
  transition: color 0.3s;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.article-card:hover .article-title {
  color: var(--accent-color);
}

.article-summary {
  font-size: 14px;
  color: var(--text-muted);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 12px;
}

.article-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  font-size: 12px;
  color: var(--text-muted);
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 3px;
}

.empty-tip {
  text-align: center;
  color: var(--text-muted);
  padding: 60px 0;
  font-size: 16px;
}

@media (max-width: 768px) {
  .article-card {
    flex-direction: column;
    padding: 16px;
  }

  .article-cover {
    width: 100%;
    height: 180px;
  }

  .search-row {
    max-width: 100%;
  }
}
</style>

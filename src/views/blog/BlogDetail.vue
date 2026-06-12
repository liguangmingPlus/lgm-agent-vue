<template>
  <div class="blog-detail-page">
    <div class="page-container">
      <button class="glass-btn back-btn iUp" @click="goBack">← 返回列表</button>

      <div v-if="article" class="detail-content">
        <h1 class="detail-title iUp">{{ article.title }}</h1>

        <div class="detail-meta iUp">
          <span v-if="article.categoryName" class="meta-item">{{ article.categoryName }}</span>
          <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
          <span class="meta-item">{{ article.createTime }}</span>
          <span class="meta-item">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            {{ article.viewCount }}
          </span>
        </div>

        <div class="detail-body iUp">
          <div class="content-wrapper">
            <div class="markdown-body" v-html="renderedContent"></div>
          </div>

          <aside v-if="headings.length" class="toc-sidebar">
            <div class="toc-title">目录</div>
            <nav class="toc-nav">
              <a
                v-for="h in headings"
                :key="h.id"
                :href="'#' + h.id"
                class="toc-link"
                :class="'toc-h' + h.level"
              >{{ h.text }}</a>
            </nav>
          </aside>
        </div>
      </div>

      <div v-else-if="loading" class="loading-tip">加载中...</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getArticleDetail } from '@/api/article'
import { useMarkdown } from '@/composables/useMarkdown'
import { useIUp } from '@/composables/useIUp'

const route = useRoute()
const router = useRouter()
const { render } = useMarkdown()
useIUp()

const article = ref(null)
const loading = ref(false)

const renderedContent = computed(() => {
  if (!article.value?.content) return ''
  return render(article.value.content)
})

const headings = computed(() => {
  if (!article.value?.content) return []
  const list = []
  const regex = /^(#{2,3})\s+(.+)$/gm
  let match
  while ((match = regex.exec(article.value.content)) !== null) {
    const level = match[1].length
    const text = match[2].trim()
    const id = text.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    list.push({ level, text, id })
  }
  return list
})

function goBack() {
  router.push({ name: 'Blog' })
}

async function fetchDetail() {
  loading.value = true
  try {
    const res = await getArticleDetail(route.params.id)
    article.value = res.data
  } catch (_) {
    article.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDetail()
})
</script>

<style scoped>
.blog-detail-page {
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
  margin-bottom: 16px;
  line-height: 1.4;
}

.detail-meta {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 40px;
  font-size: 13px;
  color: var(--text-muted);
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 3px;
}

.detail-body {
  display: flex;
  gap: 32px;
}

.content-wrapper {
  flex: 1;
  min-width: 0;
}

.toc-sidebar {
  width: 220px;
  flex-shrink: 0;
  position: sticky;
  top: 24px;
  align-self: flex-start;
  max-height: calc(100vh - 48px);
  overflow-y: auto;
}

.toc-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 12px;
}

.toc-nav {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.toc-link {
  font-size: 13px;
  color: var(--text-muted);
  transition: color 0.3s;
  line-height: 1.4;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.toc-link:hover {
  color: var(--accent-color);
}

.toc-h3 {
  padding-left: 16px;
}

.loading-tip {
  text-align: center;
  color: var(--text-muted);
  padding: 60px 0;
  font-size: 16px;
}

.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4),
.markdown-body :deep(h5),
.markdown-body :deep(h6) {
  color: #fff;
  margin-top: 1.5em;
  margin-bottom: 0.75em;
  font-weight: 600;
}

.markdown-body :deep(h1) { font-size: 1.75em; }
.markdown-body :deep(h2) { font-size: 1.5em; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.3em; }
.markdown-body :deep(h3) { font-size: 1.25em; }

.markdown-body :deep(p) {
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 1em;
}

.markdown-body :deep(a) {
  color: var(--accent-color);
}

.markdown-body :deep(a:hover) {
  color: var(--accent-hover);
}

.markdown-body :deep(code) {
  background: rgba(255, 255, 255, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.9em;
  color: #e06c75;
}

.markdown-body :deep(pre) {
  background: #282c34;
  border-radius: 8px;
  padding: 16px;
  overflow-x: auto;
  margin-bottom: 1em;
}

.markdown-body :deep(pre code) {
  background: none;
  padding: 0;
  color: inherit;
  font-size: 0.9em;
}

.markdown-body :deep(blockquote) {
  border-left: 4px solid var(--accent-color);
  padding: 8px 16px;
  margin-bottom: 1em;
  background: rgba(255, 255, 255, 0.03);
  color: var(--text-secondary);
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  padding-left: 1.5em;
  margin-bottom: 1em;
  color: var(--text-secondary);
}

.markdown-body :deep(li) {
  margin-bottom: 0.25em;
  line-height: 1.7;
}

.markdown-body :deep(img) {
  max-width: 100%;
  border-radius: 8px;
  margin: 1em 0;
}

.markdown-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1em;
}

.markdown-body :deep(th),
.markdown-body :deep(td) {
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 8px 12px;
  text-align: left;
}

.markdown-body :deep(th) {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
}

.markdown-body :deep(td) {
  color: var(--text-secondary);
}

.markdown-body :deep(hr) {
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin: 2em 0;
}

@media (max-width: 768px) {
  .detail-title {
    font-size: 22px;
  }

  .detail-body {
    flex-direction: column;
  }

  .toc-sidebar {
    display: none;
  }
}
</style>

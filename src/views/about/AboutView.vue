<template>
  <div class="page-container">
    <h1 class="page-title iUp">关于</h1>

    <div v-if="loading" class="loading-tip">加载中...</div>

    <template v-if="settings">
      <div class="glass-card personal-intro iUp">
        <img v-if="settings.avatar" :src="settings.avatar" alt="avatar" class="intro-avatar" />
        <h2 class="intro-name">{{ settings.name || '博主' }}</h2>
        <p class="intro-title">{{ settings.title || '' }}</p>
        <p class="intro-bio">{{ settings.bio || '' }}</p>
        <div v-if="settings.socialLinks" class="social-links">
          <a v-if="settings.socialLinks.github" :href="settings.socialLinks.github" target="_blank" class="social-link">
            <i class="iconfont icon-github"></i>
          </a>
          <a v-if="settings.socialLinks.weibo" :href="settings.socialLinks.weibo" target="_blank" class="social-link">
            <i class="iconfont icon-weibo"></i>
          </a>
          <a v-if="settings.socialLinks.email" :href="'mailto:' + settings.socialLinks.email" class="social-link">
            <i class="iconfont icon-email"></i>
          </a>
          <a v-if="settings.socialLinks.csdn" :href="settings.socialLinks.csdn" target="_blank" class="social-link">
            <i class="iconfont icon-csdn"></i>
          </a>
          <a v-if="settings.socialLinks.juejin" :href="settings.socialLinks.juejin" target="_blank" class="social-link">
            <i class="iconfont icon-juejin"></i>
          </a>
          <a v-if="settings.socialLinks.zhihu" :href="settings.socialLinks.zhihu" target="_blank" class="social-link">
            <i class="iconfont icon-zhihu"></i>
          </a>
        </div>
      </div>

      <div class="glass-card iUp">
        <h3 class="section-title">生活相册</h3>
        <div class="photo-grid">
          <div v-for="(photo, idx) in albumPhotos" :key="idx" class="photo-item">
            <img :src="photo" alt="photo" />
          </div>
        </div>
      </div>
    </template>

    <div v-if="timelineList.length" class="glass-card iUp">
      <h3 class="section-title">生活动态</h3>
      <div class="life-timeline">
        <div v-for="(item, idx) in timelineList" :key="idx" class="life-timeline-item">
          <div class="life-timeline-dot" :class="'dot-' + item.type"></div>
          <div class="life-timeline-content">
            <div class="life-timeline-meta">
              <span class="life-timeline-date">{{ item.date }}</span>
              <span class="life-timeline-title">{{ item.title }}</span>
            </div>
            <p class="life-timeline-text">{{ item.content }}</p>
            <img v-if="item.image" :src="item.image" alt="" class="life-timeline-img" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getTimelineList } from '@/api/timeline'
import { getSiteSettings } from '@/api/settings'

const settings = ref(null)
const timelineList = ref([])
const albumPhotos = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const [settingsRes, timelineRes] = await Promise.all([
      getSiteSettings(),
      getTimelineList()
    ])
    settings.value = settingsRes.data
    timelineList.value = timelineRes.data || []
    if (settings.value && settings.value.album) {
      albumPhotos.value = settings.value.album
    } else {
      albumPhotos.value = Array.from({ length: 6 }, (_, i) => `https://picsum.photos/400/300?random=${i + 1}`)
    }
  } catch (e) {
    // ignore
  } finally {
    loading.value = false
  }
  requestAnimationFrame(() => {
    document.querySelectorAll('.iUp').forEach(el => el.classList.add('up'))
  })
})
</script>

<style scoped>
.loading-tip {
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  padding: 40px 0;
}

.personal-intro {
  text-align: center;
  margin-bottom: 24px;
}

.intro-avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid rgba(255, 255, 255, 0.15);
  margin-bottom: 16px;
}

.intro-name {
  color: #fff;
  font-size: 24px;
  margin-bottom: 4px;
}

.intro-title {
  color: var(--blue-accent);
  font-size: 15px;
  margin-bottom: 12px;
}

.intro-bio {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  line-height: 1.8;
  max-width: 600px;
  margin: 0 auto 16px;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.social-link {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 18px;
  transition: all 0.3s ease;
  text-decoration: none;
}

.social-link:hover {
  background: var(--blue-accent);
  color: #fff;
  transform: translateY(-2px);
}

.glass-card {
  margin-bottom: 24px;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.photo-item {
  overflow: hidden;
  border-radius: 8px;
  aspect-ratio: 4 / 3;
}

.photo-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.photo-item:hover img {
  transform: scale(1.05);
}

.life-timeline {
  position: relative;
  padding-left: 24px;
}

.life-timeline::before {
  content: '';
  position: absolute;
  left: 6px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: rgba(255, 255, 255, 0.1);
}

.life-timeline-item {
  position: relative;
  margin-bottom: 24px;
}

.life-timeline-item:last-child {
  margin-bottom: 0;
}

.life-timeline-dot {
  position: absolute;
  left: -21px;
  top: 6px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  box-shadow: 0 0 8px currentColor;
}

.dot-life {
  background: #4ade80;
  color: #4ade80;
}

.dot-work {
  background: var(--blue-accent);
  color: var(--blue-accent);
}

.dot-study {
  background: #fb923c;
  color: #fb923c;
}

.life-timeline-content {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  padding: 14px 16px;
}

.life-timeline-meta {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.life-timeline-date {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
}

.life-timeline-title {
  font-size: 15px;
  color: #fff;
  font-weight: 600;
}

.life-timeline-text {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.7;
}

.life-timeline-img {
  margin-top: 10px;
  max-width: 100%;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .photo-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 480px) {
  .photo-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>

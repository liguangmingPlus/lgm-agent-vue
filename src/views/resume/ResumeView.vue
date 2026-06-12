<template>
  <div class="page-container">
    <h1 class="page-title iUp">简历</h1>

    <div v-if="loading" class="loading-tip">加载中...</div>

    <template v-if="resume">
      <div class="glass-card basic-info iUp">
        <div class="basic-info-header">
          <img v-if="resume.avatar" :src="resume.avatar" alt="avatar" class="avatar" />
          <div class="basic-info-text">
            <h2>{{ resume.name }}</h2>
            <p class="position">{{ resume.title }}</p>
            <div class="contact-list">
              <span v-if="resume.phone" class="contact-item">
                <i class="el-icon-phone"></i> {{ resume.phone }}
              </span>
              <span v-if="resume.email" class="contact-item">
                <i class="el-icon-message"></i> {{ resume.email }}
              </span>
              <span v-if="resume.github" class="contact-item">
                <i class="iconfont icon-github"></i> {{ resume.github }}
              </span>
              <span v-if="resume.blog" class="contact-item">
                <i class="el-icon-link"></i> {{ resume.blog }}
              </span>
              <span v-if="resume.location" class="contact-item">
                <i class="el-icon-location"></i> {{ resume.location }}
              </span>
            </div>
          </div>
        </div>
        <p v-if="resume.summary" class="summary">{{ resume.summary }}</p>
      </div>

      <div v-if="resume.workExperiences && resume.workExperiences.length" class="glass-card iUp">
        <h3 class="section-title">工作经历</h3>
        <div class="timeline">
          <div v-for="(exp, idx) in resume.workExperiences" :key="idx" class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <div class="timeline-header">
                <h4>{{ exp.company }} · {{ exp.position }}</h4>
                <span class="timeline-date">{{ exp.startDate }} - {{ exp.endDate }}</span>
              </div>
              <p class="timeline-desc">{{ exp.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="resume.educations && resume.educations.length" class="glass-card iUp">
        <h3 class="section-title">教育背景</h3>
        <div class="timeline">
          <div v-for="(edu, idx) in resume.educations" :key="idx" class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <div class="timeline-header">
                <h4>{{ edu.school }} · {{ edu.major }}</h4>
                <span class="timeline-date">{{ edu.degree }}</span>
              </div>
              <span class="timeline-date">{{ edu.startDate }} - {{ edu.endDate }}</span>
              <p v-if="edu.description" class="timeline-desc">{{ edu.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="resume.skills && resume.skills.length" class="glass-card iUp">
        <h3 class="section-title">专业技能</h3>
        <div class="skills-group">
          <div v-for="(group, idx) in resume.skills" :key="idx" class="skill-category">
            <h4 class="skill-category-title">{{ group.category }}</h4>
            <div v-for="(skill, sIdx) in group.items" :key="sIdx" class="skill-item">
              <div class="skill-name-row">
                <span>{{ skill.name }}</span>
                <span class="skill-level">{{ skill.level }}%</span>
              </div>
              <div class="skill-bar">
                <div class="skill-bar-fill" :style="{ width: skill.level + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getResume } from '@/api/resume'

const resume = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await getResume()
    resume.value = res.data
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

.basic-info {
  margin-bottom: 24px;
}

.basic-info-header {
  display: flex;
  align-items: center;
  gap: 24px;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(255, 255, 255, 0.15);
  flex-shrink: 0;
}

.basic-info-text h2 {
  color: #fff;
  font-size: 24px;
  margin-bottom: 4px;
}

.position {
  color: var(--blue-accent);
  font-size: 15px;
  margin-bottom: 10px;
}

.contact-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.contact-item {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  gap: 4px;
}

.contact-item i {
  color: var(--blue-accent);
}

.summary {
  margin-top: 16px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  line-height: 1.8;
}

.glass-card {
  margin-bottom: 24px;
}

.timeline {
  position: relative;
  padding-left: 24px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 6px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: rgba(255, 255, 255, 0.1);
}

.timeline-item {
  position: relative;
  margin-bottom: 24px;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-dot {
  position: absolute;
  left: -21px;
  top: 6px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--blue-accent);
  box-shadow: 0 0 8px rgba(96, 165, 250, 0.5);
}

.timeline-content {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  padding: 14px 16px;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 6px;
}

.timeline-header h4 {
  color: #fff;
  font-size: 15px;
  font-weight: 600;
}

.timeline-date {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.4);
}

.timeline-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.7;
}

.skills-group {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.skill-category-title {
  color: var(--blue-accent);
  font-size: 15px;
  margin-bottom: 14px;
  font-weight: 600;
}

.skill-item {
  margin-bottom: 12px;
}

.skill-item:last-child {
  margin-bottom: 0;
}

.skill-name-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 6px;
}

.skill-level {
  color: var(--blue-accent);
}

.skill-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.skill-bar-fill {
  height: 100%;
  background: var(--blue-gradient);
  border-radius: 3px;
  transition: width 1s ease;
}

@media (max-width: 600px) {
  .basic-info-header {
    flex-direction: column;
    text-align: center;
  }

  .contact-list {
    justify-content: center;
  }

  .timeline-header {
    flex-direction: column;
  }
}
</style>

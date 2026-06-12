<template>
  <div class="site-settings">
    <el-card style="margin-bottom: 20px">
      <template #header>基本设置</template>
      <el-form label-width="120px" style="max-width: 700px">
        <el-form-item label="站点名称">
          <el-input v-model="settings.site_name" />
        </el-form-item>
        <el-form-item label="站点描述">
          <el-input v-model="settings.site_description" />
        </el-form-item>
        <el-form-item label="站点关键词">
          <el-input v-model="settings.site_keywords" />
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin-bottom: 20px">
      <template #header>个人信息</template>
      <el-form label-width="120px" style="max-width: 700px">
        <el-form-item label="作者名称">
          <el-input v-model="settings.author_name" />
        </el-form-item>
        <el-form-item label="作者头像">
          <el-input v-model="settings.author_avatar" />
        </el-form-item>
        <el-form-item label="作者简介">
          <el-input v-model="settings.author_bio" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin-bottom: 20px">
      <template #header>首页设置</template>
      <el-form label-width="120px" style="max-width: 700px">
        <el-form-item label="一言开关">
          <el-switch v-model="settings.hitokoto_enabled" />
        </el-form-item>
        <el-form-item label="自定义背景图">
          <el-input v-model="settings.custom_bg_image" />
        </el-form-item>
      </el-form>
    </el-card>

    <el-button type="primary" @click="handleSave" :loading="saving" style="margin-top: 10px">保存设置</el-button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { adminGetSettings, adminUpdateSettings } from '@/api/admin'

const settings = ref({
  site_name: '',
  site_description: '',
  site_keywords: '',
  author_name: '',
  author_avatar: '',
  author_bio: '',
  hitokoto_enabled: false,
  custom_bg_image: ''
})
const saving = ref(false)

const loadSettings = async () => {
  const res = await adminGetSettings()
  const list = res.data || []
  const map = {}
  list.forEach(item => {
    let val = item.setting_value
    if (item.setting_key === 'hitokoto_enabled') {
      val = val === 'true' || val === true
    }
    map[item.setting_key] = val
  })
  settings.value = { ...settings.value, ...map }
}

const handleSave = async () => {
  saving.value = true
  try {
    const data = Object.entries(settings.value).map(([key, value]) => ({
      settingKey: key,
      settingValue: String(value)
    }))
    await adminUpdateSettings(data)
    ElMessage.success('保存成功')
  } finally {
    saving.value = false
  }
}

onMounted(loadSettings)
</script>

<style scoped>
.site-settings {
  padding: 20px;
}
</style>

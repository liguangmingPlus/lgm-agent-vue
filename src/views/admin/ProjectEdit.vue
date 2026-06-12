<template>
  <div class="project-edit">
    <el-page-header @back="$router.back()" :content="isEdit ? '编辑项目' : '新增项目'" style="margin-bottom: 20px" />
    <el-form :model="form" label-width="100px" style="max-width: 800px">
      <el-form-item label="项目名">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="form.description" type="textarea" :rows="4" />
      </el-form-item>
      <el-form-item label="技术栈">
        <el-input v-model="form.tech_stack" placeholder="逗号分隔" />
      </el-form-item>
      <el-form-item label="封面图">
        <div style="display: flex; gap: 8px; width: 100%">
          <el-input v-model="form.cover_image" placeholder="图片URL" />
          <el-upload :show-file-list="false" :before-upload="handleUpload" accept="image/*">
            <el-button>上传</el-button>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item label="截图URLs">
        <el-input v-model="form.screenshot_urls" placeholder="逗号分隔" />
      </el-form-item>
      <el-form-item label="源码链接">
        <el-input v-model="form.source_url" />
      </el-form-item>
      <el-form-item label="演示链接">
        <el-input v-model="form.demo_url" />
      </el-form-item>
      <el-form-item label="分类">
        <el-select v-model="form.category" placeholder="请选择分类" style="width: 100%">
          <el-option label="开源项目" value="开源项目" />
          <el-option label="工作项目" value="工作项目" />
          <el-option label="个人项目" value="个人项目" />
        </el-select>
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number v-model="form.sort_order" :min="0" />
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="form.status">
          <el-radio value="hidden">隐藏</el-radio>
          <el-radio value="visible">展示</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSave" :loading="saving">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { adminGetProject, adminCreateProject, adminUpdateProject, adminUpload } from '@/api/admin'

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => !!route.params.id)
const saving = ref(false)

const form = ref({
  name: '',
  description: '',
  tech_stack: '',
  cover_image: '',
  screenshot_urls: '',
  source_url: '',
  demo_url: '',
  category: '',
  sort_order: 0,
  status: 'visible'
})

const loadProject = async () => {
  if (!isEdit.value) return
  const res = await adminGetProject(route.params.id)
  const data = res.data
  form.value = {
    name: data.name || '',
    description: data.description || '',
    tech_stack: data.tech_stack || '',
    cover_image: data.cover_image || '',
    screenshot_urls: data.screenshot_urls || '',
    source_url: data.source_url || '',
    demo_url: data.demo_url || '',
    category: data.category || '',
    sort_order: data.sort_order || 0,
    status: data.status || 'visible'
  }
}

const handleUpload = async (file) => {
  const res = await adminUpload(file)
  form.value.cover_image = res.data.url
  ElMessage.success('上传成功')
  return false
}

const handleSave = async () => {
  saving.value = true
  try {
    if (isEdit.value) {
      await adminUpdateProject(route.params.id, form.value)
    } else {
      await adminCreateProject(form.value)
    }
    ElMessage.success('保存成功')
    router.push('/admin/projects')
  } finally {
    saving.value = false
  }
}

onMounted(loadProject)
</script>

<style scoped>
.project-edit {
  padding: 20px;
}
</style>

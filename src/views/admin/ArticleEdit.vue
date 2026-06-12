<template>
  <div class="article-edit">
    <el-page-header @back="$router.back()" :content="isEdit ? '编辑文章' : '新增文章'" style="margin-bottom: 20px" />
    <el-form :model="form" label-width="100px" style="max-width: 800px">
      <el-form-item label="标题">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="摘要">
        <el-input v-model="form.summary" type="textarea" :rows="3" />
      </el-form-item>
      <el-form-item label="内容">
        <el-input
          v-model="form.content"
          type="textarea"
          :rows="20"
          style="font-family: monospace; min-height: 400px"
        />
      </el-form-item>
      <el-form-item label="分类">
        <el-select v-model="form.category_id" placeholder="请选择分类" style="width: 100%">
          <el-option v-for="c in categoryList" :key="c.id" :label="c.name" :value="c.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="标签">
        <el-select v-model="form.tag_ids" multiple placeholder="请选择标签" style="width: 100%">
          <el-option v-for="t in tagList" :key="t.id" :label="t.name" :value="t.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="封面图">
        <div style="display: flex; gap: 8px; width: 100%">
          <el-input v-model="form.cover_image" placeholder="图片URL" />
          <el-upload :show-file-list="false" :before-upload="handleUpload" accept="image/*">
            <el-button>上传</el-button>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="form.status">
          <el-radio value="draft">草稿</el-radio>
          <el-radio value="published">发布</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否置顶">
        <el-switch v-model="form.is_top" />
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
import {
  adminGetArticle,
  adminCreateArticle,
  adminUpdateArticle,
  adminGetCategoryList,
  adminGetTagList,
  adminUpload
} from '@/api/admin'

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => !!route.params.id)
const saving = ref(false)
const categoryList = ref([])
const tagList = ref([])

const form = ref({
  title: '',
  summary: '',
  content: '',
  category_id: null,
  tag_ids: [],
  cover_image: '',
  status: 'draft',
  is_top: false
})

const loadArticle = async () => {
  if (!isEdit.value) return
  const res = await adminGetArticle(route.params.id)
  const data = res.data
  form.value = {
    title: data.title || '',
    summary: data.summary || '',
    content: data.content || '',
    category_id: data.category_id || null,
    tag_ids: data.tag_ids || [],
    cover_image: data.cover_image || '',
    status: data.status || 'draft',
    is_top: data.is_top || false
  }
}

const loadCategories = async () => {
  const res = await adminGetCategoryList({ page_size: 100 })
  categoryList.value = res.data.list || res.data || []
}

const loadTags = async () => {
  const res = await adminGetTagList({ page_size: 100 })
  tagList.value = res.data.list || res.data || []
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
      await adminUpdateArticle(route.params.id, form.value)
    } else {
      await adminCreateArticle(form.value)
    }
    ElMessage.success('保存成功')
    router.push('/admin/articles')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadCategories()
  loadTags()
  loadArticle()
})
</script>

<style scoped>
.article-edit {
  padding: 20px;
}
</style>

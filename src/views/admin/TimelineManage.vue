<template>
  <div class="timeline-manage">
    <div class="top-bar">
      <el-button type="primary" @click="openDialog()">新增动态</el-button>
    </div>
    <el-table :data="tableData" stripe v-loading="loading">
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column prop="date" label="日期" width="120" />
      <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
      <el-table-column label="类型" width="100">
        <template #default="{ row }">
          <el-tag>{{ row.type === 'life' ? '生活' : row.type === 'work' ? '工作' : '学习' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 'hidden' ? 'info' : 'success'">{{ row.status === 'hidden' ? '隐藏' : '展示' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sort_order" label="排序" width="80" />
      <el-table-column label="操作" width="160">
        <template #default="{ row }">
          <el-button type="primary" link @click="openDialog(row)">编辑</el-button>
          <el-popconfirm title="确定删除该动态吗？" @confirm="handleDelete(row.id)">
            <template #reference>
              <el-button type="danger" link>删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="page"
      v-model:page-size="pageSize"
      :total="total"
      :page-sizes="[10, 20, 50]"
      layout="total, sizes, prev, pager, next, jumper"
      style="margin-top: 16px; justify-content: flex-end"
      @size-change="loadList"
      @current-change="loadList"
    />
    <el-dialog v-model="dialogVisible" :title="editingId ? '编辑动态' : '新增动态'" width="560px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="日期">
          <el-input v-model="form.date" placeholder="如: 2024-01-15" />
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="form.content" type="textarea" :rows="4" />
        </el-form-item>
        <el-form-item label="图片">
          <div style="display: flex; gap: 8px; width: 100%">
            <el-input v-model="form.image" placeholder="图片URL" />
            <el-upload :show-file-list="false" :before-upload="handleUpload" accept="image/*">
              <el-button>上传</el-button>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="form.type" style="width: 100%">
            <el-option label="生活" value="life" />
            <el-option label="工作" value="work" />
            <el-option label="学习" value="study" />
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
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave" :loading="saving">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { adminGetTimelineList, adminCreateTimeline, adminUpdateTimeline, adminDeleteTimeline, adminUpload } from '@/api/admin'

const tableData = ref([])
const loading = ref(false)
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const dialogVisible = ref(false)
const editingId = ref(null)
const saving = ref(false)

const form = ref({
  date: '',
  title: '',
  content: '',
  image: '',
  type: 'life',
  sort_order: 0,
  status: 'visible'
})

const loadList = async () => {
  loading.value = true
  try {
    const res = await adminGetTimelineList({
      page: page.value,
      page_size: pageSize.value
    })
    tableData.value = res.data.list || []
    total.value = res.data.total || 0
  } finally {
    loading.value = false
  }
}

const openDialog = (row = null) => {
  if (row) {
    editingId.value = row.id
    form.value = {
      date: row.date,
      title: row.title,
      content: row.content || '',
      image: row.image || '',
      type: row.type,
      sort_order: row.sort_order,
      status: row.status
    }
  } else {
    editingId.value = null
    form.value = { date: '', title: '', content: '', image: '', type: 'life', sort_order: 0, status: 'visible' }
  }
  dialogVisible.value = true
}

const handleUpload = async (file) => {
  const res = await adminUpload(file)
  form.value.image = res.data.url
  ElMessage.success('上传成功')
  return false
}

const handleSave = async () => {
  saving.value = true
  try {
    if (editingId.value) {
      await adminUpdateTimeline(editingId.value, form.value)
    } else {
      await adminCreateTimeline(form.value)
    }
    ElMessage.success('保存成功')
    dialogVisible.value = false
    loadList()
  } finally {
    saving.value = false
  }
}

const handleDelete = async (id) => {
  await adminDeleteTimeline(id)
  ElMessage.success('删除成功')
  loadList()
}

onMounted(loadList)
</script>

<style scoped>
.timeline-manage {
  padding: 20px;
}
.top-bar {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}
</style>

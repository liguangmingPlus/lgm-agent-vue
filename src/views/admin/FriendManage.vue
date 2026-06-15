<template>
  <div class="friend-manage">
    <div class="top-bar">
      <el-button type="primary" @click="openDialog()">新增友链</el-button>
    </div>
    <el-table :data="tableData" stripe v-loading="loading">
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column prop="name" label="网站名" />
      <el-table-column prop="url" label="URL" min-width="200" show-overflow-tooltip />
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 'pending' ? 'warning' : 'success'">{{ row.status === 'pending' ? '待审核' : '已通过' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sort_order" label="排序" width="80" />
      <el-table-column label="操作" width="160">
        <template #default="{ row }">
          <el-button type="primary" link @click="openDialog(row)">编辑</el-button>
          <el-popconfirm title="确定删除该友链吗？" @confirm="handleDelete(row.id)">
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
    <el-dialog v-model="dialogVisible" :title="editingId ? '编辑友链' : '新增友链'" width="560px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="网站名">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="URL">
          <el-input v-model="form.url" />
        </el-form-item>
        <el-form-item label="Logo">
          <el-input v-model="form.logo" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status" style="width: 100%">
            <el-option label="待审核" value="pending" />
            <el-option label="已通过" value="approved" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sort_order" :min="0" />
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
import { adminGetFriendList, adminCreateFriend, adminUpdateFriend, adminDeleteFriend } from '@/api/admin'

const tableData = ref([])
const loading = ref(false)
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const dialogVisible = ref(false)
const editingId = ref(null)
const saving = ref(false)

const form = ref({
  name: '',
  url: '',
  logo: '',
  description: '',
  status: 'pending',
  sort_order: 0
})

const loadList = async () => {
  loading.value = true
  try {
    const res = await adminGetFriendList({
      page: page.value,
      size: pageSize.value
    })
    tableData.value = res.data.records || []
    total.value = res.data.total || 0
  } finally {
    loading.value = false
  }
}

const openDialog = (row = null) => {
  if (row) {
    editingId.value = row.id
    form.value = {
      name: row.name,
      url: row.url,
      logo: row.logo || '',
      description: row.description || '',
      status: row.status,
      sort_order: row.sort_order
    }
  } else {
    editingId.value = null
    form.value = { name: '', url: '', logo: '', description: '', status: 'pending', sort_order: 0 }
  }
  dialogVisible.value = true
}

const handleSave = async () => {
  saving.value = true
  try {
    if (editingId.value) {
      await adminUpdateFriend(editingId.value, form.value)
    } else {
      await adminCreateFriend(form.value)
    }
    ElMessage.success('保存成功')
    dialogVisible.value = false
    loadList()
  } finally {
    saving.value = false
  }
}

const handleDelete = async (id) => {
  await adminDeleteFriend(id)
  ElMessage.success('删除成功')
  loadList()
}

onMounted(loadList)
</script>

<style scoped>
.friend-manage {
  padding: 20px;
}
.top-bar {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}
</style>

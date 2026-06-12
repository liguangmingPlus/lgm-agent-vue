<template>
  <div class="project-manage">
    <div class="top-bar">
      <el-button type="primary" @click="$router.push('/admin/projects/edit')">新增项目</el-button>
    </div>
    <el-table :data="tableData" stripe v-loading="loading">
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column prop="name" label="项目名" min-width="160" show-overflow-tooltip />
      <el-table-column prop="category" label="分类" width="120" />
      <el-table-column prop="tech_stack" label="技术栈" min-width="200" show-overflow-tooltip />
      <el-table-column label="状态" width="90">
        <template #default="{ row }">
          <el-tag :type="row.status === 'hidden' ? 'info' : 'success'">{{ row.status === 'hidden' ? '隐藏' : '展示' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sort_order" label="排序" width="80" />
      <el-table-column label="操作" width="160" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="$router.push(`/admin/projects/edit/${row.id}`)">编辑</el-button>
          <el-popconfirm title="确定删除该项目吗？" @confirm="handleDelete(row.id)">
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { adminGetProjectList, adminDeleteProject } from '@/api/admin'

const tableData = ref([])
const loading = ref(false)
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

const loadList = async () => {
  loading.value = true
  try {
    const res = await adminGetProjectList({
      page: page.value,
      page_size: pageSize.value
    })
    tableData.value = res.data.list || []
    total.value = res.data.total || 0
  } finally {
    loading.value = false
  }
}

const handleDelete = async (id) => {
  await adminDeleteProject(id)
  ElMessage.success('删除成功')
  loadList()
}

onMounted(loadList)
</script>

<style scoped>
.project-manage {
  padding: 20px;
}
.top-bar {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}
</style>

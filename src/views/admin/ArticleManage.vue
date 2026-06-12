<template>
  <div class="article-manage">
    <div class="top-bar">
      <el-input v-model="searchKeyword" placeholder="搜索文章标题" clearable style="width: 240px" @clear="loadList" @keyup.enter="loadList" />
      <el-select v-model="statusFilter" placeholder="状态筛选" clearable style="width: 140px; margin-left: 12px" @change="loadList">
        <el-option label="全部" value="" />
        <el-option label="草稿" value="draft" />
        <el-option label="已发布" value="published" />
      </el-select>
      <el-button type="primary" style="margin-left: auto" @click="$router.push('/admin/articles/edit')">新增文章</el-button>
    </div>
    <el-table :data="tableData" stripe v-loading="loading">
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
      <el-table-column prop="category_name" label="分类" width="120" />
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 'draft' ? 'warning' : 'success'">{{ row.status === 'draft' ? '草稿' : '已发布' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="view_count" label="浏览量" width="90" />
      <el-table-column label="是否置顶" width="90">
        <template #default="{ row }">
          <el-tag :type="row.is_top ? 'danger' : 'info'">{{ row.is_top ? '是' : '否' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间" width="180" />
      <el-table-column label="操作" width="160" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="$router.push(`/admin/articles/edit/${row.id}`)">编辑</el-button>
          <el-popconfirm title="确定删除该文章吗？" @confirm="handleDelete(row.id)">
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
import { adminGetArticleList, adminDeleteArticle } from '@/api/admin'

const searchKeyword = ref('')
const statusFilter = ref('')
const tableData = ref([])
const loading = ref(false)
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

const loadList = async () => {
  loading.value = true
  try {
    const res = await adminGetArticleList({
      page: page.value,
      page_size: pageSize.value,
      keyword: searchKeyword.value,
      status: statusFilter.value
    })
    tableData.value = res.data.list || []
    total.value = res.data.total || 0
  } finally {
    loading.value = false
  }
}

const handleDelete = async (id) => {
  await adminDeleteArticle(id)
  ElMessage.success('删除成功')
  loadList()
}

onMounted(loadList)
</script>

<style scoped>
.article-manage {
  padding: 20px;
}
.top-bar {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}
</style>

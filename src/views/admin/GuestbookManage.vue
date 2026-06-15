<template>
  <div class="guestbook-manage">
    <el-table :data="tableData" stripe v-loading="loading">
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column prop="nickname" label="昵称" width="120" />
      <el-table-column prop="content" label="内容" min-width="200" show-overflow-tooltip />
      <el-table-column prop="reply" label="回复" min-width="200" show-overflow-tooltip />
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 'pending' ? 'warning' : row.status === 'approved' ? 'success' : 'danger'">
            {{ row.status === 'pending' ? '待审核' : row.status === 'approved' ? '已通过' : '已隐藏' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="ip" label="IP" width="140" />
      <el-table-column prop="created_at" label="时间" width="180" />
      <el-table-column label="操作" width="160" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="openReplyDialog(row)">回复</el-button>
          <el-popconfirm title="确定删除该留言吗？" @confirm="handleDelete(row.id)">
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
    <el-dialog v-model="replyDialogVisible" title="回复留言" width="560px">
      <el-input v-model="replyContent" type="textarea" :rows="5" placeholder="请输入回复内容" />
      <template #footer>
        <el-button @click="replyDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleReply" :loading="replySaving">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { adminGetGuestbookList, adminReplyMessage, adminDeleteMessage } from '@/api/admin'

const tableData = ref([])
const loading = ref(false)
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const replyDialogVisible = ref(false)
const replyContent = ref('')
const replyId = ref(null)
const replySaving = ref(false)

const loadList = async () => {
  loading.value = true
  try {
    const res = await adminGetGuestbookList({
      page: page.value,
      size: pageSize.value
    })
    tableData.value = res.data.records || []
    total.value = res.data.total || 0
  } finally {
    loading.value = false
  }
}

const openReplyDialog = (row) => {
  replyId.value = row.id
  replyContent.value = row.reply || ''
  replyDialogVisible.value = true
}

const handleReply = async () => {
  replySaving.value = true
  try {
    await adminReplyMessage(replyId.value, { reply: replyContent.value })
    ElMessage.success('回复成功')
    replyDialogVisible.value = false
    loadList()
  } finally {
    replySaving.value = false
  }
}

const handleDelete = async (id) => {
  await adminDeleteMessage(id)
  ElMessage.success('删除成功')
  loadList()
}

onMounted(loadList)
</script>

<style scoped>
.guestbook-manage {
  padding: 20px;
}
</style>

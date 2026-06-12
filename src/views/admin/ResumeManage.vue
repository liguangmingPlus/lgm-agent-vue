<template>
  <div class="resume-manage">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="基本信息" name="info">
        <el-form :model="infoForm" label-width="100px" style="max-width: 700px">
          <el-form-item label="姓名">
            <el-input v-model="infoForm.name" />
          </el-form-item>
          <el-form-item label="职位">
            <el-input v-model="infoForm.title" />
          </el-form-item>
          <el-form-item label="头像">
            <div style="display: flex; gap: 8px; width: 100%">
              <el-input v-model="infoForm.avatar" placeholder="图片URL" />
              <el-upload :show-file-list="false" :before-upload="handleInfoUpload" accept="image/*">
                <el-button>上传</el-button>
              </el-upload>
            </div>
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="infoForm.phone" />
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="infoForm.email" />
          </el-form-item>
          <el-form-item label="GitHub">
            <el-input v-model="infoForm.github" />
          </el-form-item>
          <el-form-item label="博客">
            <el-input v-model="infoForm.blog" />
          </el-form-item>
          <el-form-item label="所在地">
            <el-input v-model="infoForm.location" />
          </el-form-item>
          <el-form-item label="简介">
            <el-input v-model="infoForm.summary" type="textarea" :rows="4" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveInfo" :loading="infoSaving">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="工作经历" name="experience">
        <div class="top-bar">
          <el-button type="primary" @click="openExpDialog()">新增经历</el-button>
        </div>
        <el-table :data="experienceList" stripe v-loading="expLoading">
          <el-table-column prop="id" label="ID" width="70" />
          <el-table-column prop="company" label="公司" />
          <el-table-column prop="position" label="职位" />
          <el-table-column prop="start_date" label="开始时间" width="120" />
          <el-table-column prop="end_date" label="结束时间" width="120" />
          <el-table-column prop="sort_order" label="排序" width="80" />
          <el-table-column label="操作" width="160">
            <template #default="{ row }">
              <el-button type="primary" link @click="openExpDialog(row)">编辑</el-button>
              <el-popconfirm title="确定删除吗？" @confirm="deleteExp(row.id)">
                <template #reference>
                  <el-button type="danger" link>删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="教育背景" name="education">
        <div class="top-bar">
          <el-button type="primary" @click="openEduDialog()">新增教育</el-button>
        </div>
        <el-table :data="educationList" stripe v-loading="eduLoading">
          <el-table-column prop="id" label="ID" width="70" />
          <el-table-column prop="school" label="学校" />
          <el-table-column prop="major" label="专业" />
          <el-table-column prop="degree" label="学位" width="100" />
          <el-table-column prop="start_date" label="开始时间" width="120" />
          <el-table-column prop="end_date" label="结束时间" width="120" />
          <el-table-column prop="sort_order" label="排序" width="80" />
          <el-table-column label="操作" width="160">
            <template #default="{ row }">
              <el-button type="primary" link @click="openEduDialog(row)">编辑</el-button>
              <el-popconfirm title="确定删除吗？" @confirm="deleteEdu(row.id)">
                <template #reference>
                  <el-button type="danger" link>删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="专业技能" name="skill">
        <div class="top-bar">
          <el-button type="primary" @click="openSkillDialog()">新增技能</el-button>
        </div>
        <el-table :data="skillList" stripe v-loading="skillLoading">
          <el-table-column prop="id" label="ID" width="70" />
          <el-table-column prop="name" label="技能名" />
          <el-table-column label="熟练度" width="200">
            <template #default="{ row }">
              <el-progress :percentage="row.level" />
            </template>
          </el-table-column>
          <el-table-column prop="category" label="分类" />
          <el-table-column prop="sort_order" label="排序" width="80" />
          <el-table-column label="操作" width="160">
            <template #default="{ row }">
              <el-button type="primary" link @click="openSkillDialog(row)">编辑</el-button>
              <el-popconfirm title="确定删除吗？" @confirm="deleteSkill(row.id)">
                <template #reference>
                  <el-button type="danger" link>删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <el-dialog v-model="expDialogVisible" :title="expEditingId ? '编辑经历' : '新增经历'" width="560px">
      <el-form :model="expForm" label-width="80px">
        <el-form-item label="公司">
          <el-input v-model="expForm.company" />
        </el-form-item>
        <el-form-item label="职位">
          <el-input v-model="expForm.position" />
        </el-form-item>
        <el-form-item label="开始时间">
          <el-input v-model="expForm.start_date" placeholder="如: 2020-01" />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-input v-model="expForm.end_date" placeholder="如: 2023-06 或 至今" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="expForm.description" type="textarea" :rows="4" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="expForm.sort_order" :min="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="expDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveExp" :loading="expSaving">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="eduDialogVisible" :title="eduEditingId ? '编辑教育' : '新增教育'" width="560px">
      <el-form :model="eduForm" label-width="80px">
        <el-form-item label="学校">
          <el-input v-model="eduForm.school" />
        </el-form-item>
        <el-form-item label="专业">
          <el-input v-model="eduForm.major" />
        </el-form-item>
        <el-form-item label="学位">
          <el-input v-model="eduForm.degree" />
        </el-form-item>
        <el-form-item label="开始时间">
          <el-input v-model="eduForm.start_date" placeholder="如: 2016-09" />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-input v-model="eduForm.end_date" placeholder="如: 2020-06" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="eduForm.description" type="textarea" :rows="4" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="eduForm.sort_order" :min="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="eduDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveEdu" :loading="eduSaving">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="skillDialogVisible" :title="skillEditingId ? '编辑技能' : '新增技能'" width="560px">
      <el-form :model="skillForm" label-width="80px">
        <el-form-item label="技能名">
          <el-input v-model="skillForm.name" />
        </el-form-item>
        <el-form-item label="熟练度">
          <el-slider v-model="skillForm.level" :min="0" :max="100" />
        </el-form-item>
        <el-form-item label="分类">
          <el-input v-model="skillForm.category" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="skillForm.sort_order" :min="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="skillDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveSkill" :loading="skillSaving">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  adminGetResumeInfo,
  adminUpdateResumeInfo,
  adminGetExperienceList,
  adminCreateExperience,
  adminUpdateExperience,
  adminDeleteExperience,
  adminGetEducationList,
  adminCreateEducation,
  adminUpdateEducation,
  adminDeleteEducation,
  adminGetSkillList,
  adminCreateSkill,
  adminUpdateSkill,
  adminDeleteSkill,
  adminUpload
} from '@/api/admin'

const activeTab = ref('info')

const infoForm = ref({
  name: '',
  title: '',
  avatar: '',
  phone: '',
  email: '',
  github: '',
  blog: '',
  location: '',
  summary: ''
})
const infoSaving = ref(false)

const loadInfo = async () => {
  const res = await adminGetResumeInfo()
  const data = res.data
  infoForm.value = {
    name: data.name || '',
    title: data.title || '',
    avatar: data.avatar || '',
    phone: data.phone || '',
    email: data.email || '',
    github: data.github || '',
    blog: data.blog || '',
    location: data.location || '',
    summary: data.summary || ''
  }
}

const handleInfoUpload = async (file) => {
  const res = await adminUpload(file)
  infoForm.value.avatar = res.data.url
  ElMessage.success('上传成功')
  return false
}

const saveInfo = async () => {
  infoSaving.value = true
  try {
    await adminUpdateResumeInfo(infoForm.value)
    ElMessage.success('保存成功')
  } finally {
    infoSaving.value = false
  }
}

const experienceList = ref([])
const expLoading = ref(false)
const expDialogVisible = ref(false)
const expEditingId = ref(null)
const expSaving = ref(false)
const expForm = ref({
  company: '',
  position: '',
  start_date: '',
  end_date: '',
  description: '',
  sort_order: 0
})

const loadExperiences = async () => {
  expLoading.value = true
  try {
    const res = await adminGetExperienceList()
    experienceList.value = res.data || []
  } finally {
    expLoading.value = false
  }
}

const openExpDialog = (row = null) => {
  if (row) {
    expEditingId.value = row.id
    expForm.value = {
      company: row.company,
      position: row.position,
      start_date: row.start_date,
      end_date: row.end_date,
      description: row.description,
      sort_order: row.sort_order
    }
  } else {
    expEditingId.value = null
    expForm.value = { company: '', position: '', start_date: '', end_date: '', description: '', sort_order: 0 }
  }
  expDialogVisible.value = true
}

const saveExp = async () => {
  expSaving.value = true
  try {
    if (expEditingId.value) {
      await adminUpdateExperience(expEditingId.value, expForm.value)
    } else {
      await adminCreateExperience(expForm.value)
    }
    ElMessage.success('保存成功')
    expDialogVisible.value = false
    loadExperiences()
  } finally {
    expSaving.value = false
  }
}

const deleteExp = async (id) => {
  await adminDeleteExperience(id)
  ElMessage.success('删除成功')
  loadExperiences()
}

const educationList = ref([])
const eduLoading = ref(false)
const eduDialogVisible = ref(false)
const eduEditingId = ref(null)
const eduSaving = ref(false)
const eduForm = ref({
  school: '',
  major: '',
  degree: '',
  start_date: '',
  end_date: '',
  description: '',
  sort_order: 0
})

const loadEducations = async () => {
  eduLoading.value = true
  try {
    const res = await adminGetEducationList()
    educationList.value = res.data || []
  } finally {
    eduLoading.value = false
  }
}

const openEduDialog = (row = null) => {
  if (row) {
    eduEditingId.value = row.id
    eduForm.value = {
      school: row.school,
      major: row.major,
      degree: row.degree,
      start_date: row.start_date,
      end_date: row.end_date,
      description: row.description,
      sort_order: row.sort_order
    }
  } else {
    eduEditingId.value = null
    eduForm.value = { school: '', major: '', degree: '', start_date: '', end_date: '', description: '', sort_order: 0 }
  }
  eduDialogVisible.value = true
}

const saveEdu = async () => {
  eduSaving.value = true
  try {
    if (eduEditingId.value) {
      await adminUpdateEducation(eduEditingId.value, eduForm.value)
    } else {
      await adminCreateEducation(eduForm.value)
    }
    ElMessage.success('保存成功')
    eduDialogVisible.value = false
    loadEducations()
  } finally {
    eduSaving.value = false
  }
}

const deleteEdu = async (id) => {
  await adminDeleteEducation(id)
  ElMessage.success('删除成功')
  loadEducations()
}

const skillList = ref([])
const skillLoading = ref(false)
const skillDialogVisible = ref(false)
const skillEditingId = ref(null)
const skillSaving = ref(false)
const skillForm = ref({
  name: '',
  level: 50,
  category: '',
  sort_order: 0
})

const loadSkills = async () => {
  skillLoading.value = true
  try {
    const res = await adminGetSkillList()
    skillList.value = res.data || []
  } finally {
    skillLoading.value = false
  }
}

const openSkillDialog = (row = null) => {
  if (row) {
    skillEditingId.value = row.id
    skillForm.value = {
      name: row.name,
      level: row.level,
      category: row.category,
      sort_order: row.sort_order
    }
  } else {
    skillEditingId.value = null
    skillForm.value = { name: '', level: 50, category: '', sort_order: 0 }
  }
  skillDialogVisible.value = true
}

const saveSkill = async () => {
  skillSaving.value = true
  try {
    if (skillEditingId.value) {
      await adminUpdateSkill(skillEditingId.value, skillForm.value)
    } else {
      await adminCreateSkill(skillForm.value)
    }
    ElMessage.success('保存成功')
    skillDialogVisible.value = false
    loadSkills()
  } finally {
    skillSaving.value = false
  }
}

const deleteSkill = async (id) => {
  await adminDeleteSkill(id)
  ElMessage.success('删除成功')
  loadSkills()
}

onMounted(() => {
  loadInfo()
  loadExperiences()
  loadEducations()
  loadSkills()
})
</script>

<style scoped>
.resume-manage {
  padding: 20px;
}
.top-bar {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}
</style>

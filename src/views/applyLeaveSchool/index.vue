<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="15%">
      <el-form-item label="姓名">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="学号">
        <el-input v-model="form.sid" />
      </el-form-item>
      <el-form-item label="学院/书院">
        <el-input v-model="form.school" />
      </el-form-item>
      <el-form-item label="联系方式">
        <el-input v-model="form.phone" />
      </el-form-item>
      <el-form-item label="详细事由">
        <el-input v-model="form.reason" type="textarea" />
      </el-form-item>
      <el-form-item label="开始时间">
        <el-date-picker v-model="form.startTime" type="datetime" placeholder="选择申请开始时间" style="width: 100%;" />
      </el-form-item>
      <el-form-item label="开始时间">
        <el-date-picker v-model="form.endTime" type="datetime" placeholder="选择申请结束时间" style="width: 100%;" />
      </el-form-item>
      <el-form-item label="详细行程">
        <el-input v-model="form.destination" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: '',
        sid: '',
        school: '',
        phone: '',
        reason: '',
        startTime: '',
        endTime: '',
        destination: ''
      }
    }
  },

  methods: {
    onSubmit() {
      this.$message('submit!')
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    }
  }
}
</script>

<style scoped>
.line{
text-align: center;
}
</style>


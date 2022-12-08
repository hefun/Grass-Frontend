<template>
  <div class="app-container">
    <el-form ref="form" :rules="rules" :model="form" label-width="15%">
      <el-form-item label="姓名">
        <el-input v-model="form.name" :disabled="true" />
      </el-form-item>
      <el-form-item label="学号">
        <el-input v-model="form.sid" :disabled="true" />
      </el-form-item>
      <el-form-item label="学院/书院">
        <el-input v-model="form.school" :disabled="true" />
      </el-form-item>
      <el-form-item label="联系方式">
        <el-input v-model="form.phone" :disabled="true" />
      </el-form-item>
      <el-form-item label="详细事由" prop="reason">
        <el-input v-model="form.reason" type="textarea" />
      </el-form-item>
      <el-form-item label="开始时间" prop="startTime">
        <el-date-picker v-model="form.startTime" type="datetime" placeholder="选择申请开始时间" style="width: 100%;" />
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-date-picker v-model="form.endTime" type="datetime" placeholder="选择申请结束时间" style="width: 100%;" />
      </el-form-item>
      <el-form-item label="详细行程" prop="destination">
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
import { addApply } from '@/api/apply'
import store from '@/store'
export default {
  data() {
    return {
      form: {
        name: store.getters.name,
        sid: store.getters.id,
        school: store.getters.department,
        phone: store.getters.phone,
        reason: '',
        startTime: undefined,
        endTime: undefined,
        destination: ''
      },
      rules: {
        reason: [{ required: true, message: '详细事由不能为空', trigger: 'blur' }],
        startTime: [{ type: 'date', required: true, message: '请选择开始时间', trigger: 'change' }],
        endTime: [{ type: 'date', required: true, message: '请选择结束时间', trigger: 'change' }],
        destination: [{ required: true, message: '详细行程不能为空', trigger: 'blur' }]
      }
    }
  },

  methods: {
    onSubmit() {
      console.log(this.form)
      console.log(this.form.startTime)
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const formdata = {
            from_id: store.getters.userId,
            from_time: new Date(Date.now()).toLocaleString(),
            to_time: '',
            start_time: this.form.startTime.toLocaleString(),
            end_time: this.form.endTime.toLocaleString(),
            destination: this.form.destination,
            reason: this.form.reason,
            comment: '',
            status: 0
          }
          addApply(formdata).then(response => {
            console.log(response)
            if (response.status === 1) {
              this.$notify({
                title: 'Success',
                message: '提交成功',
                type: 'success',
                duration: 1000
              })
              // 之后需要跳转到申请列表中去，也需要重新获取一次申请列表
              this.$router.push({ name: 'myApply' })
            } else {
              this.$message({
                message: '出错了……',
                type: 'error'
              })
            }
          })
        }
      })
      // this.$message('submit!')
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning',
        duration: 1000
      })
      this.$router.push({ name: 'myApply' })
    }
  }
}
</script>

<style scoped>
.line{
text-align: center;
}
</style>


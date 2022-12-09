<template>
  <div class="app-container">
    <el-form class="db_form" ref="dbTable" :model="dbTable" :rulse="rules" auto-complete="on">
      <el-form-item
        label-width="100px"
        label="Table name"
        :prop="'tableName'"
        :rules="rules.tableName">
        <el-input v-model="dbTable.tableName" placeholder="table name" clearable></el-input>
      </el-form-item>
      <el-table ref="table-input" highlight-current-row :data="dbTable.columnDtoList">
        <el-table-column label="name">
          <template slot-scope="scope">
            <el-form-item :prop="'columnDtoList.'+scope.$index+'.columnName'" :rules="rules.columnName" class="all">
              <el-input v-model="scope.row.columnName" placeholder="field name" clearable></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="type">
          <template slot-scope="scope">
            <el-form-item :prop="'columnDtoList.'+scope.$index+'.type'" :rules="rules.type" class="all">
              <el-input v-model="scope.row.type" placeholder="data type" clearable></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="key" width="90px">
          <template slot-scope="scope">
            <el-form-item :prop="'columnDtoList.'+scope.$index+'.isKey'" class="all">
              <el-switch
                v-model="scope.row.isKey"
                active-color="#13ce66"
                inactive-color="#dddddd">
              </el-switch>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="query" width="90px">
          <template slot-scope="scope">
            <el-form-item :prop="'columnDtoList.'+scope.$index+'.isQuery'" class="all">
              <el-switch
                v-model="scope.row.isQuery"
                active-color="#13ce66"
                inactive-color="#dddddd">
              </el-switch>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column width="90px">
          <el-button type="primary" size="mini" @click="addLine()">
            New
          </el-button>
        </el-table-column>
        <el-table-column width="90px">
          <template slot-scope="scope">
            <div v-if="dbTable.columnDtoList.length!==1">
              <el-button size="mini" type="danger" @click="removeLine(scope.$index, scope.row)">
                Delete
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-form>

    <div style="margin:20px 0 0 0">
      <el-button @click="submit">Submit</el-button>
    </div>
  </div>
</template>

<script>
import { genCode } from '@/api/dev'

export default {
  data() {
    return {
      dbTable: {
        tableName: '',
        columnDtoList: [
          {
            columnName: '',
            type: '',
            isKey: false,
            isQuery: false
          }
        ]
      },
      index: 0,
      rules: {
        tableName: [{ required: true, message: 'Please input a table name to create', trigger: 'blur' }],
        columnName: [{ required: true, message: 'Please input a field name', trigger: 'blur' }],
        type: [{ required: true, message: 'Please input a data type', trigger: 'blur' }]
      }
    }
  },
  methods: {
    addLine() {
      const newLine = {
        columnName: '',
        type: '',
        isKey: false,
        isQuery: false
      }
      this.index++
      this.dbTable.columnDtoList.push(newLine)
    },
    removeLine(index, row) {
      this.dbTable.columnDtoList.splice(index, 1)
    },
    // 提交
    submit() {
      this.$refs.dbTable.validate((valid) => {
        if (valid) {
          this.$confirm('Sure to submit?', 'Notice', {
            confirmButtonText: 'Submit',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }).then(() => {
            console.log('校验通过')
            console.log(this.dbTable)
            genCode(this.dbTable).then(response => {
              console.log(response)
              if (response.status === 1) {
                this.$notify({
                  title: 'Success',
                  message: '提交成功',
                  type: 'success',
                  duration: 1000
                })
                // // 之后需要跳转到申请列表中去，也需要重新获取一次申请列表
                // this.$router.push({ name: 'myApply' })
              } else {
                this.$message({
                  message: '出错了……',
                  type: 'error'
                })
              }
            })
          })
        }
      })
    }
  }
}
</script>

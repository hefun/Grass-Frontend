<template>
  <div class="app-container">
    <!--div class="filter-container">
        <el-input v-model="listQuery.title" placeholder="Title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-select v-model="listQuery.importance" placeholder="Imp" clearable style="width: 90px" class="filter-item">
          <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
        </el-select>
        <el-select v-model="listQuery.type" placeholder="Type" clearable class="filter-item" style="width: 130px">
          <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
        </el-select>
        <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
          <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
        </el-select>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          Search
        </el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
          Add
        </el-button>
        <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
          reviewer
        </el-checkbox>
      </div-->

    <div class="filter-container">
      <el-select v-model="listQuery.sort" style="width:15em" class="fileter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="序号" prop="id" align="center">
        <template slot-scope="{row}">
          <span>{{ row.userId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学工号" align="center">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学院" align="center">
        <template slot-scope="{row}">
          <span>{{ row.department }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系方式" align="center">
        <template slot-scope="{row}">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="辅导员" align="center">
        <template slot-scope="{row}">
          <span>{{ row.to_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" align="center">
        <template slot-scope="{row}">
          <el-tag v-for="role in row.roles" :key="role" type="success"> {{ role }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" type="info" @click="changeRole(row,$index)">
            角色
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="编辑信息" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left">
        <el-form-item label="学工号">
          <el-input v-model="temp.id" />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="学院/书院">
          <el-input v-model="temp.department" />
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="temp.phone" />
        </el-form-item>
        <el-form-item label="辅导员">
          <el-select v-model="temp.to_id" style="width:15em" class="fileter-item">
            <el-option v-for="item in teachers" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import { getUsers, updateUser, deleteUser } from '@/api/user'

export default {
  name: 'UserManage',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null, // 用户信息的列表
      total: 0,
      listLoading: true,
      listQuery: {
        id: '',
        name: '',
        department: '',
        page: 1,
        limit: 10,
        sort: '+id' // 按学号递增排列
      },
      sortOptions: [
        {
          label: '按学号递增排列',
          key: '+id'
        },
        {
          label: '按学号递减排列',
          key: '-id'
        }
      ],
      dialogFormVisible: false, // 用户信息编辑的弹窗是否显示
      dialogRoleFormVisible: false, // 用户角色配置的弹窗是否显示
      temp: {
        userId: '',
        id: '',
        name: '',
        department: '',
        phone: '',
        to_id: '',
        to_name: '',
        roles: []
      },
      rules: {}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取用户信息列表
    getList() {
      this.listLoading = true
      getUsers(this.listQuery).then(response => {
        this.list = response.data.userList
        this.total = response.data.total
      })
      this.listLoading = false
    },
    // 更改排序方式
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 点击编辑后发生的弹窗等动作
    handleUpdate(row) {
      this.temp.userId = row.userId
      this.temp.id = row.id
      this.temp.name = row.name
      this.temp.department = row.department
      this.temp.phone = row.phone
      this.temp.to_id = row.to_id
      this.temp.to_name = row.to_name
      this.temp.roles = row.roles

      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    // 在修改信息的弹窗中点击确认后发生的动作
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = this.temp
          updateUser(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '信息修改成功',
              type: 'success',
              duration: 1000
            })
          })
        }
      })
    },

    // 删除用户信息
    handleDelete(row, index) {
      deleteUser({ userId: row.userId }).then(() => {
        this.$notify({
          title: 'Success',
          message: '删除成功',
          type: 'success',
          duration: 1000
        })
        this.getList()
      })
    }
  }

}
</script>


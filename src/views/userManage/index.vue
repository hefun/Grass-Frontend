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

    <div>
      <el-select v-model="listQuery.sort" style="width:15em" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增用户
      </el-button>
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
          <el-button size="mini" type="info" @click="handleChangeRole(row)">
            角色
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="info" :visible.sync="dialogFormVisible">
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

    <!--配置用户角色-->
    <el-dialog :title="role" :visible.sync="dialogRoleFormVisible">
      <el-checkbox-group v-model="checkList">
        <el-checkbox v-for="role in rolesList" :key="role.id" :label="role.name"> {{ role.name }}</el-checkbox>
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRoleFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateRole()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import { getUsers, updateUser, deleteUser, getTeachers } from '@/api/user'
import { getRoles } from '@/api/role'
export default {
  name: 'UserManage',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: [], // 用户信息的列表
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
        userId: undefined,
        id: '',
        name: '',
        department: '',
        phone: '',
        to_id: '',
        to_name: '',
        roles: []
      },
      rules: {},
      teachers: [],
      rolesList: [
        {
          id: 1,
          name: 'ADMIN',
          description: '我是无敌的管理员',
          permissions: [
            {
              name: '出入校申请',
              key: 'apply'
            }
          ]
        }
      ],
      checkList: []
    }
  },
  created() {
    this.getList()
    this.getRoles()
  },
  methods: {
    // 获取用户信息列表
    getList() {
      this.listLoading = true
      getUsers(this.listQuery).then(response => {
        this.list = response.data.userList
        console.log('userManage, 202')
        console.log(this.list)
        this.total = response.data.total
        console.log('userManage, 205')
        console.log(this.total)
      })
      this.listLoading = false
    },
    getTeachers(row) {
      getTeachers(row.department).then(response => {
        this.teachers = response.data
      })
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

      this.getTeachers(row)

      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    // 点击新增用户后发生的弹窗等动作
    handleCreate() {
      this.dialogFormVisible = true
      this.temp.userId = undefined
      this.temp.id = ''
      this.temp.name = ''
      this.temp.department = ''
      this.temp.phone = ''
      this.temp.to_id = ''
      this.temp.to_name = ''
      this.temp.roles = []

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
            // const index = this.list.findIndex(v => v.id === this.temp.id)
            // this.list.splice(index, 1, this.temp)
            this.getList()
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
      deleteUser(row.userId).then(() => {
        this.$notify({
          title: 'Success',
          message: '删除成功',
          type: 'success',
          duration: 1000
        })
        this.getList()
      })
    },

    getRoles() {
      getRoles().then(response => {
        this.rolesList = response.data
        console.log('usermanager 305')
        console.log('rolesList')
        console.log(this.rolesList)
        console.log('usermanager 308')
      })
    },

    // 点击角色按钮后发生的动作
    handleChangeRole(row) {
      // 获取角色列表、将当前用户的row赋给checklist、打开弹窗
      this.getRoles()
      this.checkList = row.roles
      this.temp.userId = row.userId
      this.temp.id = row.id
      this.temp.name = row.name
      this.temp.department = row.department
      this.temp.phone = row.phone
      this.temp.to_id = row.to_id
      this.temp.to_name = row.to_name
      this.dialogRoleFormVisible = true
    },

    // 在角色弹窗点击确认后发生
    updateRole() {
      this.temp.roles = this.checkList
      updateUser(this.temp).then(() => {
        this.getList()
        this.dialogRoleFormVisible = false
        this.$notify({
          title: 'Success',
          message: '信息修改成功',
          type: 'success',
          duration: 1000
        })
      })
    }
  }

}
</script>


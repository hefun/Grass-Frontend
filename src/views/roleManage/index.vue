<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRole">新建角色</el-button>

    <el-table :data="rolesList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="序号" width="220">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色名称" width="220">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="角色描述">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="拥有权限">
        <template slot-scope="scope">
          <el-tag v-for="permission in scope.row.permissions" :key="permission.key" type="success"> {{ permission.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑角色':'新建角色'">
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="角色名称">
          <el-input v-model="role.name" placeholder="填写角色名称" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input
            v-model="role.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="填写角色描述"
          />
        </el-form-item>
        <el-form-item label="拥有权限">
          <el-checkbox-group v-model="checkList">
            <el-checkbox label="apply">出入校申请</el-checkbox>
            <el-checkbox label="review">出入校审批</el-checkbox>
            <el-checkbox label="manage">权限管理</el-checkbox>
            <el-checkbox label="dev">后台管理</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmRole">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import path from 'path'
import { deepClone } from '@/utils'
import { getRoles, addRole, deleteRole, updateRole } from '@/api/role'
import permission from '@/store/modules/permission'

const defaultRole = {
  id: 0,
  name: '',
  description: '',
  permissions: []
}

export default {
  data() {
    return {
      role: Object.assign({}, defaultRole),
      routes: [],
      rolesList: [],
      dialogVisible: false,
      dialogType: 'new',
      checkList: []
    }
  },
  created() {
    this.getRoles()
  },
  methods: {
    async getRoles() {
      const res = await getRoles()
      this.rolesList = res.data
    },
    handleAddRole() {
      this.role = Object.assign({}, defaultRole)
      this.dialogType = 'new'
      this.dialogVisible = true
      this.checkList = []
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.role = deepClone(scope.row)
      // 设置checkList
      this.checkList = []
      for (permission in this.role.permissions) {
        this.checkList.push(permission.key)
      }
      // this.$nextTick(() => {
      //   const routes = this.generateRoutes(this.role.routes)
      //   this.$refs.tree.setCheckedNodes(this.generateArr(routes))
      // })
    },
    handleDelete({ $index, row }) {
      this.$confirm('确认删除该角色?', 'Warning', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await deleteRole(row.id)
          this.rolesList.splice($index, 1)
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        })
        .catch(err => { console.error(err) })
    },
    async confirmRole() {
      const isEdit = this.dialogType === 'edit'
      if (isEdit) {
        const temp = {
          id: this.role.id,
          name: this.role.name,
          description: this.role.description,
          permissions: this.checkList
        }
        await updateRole(this.role.id, temp)
        // for (let index = 0; index < this.rolesList.length; index++) {
        //   if (this.rolesList[index].id === this.role.id) {
        //     this.rolesList.splice(index, 1, Object.assign({}, this.role))
        //     break
        //   }
        // }
        this.getRoles()
      } else {
        const tempData = {
          id: 0,
          name: this.role.name,
          description: this.role.description,
          permissions: this.checkList
        }
        await addRole(tempData) // TODO: 待测试
        // console.log(data)
        // this.role.id = data.id
        // this.rolesList.push(this.role)
        this.getRoles()
      }

      const { description, name } = this.role
      this.dialogVisible = false
      this.$notify({
        title: '成功',
        dangerouslyUseHTMLString: true,
        message: `
              <div>角色名称: ${name}</div>
              <div>角色描述: ${description}</div>
            `,
        type: 'success'
      })
    }
  }
}
</script>

  <style lang="scss" scoped>
  .app-container {
    .roles-table {
      margin-top: 30px;
    }
    .permission-tree {
      margin-bottom: 30px;
    }
  }
  </style>


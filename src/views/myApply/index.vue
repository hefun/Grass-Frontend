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
    <div class="filter-container" style="margin:0 0 20px 0">
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
      <el-table-column label="序号" prop="id">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请提交时间">
        <template slot-scope="{row}">
          <span>{{ row.from_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请开始时间">
        <template slot-scope="{row}">
          <span>{{ row.start_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请结束时间">
        <template slot-scope="{row}">
          <span>{{ row.end_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="详细事由">
        <template slot-scope="{row}">
          <span>{{ row.reason }}</span>
        </template>
      </el-table-column>
      <el-table-column label="详细行程">
        <template slot-scope="{row}">
          <span>{{ row.destination }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审批状态" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag v-if="(row.status===0)" :type="row.status | statusFilter">
            待审批
          </el-tag>
          <el-tag v-if="(row.status===1)" :type="row.status | statusFilter">
            已通过
          </el-tag>
          <el-tag v-if="(row.status===2)" :type="row.status | statusFilter">
            已驳回
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="审批人">
        <template slot-scope="{row}">
          <span v-if="row.status === 0" style="color: lightgray">待审批</span>
          <span v-else>{{ row.to_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审批意见">
        <template slot-scope="{row}">
          <span v-if="row.status === 0" style="color: lightgray">暂无审批意见</span>
          <span v-else>{{ row.comment }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <div v-if="row.status === 0">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">
              编辑
            </el-button>
            <!--el-button v-if="row.status!='published'" size="mini" type="success" @click="handleModifyStatus(row,'published')">
              Publish
            </el-button-->
            <!--el-button v-if="row.status!='draft'" size="mini" @click="handleModifyStatus(row,'draft')">
              Draft
            </el-button-->
            <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
              删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="编辑申请" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left">
        <el-form-item label="姓名">
          <el-input v-model="user.name" :disabled="true" />
        </el-form-item>
        <el-form-item label="学号">
          <el-input v-model="user.id" :disabled="true" />
        </el-form-item>
        <el-form-item label="学院/书院">
          <el-input v-model="user.department" :disabled="true" />
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="user.phone" :disabled="true" />
        </el-form-item>
        <el-form-item label="详细事由">
          <el-input v-model="temp.reason" type="textarea" />
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker v-model="temp.startTime" type="datetime" placeholder="选择申请开始时间" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker v-model="temp.endTime" type="datetime" placeholder="选择申请结束时间" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="详细行程">
          <el-input v-model="temp.destination" type="textarea" />
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

    <!--el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog-->
  </div>
</template>

<script>
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import { deleteApply, fetchMyApply, updateApply } from '@/api/apply'
import store from '@/store'
export default {
  name: 'MyApply',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: 'info',
        1: 'success',
        2: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null, // 申请信息的列表
      total: 0,
      listLoading: true,
      statusOptions: ['未审批', '审批通过', '审批驳回'],
      listQuery: {
        from_id: store.getters.userId,
        page: 1,
        limit: 10,
        sort: '-time' // 按申请时间倒序排列
      },
      sortOptions: [
        {
          label: '按申请时间倒序排列',
          key: '-time'
        },
        {
          label: '按申请时间正序排列',
          key: '+time'
        }
      ],
      dialogFormVisible: false,
      rules: {
        reason: [{ required: true, message: '详细事由不能为空', trigger: 'blur' }],
        startTime: [{ type: 'date', required: true, message: '请选择开始时间', trigger: 'change' }],
        endTime: [{ type: 'date', required: true, message: '请选择结束时间', trigger: 'change' }],
        destination: [{ required: true, message: '详细行程不能为空', trigger: 'blur' }]
      },
      user: {
        name: store.getters.name,
        id: store.getters.id,
        department: store.getters.department,
        phone: store.getters.phone
      },
      temp: {
        id: 0,
        startTime: new Date(),
        endTime: new Date(),
        destination: '',
        reason: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchMyApply(this.listQuery).then(response => {
        this.list = response.data.applyList
        this.total = response.data.total
      })
      this.listLoading = false
    },
    handelFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleUpdate(row) {
      this.temp.id = row.id
      this.temp.startTime = new Date(Date.parse(row.start_time))
      this.temp.endTime = new Date(Date.parse(row.end_time))
      this.temp.destination = row.destination
      this.temp.reason = row.reason
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = {
            from_id: store.getters.userId,
            apply_id: this.temp.id,
            start_time: this.temp.startTime,
            end_time: this.temp.endTime,
            destination: this.temp.destination,
            reason: this.temp.reason
          }
          updateApply(tempData).then(response => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, response.data)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '申请修改成功',
              type: 'success',
              duration: 1000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      deleteApply({ id: row.id }).then(() => {
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


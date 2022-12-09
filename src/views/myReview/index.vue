<template>
  <div class="app-container">
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
      :default-sort="{prop: 'from_time', order: 'ascending'}"
    >
      <el-table-column label="序号" prop="id">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="left">
        <template slot-scope="{row}">
          <span>{{ row.from_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学号" align="left">
        <template slot-scope="{row}">
          <span>{{ row.student_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="院系" align="left">
        <template slot-scope="{row}">
          <span>{{ row.department }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系方式" align="left">
        <template slot-scope="{row}">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="from_time"
        sortable
        :sort-orders="['ascending', 'descending', '']"
        label="申请提交时间"
      >
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
      <el-table-column
        label="审批状态"
        class-name="status-col"
        width="100"
        :filters="[{ text: '待审批', value: 0 },
                   { text: '已通过', value: 1 },
                   { text: '已驳回', value: 2 }]"
        :filter-method="filterStatus"
        filter-placement="bottom-end"
      >
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
      <el-table-column label="审批意见">
        <template slot-scope="{row}">
          <span v-if="row.status === 0" style="color: blue">🚩待审批</span>
          <span v-else>{{ row.comment }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <div v-if="row.status === 0">
            <el-button type="primary" size="mini" @click="handleUpdate(row, 1)">
              通过
            </el-button>
            <el-button size="mini" type="danger" @click="handleUpdate(row, 2)">
              驳回
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="出校申请审批" :visible.sync="dialogFormVisible">
      <el-descriptions title="出校申请审批" :column="1" border :data="dialog">
        <el-descriptions-item label="姓名">{{ dialog.from_name }}</el-descriptions-item>
        <el-descriptions-item label="学号">{{ dialog.student_id }}</el-descriptions-item>
        <el-descriptions-item label="院系">{{ dialog.department }}</el-descriptions-item>
        <el-descriptions-item label="联系方式">{{ dialog.phone }}</el-descriptions-item>
        <el-descriptions-item label="详细事由">{{ dialog.reason }}</el-descriptions-item>
        <el-descriptions-item label="开始时间">{{ dialog.start_time }}</el-descriptions-item>
        <el-descriptions-item label="结束时间">{{ dialog.from_time }}</el-descriptions-item>
        <el-descriptions-item label="详细行程">{{ dialog.destination }}</el-descriptions-item>
        <el-descriptions-item label="审批状态">
          <span v-if="dialog.status === 1" style="color: blue">通过</span>
          <span v-else-if="dialog.status === 2" style="color: red">驳回</span>
          <span v-else>异常</span>
        </el-descriptions-item>
      </el-descriptions>
      <div style="margin:20px 0 0 0">
        <p style="font-weight: bold">审批意见</p>
        <el-input v-model="dialog.comment" placeholder="请输入内容" />
      </div>
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
import { fetchMyReview, updateReview } from '@/api/review'
import store from '@/store'

export default {
  name: 'MyReview',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) { // TODO: 可能需要改
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
        to_id: store.getters.userId,
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
        // comment: [{ required: true, message: '审批意见不能为空', trigger: 'blur' }],
        // startTime: [{ type: 'date', required: true, message: '请选择开始时间', trigger: 'change' }],
        // endTime: [{ type: 'date', required: true, message: '请选择结束时间', trigger: 'change' }],
        // destination: [{ required: true, message: '详细行程不能为空', trigger: 'blur' }]
      },
      dialog: {
        id: 1,
        from_name: '',
        student_id: '',
        department: '',
        phone: '',
        from_time: new Date(),
        start_time: new Date(),
        end_time: new Date(),
        reason: '',
        destination: '',
        status: 0,
        comment: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchMyReview(this.listQuery).then(response => {
        this.list = response.data.applyList // TODO: 待测试
        this.total = response.data.total // TODO: 要改接口，可能是分页展示要用
      })
      this.listLoading = false
    },
    filterStatus(value, row) {
      return row.status === value
    },
    handleUpdate(row, status) {
      this.dialog.id = row.id
      this.dialog.from_name = row.from_name
      this.dialog.student_id = row.student_id
      this.dialog.department = row.department
      this.dialog.phone = row.phone
      this.dialog.from_time = row.from_time
      this.dialog.start_time = row.start_time
      this.dialog.end_time = row.end_time
      this.dialog.reason = row.reason
      this.dialog.destination = row.destination
      this.dialog.status = status

      this.dialogFormVisible = true
      // this.$nextTick(() => {
      //   this.$refs['dataForm'].clearValidate()
      // })
    },
    updateData() {
      // this.$refs['dataForm'].validate((valid) => {
      //   if (valid) {
      const tempData = {
        id: this.dialog.id,
        from_id: this.dialog.from_id,
        from_name: this.dialog.from_name,
        student_id: this.dialog.student_id,
        department: this.dialog.department,
        phone: this.dialog.phone,
        to_id: store.getters.userId,
        to_name: store.getters.name,
        from_time: this.dialog.from_time,
        to_time: this.dialog.to_time,
        start_time: this.dialog.start_time,
        end_time: this.dialog.end_time,
        destination: this.dialog.destination,
        reason: this.dialog.reason,
        comment: this.dialog.comment,
        status: this.dialog.status
      }
      updateReview(tempData).then(response => {
        const index = this.list.findIndex(v => v.id === this.dialog.id)
        this.list.splice(index, 1, response.data)
        this.dialogFormVisible = false
        this.$notify({
          title: 'Success',
          message: '申请审批成功',
          type: 'success',
          duration: 1000
        })
      })
    }
    // })
    // }
  }
}
</script>

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
      :default-sort = "{prop: 'from_time', order: 'ascending'}"
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
        label="申请提交时间">
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
        filter-placement="bottom-end">
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
          <span v-if="row.status === 0" style="color: blue">🚩待审批</span>
          <span v-else>{{ row.comment }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import { fetchAllReview } from '@/api/review'
import { deleteApply } from '@/api/apply'
// import store from '@/store'

export default {
  name: 'AllReview',
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
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchAllReview(this.listQuery).then(response => {
        this.list = response.data // TODO: 待测试
        this.total = response.total // TODO: 要改接口，可能是分页展示要用
      })
      this.listLoading = false
    },
    filterStatus(value, row) {
      return row.status === value
    },
    handleDelete(row, index) {
      deleteApply({ apply_id: row.id }).then(() => {
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

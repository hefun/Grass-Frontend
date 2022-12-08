<template>
  <div class="app-container">
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="序号" prop="id" sortable="custom">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="left">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学号" align="left">
        <template slot-scope="{row}">
          <span>{{ row.sid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="院系" align="left">
        <template slot-scope="{row}">
          <span>{{ row.college }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系方式" align="left">
        <template slot-scope="{row}">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请提交时间">
        <template slot-scope="{row}">
          <span>{{ row.from_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请开始时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.start_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请结束时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.end_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="详细事由" align="center">
        <template slot-scope="{row}">
          <span>{{ row.reason }}</span>
        </template>
      </el-table-column>
      <el-table-column label="详细行程" align="center">
        <template slot-scope="{row}">
          <span>{{ row.destination }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审批状态" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            通过
          </el-button>
          <!--el-button v-if="row.status!='published'" size="mini" type="success" @click="handleModifyStatus(row,'published')">
            Publish
          </el-button-->
          <!--el-button v-if="row.status!='draft'" size="mini" @click="handleModifyStatus(row,'draft')">
            Draft
          </el-button-->
          <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
            驳回
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
import { fetchMyReview } from '@/api/review'

export default {
  name: 'MyReview',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) { // TODO: 可能需要改
      const statusMap = {
        justSubmit: 0,
        success: 1,
        fail: 2
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
        this.list = response.data // TODO: 待测试
        this.total = response.total // TODO: 要改接口，可能是分页展示要用
      })
      this.listLoading = false
    }
  }

}
</script>


<template>
  <div class="app-container">

    <div class="filter-container">
      <el-row :gutter="4">
        <el-col :lg="4" :xs="24" :sm="8" :md="6">
          <el-input v-model="query.name" placeholder="员工姓名"  class="filter-item" @keyup.enter.native="handleFilter" />
        </el-col>
        <el-col :lg="4" :xs="24" :sm="8" :md="6">
          <el-input v-model="query.phone" placeholder="员工电话" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-col>
        <el-col :lg="3" :xs="24" :sm="6" :md="4">
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            搜索
          </el-button>
        </el-col>
      </el-row>
    </div>


    <el-table
      :data="tableData"
      border
      style="width: 100%"
      @header-click="order"
      >
      <el-table-column prop="avatar" label="图片" width="80" align="center">
        <!-- 图片的显示 -->
        <template   slot-scope="scope">            
          <img :src="scope.row.avatar?scope.row.avatar:'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'"  width="60" height="60" />
        </template>         
      </el-table-column> 
      <el-table-column
        prop="name"
        label="项目名称">
      </el-table-column>
      <el-table-column
        prop="created_time"
        label="创建时间"
        width="160" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="当前状态" width="160" align="center"> 
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status | statusText }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="查看" align="center" width="100" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="view(row)">
            查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="query.page" :limit.sync="query.limit" @pagination="getList" />
  </div>
</template>

<script>
import { fetchList } from '@/api/project'
import { parseTime } from '@/utils'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'UserList',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1 : 'success',
        0 : 'warning'
      }
      return statusMap[status]
    },
    statusText(status) {
      const statusTextMap = {
        1 : '正常',
        0 : '已归档'
      }
      return statusTextMap[status]
    },
    getDepartment(department){
      if(department == 0){
       return '未指派部门' 
      }
    },
    getPosition(position){
      if(position == 0){
       return '未指派职位' 
      }
    }
  },
  data() {
    return {
      tableData: [],
      query: {
        name : '',
        status : '',
        page: 1,
        limit: 30,
      },
      total : 0,
    }
  },
  created(){
    this.getList();
  },
  methods:{
    getList(){
      fetchList(this.query).then(response => {
        this.tableData = response.data.list;
        this.total = parseInt(response.data.count);
      })
    },
    order(column, event){

    },
    view(user){

    },
    handleFilter(){

    }
  }
}
</script>
<style>
.filter-container>.filter_item{
  margin-right:10px;
}
</style>

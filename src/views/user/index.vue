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
      style="width: 100%"
      @header-click="order"
      v-loading="loading"
      >
      <el-table-column prop="avatar" label="图片" width="80" align="center">
        <!-- 图片的显示 -->
        <template slot-scope="scope">            
          <img :src="scope.row.avatar?scope.row.avatar:(scope.row.sex===1?avatar_female:avatar_male)"  width="60" height="60" />
        </template>         
      </el-table-column> 
      <el-table-column
        prop="name"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="no"
        label="工号">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="联系电话"
        width="120">
      </el-table-column>
      <el-table-column
        prop="department"
        label="所属部门">
        <template slot-scope="scope">
          <span>{{ scope.row.department | getDepartment }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="position"
        label="职位">
        <template slot-scope="scope">
          <span>{{ scope.row.position | getPosition }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="sex"
        label="性别">
        <template slot-scope="scope">
          <span>{{ scope.row.sex | getGender }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="created_time"
        label="入职时间"
        width="160" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.create_time | parseTime('{y}年{m}月{d}日') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="last_login_time"
        label="上次登录"
        width="180" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.last_login_time | formatTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="当前状态" align="center"> 
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status | statusText }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="查看" align="center" width="240" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <router-link :to="'/user/view/'+row.id">
            <el-button  plain size="mini" >
              查看
            </el-button>
          </router-link>
          <router-link :to="'/user/update/'+row.id" style="margin-left:5px">
            <el-button type="primary" plain size="mini">
              编辑
            </el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="query.page" :limit.sync="query.limit" @pagination="getList" />
  </div>
</template>

<script>
import { fetchList } from '@/api/user'
import { parseTime, timeFormatter, formatTime } from '@/utils'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import avatar_female from '@/assets/images/avatar_female.png'
import avatar_male from '@/assets/images/avatar_male.png'

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
        1 : '在职',
        0 : '已离职'
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
    },
    getGender(sex){
      const gendaerMap = {
        0: '未知',
        1: '女性',
        2: '男性'
      }
      return gendaerMap[sex];
    },
    timeFormatter(time, cFormat) {
      if(time > 0){
        return parseTime(time, cFormat)
      }else{
        return '未曾登陆';
      }
    }
  },
  data() {
    return {
      tableData: [],
      query: {
        name : '',
        phone : '',
        page: 1,
        limit: 30,
      },
      loading:true,
      total : 0,
      avatar_male : avatar_male,
      avatar_female : avatar_female
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
        this.loading = false;
      }).catch(error=>{
        this.loading = false;
      })
    },
    order(column, event){

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

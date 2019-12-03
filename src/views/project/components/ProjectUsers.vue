<template>
  <div>
    <div class="filter-container">
      <el-row :gutter="4">
        <el-col :lg="4" :xs="24" :sm="8" :md="6">
          <el-input v-model="query.name" placeholder="员工姓名"  class="filter-item" @keyup.enter.native="handleFilter" />
        </el-col>
        <el-col :lg="4" :xs="24" :sm="8" :md="6">
          <el-input v-model="query.phone" placeholder="员工电话" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-col>
        <el-col :lg="8" :xs="24" :sm="24" :md="12">
          <el-button-group> 
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
              搜索
            </el-button>
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-plus" @click="addProjectUser">
              增加成员
            </el-button>
          </el-button-group>
        </el-col>
      </el-row>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      v-loading="loading"
      >
      <el-table-column prop="avatar" label="图片" width="80" align="center">
        <!-- 图片的显示 -->
        <template slot-scope="scope">
          <Avatar :avatar="scope.row.avatar" :sex='scope.row.sex' :size="60" />
        </template>         
      </el-table-column> 
      <el-table-column
        prop="name"
        label="姓名">
        <template slot-scope="scope">
          {{scope.row.name}}
          <el-tag  v-if="scope.row.in_charge" type="danger" effect="dark" size="mini">管理员</el-tag>
        </template>
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
          <span>{{ scope.row.department_name | getDepartment }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="position"
        label="职位">
        <template slot-scope="scope">
          <span>{{ scope.row.position_name | getPosition }}</span>
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
        width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.last_login_time | formatTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="80" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-popover
            placement="left"
            trigger="click">
            <div>
              <el-button  plain size="mini" >
                查看
              </el-button>
              <el-button  plain type="danger" size="mini" @click="deleteProjectUser(row)">
                剔除成员
              </el-button>
            </div>
            <el-button  slot="reference"  plain size="mini" >
              操作
            </el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="query.page" :limit.sync="query.limit" @pagination="getList" />
    <add-user @close="visible = false" :visible="visible" :id="id" />
  </div>
</template>

<script>
import { fetchList } from '@/api/user'
import { deleteProjectUser, addProjectUser, setProjectUserInCharge } from '@/api/project'
import Avatar from '@/components/Avatar'
import { parseTime, formatTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import waves from '@/directive/waves' // waves directive

import AddUser from './AddUser'

export default {
  components:{
    Avatar,
    Pagination,
    AddUser
  },
  directives: { waves },
  props: {
    id: {
      type: Number,
    }
  },
  data(){
    return {
      tableData :[
        
      ],
      query : {
        name : '',
        department : '',
        phone : '',
        page: 1,
        limit: 30,
      },
      total : 0,
      loading : true,
      visible : false,
    }
  },
  filters: {
    timeFilter(time, format){
      if(time > 0){
        return parseTime(time, format);
      }else{
        return '未设置'
      }
    },
    imgFilter(img){
      return process.env.VUE_APP_IMAGE_BASE_URL + '/' + img
    },
    getDepartment(department){
      return department?department:'未指派部门'
    },
    getPosition(position){
      return position?position:'未指派职位' 
    },
    getGender(sex){
      const gendaerMap = {
        0: '未知',
        1: '女性',
        2: '男性'
      }
      return gendaerMap[sex];
    },
  },
  created(){
    // this.query.project = this.id;
    // this.$nextTick(() => {
    this.getList(this.id)
    // })
  },
  methods :{
    getList(id){
      this.loading = true;
      fetchList({...this.query, project: id}).then(response => {
        this.tableData = response.data.list
        this.total = parseInt(response.data.count);
        this.loading = false;
      }).catch(error=>{
        console.error(error)
      })
    },
    parseTime(time, format){
      return parseTime(time, format);
    },
    handleFilter(){
      this.getList(this.id)
    },
    addProjectUser(){
      this.visible = true
    },
    deleteProjectUser(){
      deleteProjectUser()
    }
  }
}
</script>
<style scoped>
.project_image{
  width:140px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom:40px;
  border-radius: 8px;
}
.project_imageholder{
  width:140px;
  height:140px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size:68px;
  font-weight:600;
  background-color:#a3d3ff;
  border-radius: 8px;
  color:#FFF;
}
.info_item{
  display: flex;
  font-size:14px;
  color:#777;
  margin-top:10px;
}
.info_item>div{
  line-height:21px;
}
.info_item>div:first-child{
  width:80px;
  flex-grow:0;
  flex-shrink:0;
  text-align: right;
}
.info_item>div:last-child{
  flex-grow:1;
  text-align: right;
  color:#888;
}
.avatar_badge{
  top:10px !important;
  right:30px !important;
}
</style>
<style lang="scss" scoped>
 .box-center {
   margin: 0 auto;
   display: table;
 }

 .text-muted {
   color: #777;
 }

 .user-profile {
   .user-name {
     font-weight: bold;
   }

   .box-center {
     padding-top: 10px;
   }

   .user-role {
     padding-top: 10px;
     font-weight: 400;
     font-size: 14px;
   }

   .box-social {
     padding-top: 30px;

     .el-table {
       border-top: 1px solid #dfe6ec;
     }
   }

   .user-follow {
     padding-top: 20px;
   }
 }

 .user-bio {
   margin-top: 20px;
   color: #606266;

   span {
     padding-left: 4px;
   }

   .user-bio-section {
     font-size: 14px;
     padding: 15px 0;

     .user-bio-section-header {
       border-bottom: 1px solid #dfe6ec;
       padding-bottom: 10px;
       margin-bottom: 10px;
       font-weight: bold;
     }
   }
 }
</style>

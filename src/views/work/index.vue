<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row :gutter="4">

        <el-col :lg="4" :xs="24" :sm="8" :md="6">
          <el-select v-model="query.project" placeholder="请选择项目" style="width:100%" @change="handleFilter" v-loading="projectLoading">
            <el-option
              v-for="item in projects"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>

        <el-col :lg="4" :xs="24" :sm="8" :md="6">
          <el-input v-model="query.title" placeholder="工作主题" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-col>

        <el-col :lg="4" :xs="24" :sm="12" :md="8">
          <el-select v-model="query.status" multiple placeholder="请选择工作进度" collapse-tags style="width:100%">
            <el-option
              v-for="(item, i) in status"
              :key="i"
              :label="item"
              :value="i">
            </el-option>
          </el-select>
        </el-col>

        <el-col :lg="3" :xs="24" :sm="6" :md="4">
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            搜索
          </el-button>
        </el-col>

      </el-row>
    </div>

    <el-table
      v-loading="loading"
      :data="list"
      style="width: 100%">
      <el-table-column
        prop="id"
        label="#编号"
        width="100">
        <template slot-scope="{row}">
          #{{row.id}}
        </template>
      </el-table-column>

      <el-table-column
        prop="title"
        label="工作主题"
        width="200"
        show-overflow-tooltip=true
      >
      </el-table-column>

      <el-table-column
        prop="project"
        label="所属项目"
        width="160"
        show-overflow-tooltip=true
        >
        <template slot-scope="{row}">
          <router-link :to="'/project/view/'+row.project" v-if="row.project">
            <el-button type="text" size="mini">
              {{row.project_name}}
            </el-button>
          </router-link>
          <div v-else>
            无
          </div>
        </template>
      </el-table-column>

      <el-table-column
        prop="rank"
        label="工作评级"
        width="180">
        <template slot-scope="{row}">    
          <el-rate
            v-model="row.rank"
            disabled
            text-color="#ff9900"
            score-template="{value}"
            :texts="[
              '次要工作','普通工作','优先工作','重要工作','紧急工作'
            ]">
          </el-rate>
        </template>
      </el-table-column>

      <el-table-column
        prop="end_time"
        label="截止时间" 
        align="center"
        width="170">
        <template slot-scope="{row}">
          {{ row.end_time | timeFormatter('{y}年{m}月{d}日') }}
        </template>
      </el-table-column>

      <el-table-column
        prop="need_check"
        label="需审核" 
        align="center">
        <template slot-scope="{row}">
          {{ row.need_check | reviewFilter }}
        </template>
      </el-table-column>

      <el-table-column
        prop="need_report"
        label="需工作报告"
        align="center"
        width="120">
        <template slot-scope="{row}">
          {{ row.need_report | reviewFilter }}
        </template>
      </el-table-column>

      <el-table-column
        prop="status"
        label="当前进度"
        align="center"
        width="180">
        <template slot-scope="{row}">
          <work-status :status="parseInt(row.status)" :appointedUser="parseInt(row.appointed_user)" :operable="true"/> 
        </template>
      </el-table-column>

      <el-table-column
        prop="create_time"
        label="发布人" 
        align="center">
        <template slot-scope="{row}">
          <router-link :to="'/user/view/'+row.create_user">          
            <img :src="row.create_user_avatar?row.create_user_avatar:(row.create_user_sex===1?avatar_female:avatar_male)"  width="30" height="30" />
            <div>{{row.create_user_name}}</div>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column
        prop="create_time"
        label="发布时间" 
        align="center">
        <template slot-scope="{row}">
          {{ row.create_time | formatTime }}
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="240" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <router-link :to="'/work/view/'+row.id">
            <el-button plain size="mini" >
              查看
            </el-button>
          </router-link>
          <router-link :to="'/work/update/'+row.id">
            <el-button type="primary" plain size="mini" style="margin-left:5px">
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
import {fetchList} from '@/api/project'
import {getWork} from '@/api/work'
import WorkStatus from './components/WorkStatus'
import { parseTime, formatTime } from '@/utils'
import waves from '@/directive/waves' // waves directive
import avatar_female from '@/assets/images/avatar_female.png'
import avatar_male from '@/assets/images/avatar_male.png'
import { STATUS_TAG_TEXT } from '@/utils/work-status'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'WorkList',
  components : {
    WorkStatus,
    Pagination
  },
  directives: { waves },
  filters: {
    reviewFilter(status) {
      const statusMap = {
        1 : '是',
        0 : '否'
      }
      return statusMap[status]
    },

    timeFormatter(time, cFormat) {
      if(time > 0){
        return formatTime(time, cFormat)
      }else{
        return '未设置';
      }
    }
  },
  data() {
    return {
      list:[],
      loading: true,
      query: {
        project: '',
        title : '',
        status : [],
        page: 1,
        limit: 30,
      },
      total : 0,
      status : STATUS_TAG_TEXT,
      projects : [],
      projectLoading : true,
      avatar_male : avatar_male,
      avatar_female : avatar_female
    }
  },
  created(){
    this.fetchProjects()
    this.getList()
  },
  methods: {
    fetchProjects(){
      fetchList({list : true}).then(response=>{
        this.projects = response.data
        this.projectLoading = false
      }).catch(error=>{

      })
    },
    getList(){
      this.loading = true
      getWork({user : this.$store.state.user.id, ...this.query}).then(response=>{
        this.list = response.data.list
        this.total = response.data.count
        this.loading = false
      }).catch(error=>{

      })
    },
    handleFilter(){

    }
  }
}
</script>


<template>
  <div class="app-container">

    <div class="filter-container">
      <el-row :gutter="4">
        <el-col :lg="4" :xs="24" :sm="8" :md="6">
          <el-select v-model="query.project" placeholder="请选择项目" style="width:100%" @change="handleFilter">
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
        prop="project"
        label="所属项目"
        width="240">
        <template slot-scope="{row}">
          <router-link :to="'/project/view/'+row.id" v-if="row.project">
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
        prop="title"
        label="工作主题"
        width="240">
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
        align="center">
        <template slot-scope="{row}">
          {{ row.end_time | timeFormatter }}
        </template>
      </el-table-column>

      <el-table-column
        prop="need_review"
        label="需要审核" 
        align="center">
        <template slot-scope="{row}">
          {{ row.need_review | reviewFilter }}
        </template>
      </el-table-column>

      <el-table-column
        prop="need_report"
        label="需要工作报告"
        align="center">
        <template slot-scope="{row}">
          {{ row.need_report | reviewFilter }}
        </template>
      </el-table-column>

      <el-table-column
        prop="status"
        label="当前进度"
        align="center">
        <template slot-scope="{row}">
          <workstatus :status="row.status" /> 
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

export default {
  name: 'WorkList',
  components : {
    workstatus : WorkStatus
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
        return parseTime(time, cFormat)
      }else{
        return '';
      }
    }
  },
  data() {
    return {
      list:[
        {
          id: 1,
          title : 'test',
          project: 0,
          project_name : null,
          parent : {

          },
          rank : 3,
          need_review : 0,
          need_report : 0,
          end_time : 0,
          create_user : 1,
          create_user_avatar : null,
          create_user_name : 'admin',
          create_user_sex : 1,
          create_time : 1574768525,
          status : 0,

        },
        {
          id: 2,
          title : '测试工作任务',
          project: 1,
          project_name : '测试项目',
          parent : {

          },
          rank : 2,
          need_review : 1,
          need_report : 0,
          end_time : 0,
          create_user : 1,
          create_user_avatar : null,
          create_user_name : 'admin',
          create_user_sex : 1,
          create_time : 1574768525,
          status : 20,

        }
      ],
      query: {
        project: '',
        title : '',
        status : [],
        page: 1,
        limit: 30,
      },
      count : 0,
      status : STATUS_TAG_TEXT,
      projects : [],
      projectLoading : true,
      avatar_male : avatar_male,
      avatar_female : avatar_female
    }
  },
  created(){
    this.fetchProjects()
    this.getWork()
  },
  methods: {
    fetchProjects(){
      fetchList({list : true}).then(response=>{
        this.projects = response.data
        this.projectLoading = false
      }).catch(error=>{

      })
    },
    getWork(){
      getWork({user : this.$store.state.user.id}).then(response=>{
        console.log(response)
      }).catch(error=>{

      })
    },
    handleFilter(){

    }
  }
}
</script>


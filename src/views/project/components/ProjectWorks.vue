<template>
  <div>
    <el-row :gutter="10" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" style="margin-top:10px;">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="task" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              待完成任务
            </div>
            <count-to :start-val="0" :end-val="102400" :duration="2600" class="card-panel-num" />
          </div>
        </div>
      </el-col>

      <el-col :xs="12" :sm="12" :lg="6" style="margin-top:10px;">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-message">
            <svg-icon icon-class="task_done" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              已完成任务
            </div>
            <count-to :start-val="0" :end-val="102400" :duration="2600" class="card-panel-num" />
          </div>
        </div>
      </el-col>


      <el-col :xs="12" :sm="12" :lg="6" style="margin-top:10px;">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="task_close" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              已关闭任务
            </div>
            <count-to :start-val="0" :end-val="102400" :duration="2600" class="card-panel-num" />
          </div>
        </div>
      </el-col>

      <el-col :xs="12" :sm="12" :lg="6" style="margin-top:10px;">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-shopping">
            <svg-icon icon-class="task_total" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              总任务数量
            </div>
            <count-to :start-val="0" :end-val="102400" :duration="2600" class="card-panel-num" />
          </div>
        </div>
      </el-col>

      
    </el-row>
    <div class="filter-container" style="margin-top:40px">
      <el-row :gutter="4">
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

    <el-table>
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
        width="180">
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
        label="工作报告"
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
        label="负责人" 
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

      <el-table-column label="操作" align="center" width="100" class-name="small-padding fixed-width">
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

import { getWork } from '@/api/work'
import { getWorkStatistics } from '@/api/project'
import CountTo from 'vue-count-to'


export default {
  components:{
    CountTo
  },
  porps:{
    id: {
      type: Number,
    }
  },
  data() {
    return {
      tableData : [],
      query: {
        title : null,
        status : [],
        page: 1,
        limit: 30,
      },
    }
  },
  created(){
    this.getData(id);
  },
  methods:{
    getData(id){
      getWork({project: id, ...this.query}).then(response=>{
        console.log(response);
        this.tableData = response.data.list;
      }).catch(error=>{

      })
    },
    getWorkStatistics(id){
      getWorkStatistics(id).then(response=>{

      }).catch(error=>{

      })
    }
  }
}
</script>

<style lang="scss" scoped>

.panel-group {
  margin-bottom: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>

<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :sm="24" :md="8" :xl="6" >
        <project-card :id="id" />
      </el-col>
      <el-col :sm="24" :md="16" :xl="18">
        <el-card>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="工作事项" name="events">
              <project-works :id='id'/>
            </el-tab-pane>
            <el-tab-pane label="项目成员" name="timeline">
              <project-users  :id='id'/>
            </el-tab-pane>
            <el-tab-pane label="统计分析" name="account">
            </el-tab-pane>
          </el-tabs>
        </el-card>
        
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { fetchList as fetchUser } from '@/api/user'
import { parseTime } from '@/utils'
import { getToken } from '@/utils/auth'

import ProjectCard from './components/ProjectCard'
import ProjectWorks from './components/ProjectWorks'
import ProjectUsers from './components/ProjectUsers'

import waves from '@/directive/waves' // waves directive
// import PageHeader from '@/components/PageHeader'
// import Avatar from '@/components/Avatar'

export default {
  name: 'ProjectView',
  components: { 
    ProjectCard,
    ProjectUsers,
    ProjectWorks
  },
  directives: { waves },
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
  },
  data() {
    return {
      id : null,
      activeTab : 'events',
      project :{
        // name : '测试项目',
        // image: '',
        // description : '映射出特定期间已创建和已解决问题的对比情况，这可以帮助你了解整体待办事项处于增长状态还是减少状态。',
        // in_charge_user_name : 'admin',
        // in_charge_user: 1,
        // in_charge_user_avatar : '',
        // in_charge_user_sex : 1,

        // create_user:1,
        // create_user_name:'admin',
        // create_user_avatar: '',
        // create_user_sex : 1,
        // create_time : 1573672273,

        // stats : 1,
        // end_time : 0,
        // finish_time : 0,

      },
      users:[
        
      ]
    }
  },
  created(){
    this.id = this.$route.params && this.$route.params.id
  },
  methods:{
    goBack(){

    }
  }
}
</script>
<style scoped>
.project_info{
  width:100%;
}

.project_info>.project_image> img{
  width:200px;
}
.project_image{
  width:100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom:40px;
}
.project_imageholder{
  width:200px;
  height:200px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size:96px;
  font-weight:600;
  background-color:#a3d3ff;
  border-radius: 5px;
  color:#FFF;
}


.users_list{
  display: flex;
  /*justify-content: space-around;*/
}

.users_list>.user_item{
  display: flex;
  width:80px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding:10px;
}

.users_list>.user_item>.user_name{
  text-align: center;
  margin: 10px 0;
  color:#656565;
  font-size:13px;
}
</style>
<style lang="scss" scoped>
.project-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}

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

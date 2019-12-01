<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :sm="24" :md="8" :xl="6" >

        <project-card :id="id" />
        <el-card>
          <div slot="header" class="clearfix">
            <span>项目信息</span>
          </div>
          <div class="project_info">
            <div class="project_image">
              <img v-if="project.image" :src="project.image | imgFilter"  />
              <div v-else class="project_imageholder">{{project.name.substr(0, 1)}}</div>
            </div>

            <div class="info_item">
              <div>项目名称：</div>
              <div>{{project.name}}</div>
            </div>

            <div class="info_item">
              <div style="line-height: 30px">负责人：</div>
              <div class="avatar">
                <Avatar :avatar="project.in_charge_user_avatar" :sex="project.in_charge_user_sex" :size="30" />
                <span style="margin-left:6px">{{project.in_charge_user_name}}</span>
              </div>
            </div>

            <div class="info_item" style="flex-wrap: wrap;">
              <div>项目简介：</div>
              <div style="text-align: justify;width:100%;padding-top:5px">{{project.description}}</div>
            </div>

            <div class="info_item">
              <div>截止时间：</div>
              <div>{{project.end_time | timeFilter('{y}年{m}月{d}日') }}</div>
            </div>

            <hr style="background-color:#E3E3E3;height: 1px;border: none;margin: 10px 0" />

            <div class="info_item">
              <div style="line-height: 30px">创建人：</div>
              <div class="avatar">
                <Avatar :avatar="project.create_user_avatar" :sex="project.create_user_sex" :size="30" />
                <span style="margin-left:6px">{{project.create_user_name}}</span>
              </div>
            </div>
            <div class="info_item">
              <div >创建时间：</div>
              <div>
                {{ project.create_time | parseTime('{y}年{m}月{d}日') }}
              </div>
            </div>

          </div>
        </el-card>
      </el-col>
      <el-col :sm="24" :md="16" :xl="18">
        <el-card>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="工作事项" name="events">
              <el-row :gutter="10" class="panel-group">
              <el-col :xs="12" :sm="12" :lg="6" style="margin-top:10px;">
                <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
                  <div class="card-panel-icon-wrapper icon-people">
                    <svg-icon icon-class="peoples" class-name="card-panel-icon" />
                  </div>
                  <div class="card-panel-description">
                    <div class="card-panel-text">
                      待完成数量
                    </div>
                    <count-to :start-val="0" :end-val="102400" :duration="2600" class="card-panel-num" />
                  </div>
                </div>
              </el-col>

              <el-col :xs="12" :sm="12" :lg="6" style="margin-top:10px;">
                <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
                  <div class="card-panel-icon-wrapper icon-people">
                    <svg-icon icon-class="peoples" class-name="card-panel-icon" />
                  </div>
                  <div class="card-panel-description">
                    <div class="card-panel-text">
                      已完成数量
                    </div>
                    <count-to :start-val="0" :end-val="102400" :duration="2600" class="card-panel-num" />
                  </div>
                </div>
              </el-col>


              <el-col :xs="12" :sm="12" :lg="6" style="margin-top:10px;">
                <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
                  <div class="card-panel-icon-wrapper icon-people">
                    <svg-icon icon-class="peoples" class-name="card-panel-icon" />
                  </div>
                  <div class="card-panel-description">
                    <div class="card-panel-text">
                      总任务数量
                    </div>
                    <count-to :start-val="0" :end-val="102400" :duration="2600" class="card-panel-num" />
                  </div>
                </div>
              </el-col>

              <el-col :xs="12" :sm="12" :lg="6" style="margin-top:10px;">
                <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
                  <div class="card-panel-icon-wrapper icon-people">
                    <svg-icon icon-class="peoples" class-name="card-panel-icon" />
                  </div>
                  <div class="card-panel-description">
                    <div class="card-panel-text">
                      参与人员
                    </div>
                    <count-to :start-val="0" :end-val="102400" :duration="2600" class="card-panel-num" />
                  </div>
                </div>
              </el-col>

            </el-row>
            </el-tab-pane>
            <el-tab-pane label="项目成员" name="timeline">
              <span>团队成员</span>
              <div class="users_list">
                <div class="user_item" v-for="user in users" :key="user.id+''">
                  <el-badge value="管" v-if="user.is_admin">
                    <Avatar :avatar="user.avatar" :sex="user.sex" :size="60" />
                  </el-badge>
                  <Avatar v-else :avatar="user.avatar" :sex="user.sex" :size="60" />
                  <div class="user_name">{{user.name}}</div>
                </div>
              </div>
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

import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Drawer from '@/components/Drawer'
import PageHeader from '@/components/PageHeader'
import Avatar from '@/components/Avatar'
import CountTo from 'vue-count-to'

export default {
  name: 'ProjectView',
  components: { 
    Pagination,
    Drawer,
    PageHeader,
    Avatar,
    CountTo,
    ProjectCard
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
        name : '测试项目',
        image: '',
        description : '映射出特定期间已创建和已解决问题的对比情况，这可以帮助你了解整体待办事项处于增长状态还是减少状态。',
        in_charge_user_name : 'admin',
        in_charge_user: 1,
        in_charge_user_avatar : '',
        in_charge_user_sex : 1,

        create_user:1,
        create_user_name:'admin',
        create_user_avatar: '',
        create_user_sex : 1,
        create_time : 1573672273,

        stats : 1,
        end_time : 0,
        finish_time : 0,

      },
      users:[
        {
          id: 1,
          name : 'admin',
          avatar : '',
          sex : 1,
        },
        {
          id: 2,
          name : 'admin',
          avatar : '',
          sex : 1,
          is_admin : true,
        },
        {
          id: 1,
          name : 'admin',
          avatar : '',
          sex : 1,
        },
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
.info_item{
  display: flex;
  font-size:14px;
  color:#555;
  margin-top:10px;
}
.info_item>div{
  line-height:21px;
}
.info_item>div:first-child{
  width:70px;
  flex-grow:0;
  flex-shrink:0;
}
.info_item>div:last-child{
  flex-grow:1;
  text-align: right;
  color:#888;
}
.avatar{
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 30px;
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

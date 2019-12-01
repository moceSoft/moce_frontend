<template>
  <el-card style="margin-bottom:20px;" v-loading="loading">
    <div slot="header" class="clearfix">
      <span>项目信息</span>
    </div>

    <div class="user-profile ">
      <div class="box-center">
          <img v-if="project.image" :src="project.image | imgFilter" class="project_image" />
          <div v-else class="project_imageholder">{{project.name.substr(0, 1)}}</div>
      </div>
      <div class="box-center">
        <div class="user-name text-center">{{ project.name }}</div>
        <div class="user-role text-center text-muted">
          <Avatar :avatar="project.in_charge_user_avatar" :sex="project.in_charge_user_sex" :size="30" />
          <span style="margin-left:6px">{{project.in_charge_user_name}}</span>
        </div>
      </div>
    </div>

    <div class="user-bio">
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header"><svg-icon icon-class="education" /><span>项目简介</span></div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            {{project.description}}
          </div>
        </div>
      </div>

      <div class="user-skills user-bio-section">
        <div class="user-bio-section-header"><svg-icon icon-class="skill" /><span>概况</span></div>
        <div class="user-bio-section-body">
          <div class="progress-item">
            <span>Vue</span>
            <el-progress :percentage="70" />
          </div>
          <div class="progress-item">
            <span>JavaScript</span>
            <el-progress :percentage="18" />
          </div>
          <div class="progress-item">
            <span>Css</span>
            <el-progress :percentage="12" />
          </div>
          <div class="progress-item">
            <span>ESLint</span>
            <el-progress :percentage="100" status="success" />
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import { getInfo } from '@/api/project'
import Avatar from '@/components/Avatar'
import { parseTime } from '@/utils'

export default {
  props: {
    id: {
      type: Number,
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
  },
  data(){
    return {
      loading : true,
      project:{
        id : '',
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
    }
  },
  created(){
    this.getInfo(this.id)
  },
  methods :{
    getInfo(id){
      getInfo(id).then(response => {
        this.project = response.data
        this.project.img_preview = process.env.VUE_APP_IMAGE_BASE_URL + response.data.image
        this.project.end_time = response.data.end_time * 1000
        this.loading = false
      }).catch(error=>{
        console.error(error)
      })
    },
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
  border-radius: 5px;
  color:#FFF;
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

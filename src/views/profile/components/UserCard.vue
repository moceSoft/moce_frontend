<template>
  <el-card style="margin-bottom:20px;">
    <div slot="header" class="clearfix">
      <span>基础信息</span>
    </div>

    <div class="user-profile">
      <div class="box-center">
        <avatar :avatar="user.avatar" :size="100" />
        
      </div>
      <div class="box-center">
        <div class="user-name text-center">{{ user.name }}</div>
        <div class="user-role text-center text-muted">{{ user.role | uppercaseFirst }}</div>
        <div class="user-role text-center text-muted" style="padding-top: 5px">测试部门</div>
      </div>
    </div>

    <div class="user-bio">
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header"><svg-icon icon-class="tab" /><span>参与项目</span></div>
        <div class="user-bio-section-body">
          <div class="projects">
              <div v-for="project in projects" :key="project.id">
                <router-link :to="'/project/view/'+project.id">
                  <el-link>
                    <img v-if="project.image" :src="project.image | imgFilter"  width="60" height="60" />
                    <div v-else class="project_imageholder">{{project.name.substr(0, 1)}}</div>
                    <div class="project_name">{{project.name}}</div>
                  </el-link>
                </router-link>
              </div>
          </div>
        </div>
      </div>

      <div class="user-skills user-bio-section">
        <div class="user-bio-section-header"><svg-icon icon-class="skill" /><span>Skills</span></div>
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
import PanThumb from '@/components/PanThumb'
import Avatar from '@/components/Avatar'

export default {
  components: { PanThumb, Avatar },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: '',
          avatar: '',
          roles: '',
          sex: 1,
        }
      }
    },
    projects : {
      type : Array,
      default : () => {
        return [

        ]
      }
    }
  },
  filters:{
    imgFilter(img){
      return process.env.VUE_IMAGE_BASE_API + '/' + img
    },
  }
}
</script>
<style scoped>
.projects{
  display: flex;
  flex-direction: row;
}
.projects>div{
  padding:10px;
}
.project_imageholder{
  width:60px;
  height:60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size:32px;
  font-weight:600;
  background-color:#a3d3ff;
  border-radius: 5px;
  color:#FFF;
}
.project_name{
  margin:5px 0;
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

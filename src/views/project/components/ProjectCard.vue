<template>
  <el-card style="margin-bottom:20px;" v-loading="loading">
    <div slot="header" class="clearfix">
      <span>项目信息</span>
    </div>

    <div class="user-profile">
      <div class="box-center">
          <img v-if="project.image" :src="project.image | imgFilter" class="project_image" />
          <div v-else class="project_imageholder">{{project.name.substr(0, 1)}}</div>
      </div>
      <div class="box-center" style="margin-top:10px">
        
        <div class="user-name text-center">
          {{ project.name }}<el-tag size="small"  :type="project.status | statusFilter" style="margin-left:5px">{{project.status | statusText}}</el-tag>
        </div>
        <div class="user-role text-center text-muted">
          {{project.end_time?'预期截止 ' + parseTime(project.end_time, '{y}年{m}月{d}日' ):'未设置预期时间'}}
        </div>
      </div>
      <div class="box-center" style="margin-top:18px" v-if="project.is_in_charge">
        <router-link :to="'/project/update/'+id" >
          <el-button type="primary" >
            <i class="el-icon-edit"></i>
            <div style="margin-top:8px;">
              编辑
            </div>
          </el-button>
        </router-link>
        <el-button type="primary" plain style="margin-left:40px" @click="fileProject">
          <svg-icon :icon-class="project.status?'lock':'unlock'" />
          <div style="margin-top:8px;">
            {{project.status?'归档':'打开'}}
          </div>
        </el-button>
      </div>
    </div>

    <div class="user-bio">
      <div class="user-bio-section">
        <div class="user-bio-section-header"><svg-icon icon-class="education" /><span>项目简介</span></div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            {{project.description?project.description:'暂未添加简介'}}
          </div>
        </div>
      </div>

      <div class="user-bio-section">
        <div class="user-bio-section-header"><svg-icon icon-class="skill" /><span>其他信息</span></div>
        <div class="user-bio-section-body">

          <div class="info_item">
            <div style="line-height: 30px">负责人：</div>
            <div class="avatar">
              <avatar :avatar="project.in_charge_user.avatar" :sex="parseInt(project.in_charge_user.sex)" :size="30" />
              <span style="margin-left:6px">{{project.in_charge_user.name}}</span>
            </div>
          </div>

          <div class="info_item">
            <div style="line-height: 30px">创建人：</div>
            <div class="avatar">
              <avatar :avatar="project.create_user.avatar" :sex="project.create_user.sex" :size="30" />
              <span style="margin-left:6px">{{project.create_user.name}}</span>
            </div>
          </div>

          <div class="info_item">
            <div style="line-height: 30px">创建时间：</div>
            <div class="avatar">
                {{ project.create_time | parseTime('{y}年{m}月{d}日') }}
            </div>
          </div>

        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import { fileProject } from '@/api/project'
import Avatar from '@/components/Avatar'
import { parseTime } from '@/utils'

export default {
  components:{
    Avatar
  },
  props: {
    id: {
      type: Number,
    },
    project : {
      type : Object
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
    statusFilter(status) {
      const statusMap = {
        1 : 'success',
        0 : 'warning'
      }
      return statusMap[status]
    },
    statusText(status) {
      const statusTextMap = {
        1 : '进行中',
        0 : '已归档'
      }
      return statusTextMap[status]
    },
  },
  data(){
    return {
      loading : false,
    }
  },
  created(){
  },
  methods :{
    parseTime(time, format){
      return parseTime(time, format);
    },
    fileProject(){
      let msg = this.project.status?'归档后，将无法为该项目指派新的工作任务？':'确定要重新打开该项目？'
      this.$confirm(msg).then(_ => {
        this.loading = true
        fileProject(this.id).then( response => {
          this.loading = false
          this.$emit('file')
          this.$message({
            message: '项目状态更改成功',
            type: 'success'
          })
        }).catch( error => {
          this.loading = false
        })
      }).catch(_ => {

      })
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
.avatar{
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 30px;
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

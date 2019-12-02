<template>
  <div class="app-container">

        <el-form ref="form" :model="project" :rules="projectRules" label-width="80px" label-position="right" v-loading="submitLoading">
          <el-row  justify="center">
            <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>新增项目</span>
            </div>

              <el-col :xs="24" :sm="24" :md="12" :lg="8" >   
              <el-form-item label="项目图片">
                <el-upload
                  class="project-image-uploader"
                  :action="uploadConfig.imageUploadAction"
                  :show-file-list="false"
                  :headers="uploadConfig.headers"
                  :on-success="handleProjectImageSuccess"
                  :before-upload="beforeProjectImageUpload">
                    <img v-if="project.img_preview" :src="project.img_preview" class="project-image">
                    <div v-else>
                      <i class="el-icon-plus project-image-uploader-icon"></i>
                      <label class="project-image-uploader-label" style="display:block;">项目图片</label>
                    </div>
                </el-upload>
                </el-form-item>
              <el-form-item label="项目名称" prop="name">
                <el-input v-model="project.name" placeholder="请输入项目名称"></el-input>
              </el-form-item>
              <el-form-item label="项目简介">
                <el-input v-model="project.description" type="textarea" :rows="2" placeholder="请输入项目简介"></el-input>
              </el-form-item>

              <el-form-item label="公开项目">
                <el-switch
                  v-model="project.is_parivate"
                  active-color="#13ce66"
                  inactive-color="#E7E7E7"
                  :active-value="false"
                  :inactive-value="true">
                </el-switch>
              </el-form-item>

              <el-form-item label="负责人"  prop="in_charge_user">
                <el-select v-model="project.in_charge_user" filterable placeholder="请选择负责人"
                    v-loading="selectUserLoading">
                  <el-option
                    v-for="item in users"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
                <!-- <el-button type="text">赋予我</el-button> -->
              </el-form-item>
              <el-form-item label="截止日期">
                <el-date-picker
                  v-model="project.end_time"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy 年 MM 月 dd 日" 
                  value-format="timestamp"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col sppan="24">
              <hr style="margin:20px 0;
                border:none;
                border-top:1px solid #e6ebf5;" 
              />
              <el-form-item>
                <el-button type="primary" @click="saveProject">保存</el-button>

                <router-link to="/project" style="margin-left:10px">
                <el-button>取消</el-button>
                </router-link>
              </el-form-item>
            </el-col>

          </el-col>
        </el-card>
      </el-row>
    </el-form>
        <!-- <el-button type="danger" @click="deleteItem" icon="el-icon-delete">删除</el-button> -->
      
  </div>
</template>

<script>
import { fetchList, createProject } from '@/api/project'
import { fetchList as fetchUser } from '@/api/user'
import { parseTime } from '@/utils'
import { getToken } from '@/utils/auth'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Drawer from '@/components/Drawer'

export default {
  name: 'ProjectCreate',
  components: { 
    Pagination,
    Drawer 
  },
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
        1 : '进行中',
        0 : '已归档'
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
    imgFilter(img){
      return process.env.VUE_IMAGE_BASE_API + '/' + img
    },
    timeFormatter(time, cFormat) {
      if(time > 0){
        return parseTime(time, cFormat)
      }else{
        return '未设置预期时间';
      }
    }
  },
  data() {
    return {
      loading : true,
      submitLoading: false, 
      uploadConfig:{
        imageUploadAction: process.env.VUE_APP_BASE_API + 'v1/project/upload',
        headers : {}
      },

      users : [],
      selectUserLoading : false,
      project:{
        name : '',
        image : '',
        img_preview : '',
        description : '',
        in_charge_user : '',
        is_parivate: false,
        end_time : '',
      },
      projectRules : {
        name :[
          {required: true, message: '请输入项目名称', trigger: 'blur' }
        ],
        in_charge_user : [
          {required: true, message: '请选择项目负责人', trigger: 'blur' }
        ],
      }
    }
  },
  created(){
    // this.getList();
    this.fetchUser();
  },
  methods:{
    getList(){
      fetchList(this.query).then(response => {
        this.tableData = response.data.list;
        this.total = parseInt(response.data.count);
        this.loading = false;
      })
    },
    saveProject(){
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          createProject(this.project).then(response=>{
            this.submitLoading = false;
            this.$confirm('新增项目成功', '提示', {
              confirmButtonText: '查看项目',
              cancelButtonText: '返回列表',
              type: 'success'
            }).then(() => {
              this.$router.replace('/project/view/'+response.data.id)
            }).catch(() => {
              this.$router.replace('/project')
            });
          }).catch(error=>{
            this.submitLoading = false;
          });
        } else {
          return false;
        }
      });
    },
    close(){
      this.showDrawer = false;
    },
    beforeProjectImageUpload(file){
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
      }

      this.uploadConfig.headers.Authorization = 'Bearer ' + getToken()
      return isJPG && isLt2M;
    },
    handleProjectImageSuccess(res, file) {
      this.project.image =  process.env.VUE_IMAGE_BASE_API+ '/' +res.data;
      this.project.img_preview = URL.createObjectURL(file.raw);
    },
    fetchUser(){
      this.selectUserLoading = true;
      fetchUser({list : true}).then(response => {
        this.users = response.data;
        this.selectUserLoading = false;
      })
    }
  }
}
</script>
<style>
.filter-container>.filter_item{
  margin-right:10px;
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
 .project-image-uploader{
  text-align: left;
  }
  .project-image-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .project-image-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .project-image-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 60px;
    line-height: 70px;
    text-align: center;
  }
  .project-image {
    width: 100px;
    height: 100px;
    display: block;
  }
  .project-image-uploader-label{
    height:40px;
    line-height:30px;
    font-weight:400;
    color:#8c939d;
    display:block;
    font-size:12px;
    cursor: pointer;
  }
</style>

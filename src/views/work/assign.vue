<template>
  <div class="app-container">

    <el-form ref="workForm" :rules="rules" :model="form" label-width="120px">
      <el-row  justify="center">
        <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>指派工作</span>
        </div>
        <div style="margin-bottom:20px" v-loading="loading">
          <el-col :xs=24 :sm=24 :lg=12>
            <el-form-item label="工作任务标题" prop="title">
              <el-input v-model="form.title"></el-input>
            </el-form-item>
            <el-form-item label="工作任务描述"  prop="description">
              <tinymce v-model="form.description" :uploadUrl="uploadUrl" :headers="headers" :height="300" />
            </el-form-item>

            <el-form-item label="优先级"  prop="rank">
              <el-rate
                v-model="form.rank"
                show-text
                style="margin-top:10px"
                :texts="[
                  '次要工作','普通工作','优先工作','重要工作','紧急工作'
                ]">
              </el-rate>
            </el-form-item>

            <el-form-item label="所属项目"  prop="project">
              <el-select v-model="form.project" filterable clearable placeholder="该工作属于哪一个项目" @change="projectChange" v-loading="projectLoading">
                <el-option
                  v-for="item in projects"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="工作负责人"  prop="project">
              <el-select v-model="form.appointed_user" filterable placeholder="请选择负责人" v-loading="userLoading">
                <el-option
                  v-for="item in users"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="工作开始时间" prop="create_time">
              <el-date-picker
                v-model="form.create_time"
                align="right"
                type="date"
                placeholder="选择日期"
                >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="工作截至时间" prop="end_time">
              <el-date-picker
                v-model="form.end_time"
                align="right"
                type="date"
                placeholder="选择日期"
                >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="完成时审核" prop="need_check">
              <el-switch
                v-model="form.need_check"
                active-color="#13ce66"
                inactive-color="#D7D7D7"
                active-value="1"
                inactive-value="0"
                >
              </el-switch>
            </el-form-item>
            <div v-show="form.need_check==1" prop="check_department">
              <el-form-item label="审核部门">
                <el-select v-model="form.check_department" filterable placeholder="请选择审核部门" @change="checkDepartmentChange" v-loading="departmentLoading">
                  <el-option
                    v-for="item in departments"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="指派审核人员" prop="check_user">
                <el-select v-model="form.check_user" filterable :placeholder="form.check_department==''?'请先选择审核部门':'选择审核人员'" :disabled="form.check_department==''" v-loading="checkUserLoading">
                  <el-option
                    v-for="item in checkUsers"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
                <el-button plain size="mini" style="margin-left:10px;">
                  指派给我
                </el-button>
              </el-form-item>
            </div>

            <el-form-item label="完成时提交报告">
              <el-switch
                v-model="form.need_report"
                active-color="#13ce66"
                inactive-color="#D7D7D7"
                active-value="1"
                inactive-value="0">
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span=24>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">保存</el-button>
              <el-button>取消</el-button>
            </el-form-item>
          </el-col>
        </div>
        </el-card>
      
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { fetchList } from '@/api/user'
import { getList } from '@/api/org'
import { getPositions } from '@/api/position'
import { fetchList as fetchProject } from '@/api/project'
import { createWork } from '@/api/work'
import Tinymce from '@/components/Tinymce'
import { getToken } from '@/utils/auth'

export default {
  name: 'UserForm',
  components:{
    Tinymce
  },
  data() {
    var validateCheckDepartment = (rule, value, callback) => {
      if(this.form.need_check == 1){
        if (value === '') {
          callback(new Error('请选择审核部门'));
        }
      }
      callback();
    }

    var validateCheckUser = (rule, value, callback) => {
      if(this.form.need_check == 1){
        if (value === '') {
          callback(new Error('请选择审核人员'));
        }
      }
      callback();
    }
    return {
      form : {
        title : '',
        rank : 2,
        description : '',
        project : '',
        department : '',
        user : '',
        create_time: '',
        end_time: '',
        need_check : 0,
        check_department : '',
        check_user : '',
        need_report : false
      },
      loading : false,
      activeName : 'department',
      userLoading : false,
      checkUserLoading: false,
      projectLoading : true,
      departmentLoading : true,
      users: [],
      checkUsers: [],
      departments : [],
      projects : [],
      positions : [],
      positionLoading : false,
      rules:{
        title : [{ required: true, message: '请输入工作名称', trigger: 'blur' },{ min: 3, message: '长度至少需要3个字符', trigger: 'blur' }],
        check_department : [{ validator: validateCheckDepartment, trigger: 'blur' }],
        check_user : [{ validator: validateCheckUser, trigger: 'blur' }],
      },
      uploadUrl : process.env.VUE_APP_BASE_API + 'v1/user/upload',
      headers : {}
    }
  },
  created(){
    this.fetchProject()
    // this.fetchDepartment()
    this.fetchUser()
  },
  mounted(){
    this.headers.Authorization = 'Bearer ' + getToken()
  },
  methods:{
    fetchProject() {
      fetchProject({list : true}).then(response => {
        this.projects = (response.data)
        this.projectLoading = false
      }).catch(error=>{
        this.projectLoading = false
      })
    },
    fetchDepartment(){
      getList().then(response=>{
        this.departments = response.data;
        this.departmentLoading = false
      }).catch(error=>{
        this.departmentLoading = false
      })
    },
    fetchPosition(){
      getPositions({}).then(response=>{
        this.positions = response.data
        this.positionLoading = false
      }).catch(error=>{
        this.positionLoading = false
      })
    },
    fetchUser(){
      fetchList({list : true, project : this.form.project}).then(response=>{
        this.users = response.data
        this.userLoading = false
      }).catch(error=>{
        this.userLoading = false
      })
    },
    handleClick(){

    },
    projectChange(item){
      this.users = []
      this.fetchUser()
    },
    checkDepartmentChange(item){
      fetchList({list : true, department : item, project : this.form.project}).then(response=>{
        this.checkUsers = response.data
        this.checkUserLoading = false
      }).catch(error=>{
        this.checkUserLoading = false
      })
    },
    onSubmit(){
      // console.log('submit');
      this.loading = true
      this.$refs['workForm'].validate(valid=>{
        if(valid){
          createWork(this.form).then(response=>{
            this.loading = false
            this.$mssage({
              message: '工作任务发布成功',
              type: 'success'
            })
            this.$router.replace('/work/view/'+response.data.id)
          }).catch(error=>{
            this.loading = false
          })
        }
      }).catch(error=>{

      })
    }
  }
}
</script>
<style>
  hr{
    margin:20px 0;
    border:none;
    border-top:1px solid #e6ebf5;
  }
  .avatar-uploader{
    text-align: center;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .el-form-item__label{
    font-weight: 300;
  }
</style>

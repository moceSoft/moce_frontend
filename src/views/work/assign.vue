<template>
  <div class="app-container">

    <el-form ref="form" :rules="ruleForm" :model="form" label-width="120px">
      <el-row  justify="center">
        <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>指派工作</span>
        </div>
        <div style="margin-bottom:20px">
          <el-col :xs=24 :sm=24 :lg=12>
            <el-form-item label="工作任务标题" props="title">
              <el-input v-model="form.title"></el-input>
            </el-form-item>
            <el-form-item label="工作任务描述"  props="description">
              <tinymce v-model="form.description" :height="300" />
            </el-form-item>

            <el-form-item label="所属项目"  props="project">
              <el-select v-model="form.project" filterable clearable placeholder="该工作属于哪一个项目" @change="projectChange" v-loading="projectLoading">
                <el-option
                  v-for="item in projects"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="指派部门"  props="project">
              <el-select v-model="form.department" filterable placeholder="哪个部门处理该工作" @change="departmentChange"  v-loading="departmentLoading">
                <el-option
                  v-for="item in departments"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="指派负责人"  props="project">
              <el-select v-model="form.user" filterable :placeholder="form.department == ''?'请先指派部门':'请选择负责人'" :disabled="form.department==''" v-loading="userLoading">
                <el-option
                  v-for="item in users"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="工作开始时间" props="create_time">
              <el-date-picker
                v-model="form.create_time"
                align="right"
                type="date"
                placeholder="选择日期"
                >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="工作截至时间" props="end_time">
              <el-date-picker
                v-model="form.end_time"
                align="right"
                type="date"
                placeholder="选择日期"
                >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="完成时审核" props="need_check">
              <el-switch
                v-model="form.need_check"
                active-color="#13ce66"
                inactive-color="#D7D7D7">
              </el-switch>
            </el-form-item>
            <div v-show="form.need_check" props="check_department">
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

              <el-form-item label="指派审核人员" props="check_user">
                <el-select v-model="form.check_user" filterable :placeholder="form.check_department==''?'请先选择审核部门':'选择审核人员'" :disabled="form.check_department==''" v-loading="checkUserLoading">
                  <el-option
                    v-for="item in checkUsers"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>

                  <el-tooltip class="item" effect="dark" content="不选择审核人，将发放审核通知至部门全体人员">
                    <el-button type="primary" circle fab plain size="mini" style="margin-left:10px">
                      <svg-icon icon-class="unknown" />
                    </el-button>
                  </el-tooltip>
              </el-form-item>
            </div>

            <el-form-item label="完成时提交报告">
              <el-switch
                v-model="form.need_report"
                active-color="#13ce66"
                inactive-color="#D7D7D7">
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col span="24">
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
import { fetchList as fetchProject } from '@/api/project'
import Tinymce from '@/components/Tinymce'

export default {
  name: 'UserForm',
  components:{
    Tinymce
  },
  data() {
    return {
      form : {
        name : '',
        description : '',
        finish_time: '',
        project : '',
        department : '',
        user : '',
        create_time: '',
        end_time: '',
        need_check : false,
        check_department : '',
        check_user : '',
        need_report : false
      },
      userLoading : false,
      checkUserLoading: false,
      projectLoading : true,
      departmentLoading : true,
      users: [],
      checkUsers: [],
      departments : [],
      projects : [],
      ruleForm:{

      }
    }
  },
  created(){
    this.fetchProject()
    this.fetchDepartment()
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
    fetchDepartment(department){
      getList().then(response=>{
        this.departments = response.data;
        this.departmentLoading = false
      }).catch(error=>{
        this.departmentLoading = false
      })
    },
    order(column, event){

    },
    view(user){

    },
    handleFilter(){

    },
    projectChange(item){

    },
    departmentChange(item){
      fetchList({list : true, department : item, project : this.form.project}).then(response=>{
        this.users = response.data
        this.userLoading = false
      }).catch(error=>{
        this.userLoading = false
      })
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

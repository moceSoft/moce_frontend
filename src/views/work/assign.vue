<template>
  <div class="app-container">

    <el-form ref="form" :rules="rules" :model="form" label-width="140px">
      <el-row  justify="center">
        <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>指派工作</span>
        </div>
        <div style="margin-bottom:20px">
         
          <el-col :xs="24" :sm="24" :md="{span: 18, offset:6}" :lg="{span: 12, offset:6}" :xl="{span: 8, offset:6}">
            <el-form-item label="工作任务标题">
              <el-input v-model="form.title"></el-input>
            </el-form-item>
            <el-form-item label="工作描述">
              <el-input type="textarea"
              :rows="3" 
              v-model="form.description"></el-input>
            </el-form-item>

            <el-form-item label="所属项目">
              <el-select v-model="project" filterable clearable placeholder="该工作属于哪一个项目" @change="departmentChange">
                <el-option
                  v-for="item in projects"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="所属部门">
              <el-select v-model="department" filterable placeholder="哪个部门处理该工作" @change="departmentChange">
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="指派负责人">
              <el-select v-model="user" filterable :placeholder="userPlaceHolder">
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="工作开始时间">
              <el-date-picker
                v-model="form.create_time"
                align="right"
                type="date"
                placeholder="选择日期"
                >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="工作截至时间">
              <el-date-picker
                v-model="form.end_time"
                align="right"
                type="date"
                placeholder="选择日期"
                >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="完成时需要审核">
              <el-switch
                v-model="form.need_check"
                active-color="#13ce66"
                inactive-color="#D7D7D7">
              </el-switch>
            </el-form-item>
            <div v-show="form.need_check">
              <el-form-item label="所属部门">
                <el-select v-model="department" filterable placeholder="请选择审核部门" @change="checkDepartmentChange">
                  <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="指派审核人">
                <el-select v-model="user" filterable :placeholder="userPlaceHolder">
                  <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>

                  <el-tooltip class="item" effect="dark" content="不选择审核人，将发放审核通知至部门全体人员">
                    <el-button type="info" circle fab plain size="mini" style="margin-left:10px">
                      <svg-icon icon-class="unknown" />
                    </el-button>
                  </el-tooltip>
              </el-form-item>
            </div>

            <el-form-item label="完成时需提交报告">
              <el-switch
                v-model="form.need_report"
                active-color="#13ce66"
                inactive-color="#D7D7D7">
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col span="18" offset="6">
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
import { createUser } from '@/api/user'
import { getList } from '@/api/org'
import { fetchList as fetchProject } from '@/api/project'

export default {
  name: 'UserForm',
  components:{

  },
  data() {
    return {
      imageUrl: '',
      form : {
        name : '',
        description : '',
        finish_time: '',
        department : 0,
        user : 0,
        create_time: 0,
        end_time: 0,
        need_check : false,
        need_report : false
      },
      department: '',
      project : '',
      userPlaceHolder : '请先选择部门',
      user: '',
      options : [],
      projects : [],
      ruleForm:{

      }
    }
  },
  created(){
    this.fetchProject();
  },
  methods:{
    fetchProject() {
      fetchProject({list : true}).then(response => {
        this.projects = (response.data);
      })
    },
    fetchPosition(department){
      getPositions({'id':department}).then(response=>{
        this.positions = response.data;
      })
    },
    order(column, event){

    },
    view(user){

    },
    handleFilter(){

    },
    departmentChange(item){
      this.form.department = item;
    },
    beforeAvatarUpload(){

    },
    handleAvatarSuccess(){

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

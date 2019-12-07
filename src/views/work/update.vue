<template>
  <div class="app-container">

    <el-form ref="workForm" :rules="rules" :model="form" label-width="120px" v-loading="loading">
      <el-row  justify="center">
        <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>编辑工作</span>
        </div>
        <div style="margin-bottom:20px">
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
              <el-select v-model="form.project_name" :disabled=true>
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
              <el-button plain size="mini" style="margin-left:10px;" @click="appointToMe('appointed_user')">
                指派给我
              </el-button>
            </el-form-item>

            <el-form-item label="工作开始时间" prop="create_time">
              <el-date-picker
                v-model="form.begin_time"
                align="right"
                type="date"
                placeholder="选择日期"
                value-format="timestamp"
                >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="工作截至时间" prop="end_time">
              <el-date-picker
                v-model="form.end_time"
                align="right"
                type="date"
                placeholder="选择日期"
                value-format="timestamp"
                >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="完成时审核" prop="need_check">
              <el-switch
                v-model="form.need_check"
                active-color="#13ce66"
                inactive-color="#D7D7D7"
                active-value=1
                inactive-value=0
                >
              </el-switch>
            </el-form-item>
            <div v-show="form.need_check==1" prop="check_department">

              <el-form-item label="指派审核人员" prop="check_user">
                <el-select v-model="form.check_user" filterable placeholder="选择审核人员" v-loading="userLoading">
                  <el-option
                    v-for="item in users"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
                <el-button plain size="mini" style="margin-left:10px;" @click="appointToMe('check_user')">
                  指派给我
                </el-button>
              </el-form-item>
            </div>

            <el-form-item label="完成时提交报告">
              <el-switch
                v-model="form.need_report"
                active-color="#13ce66"
                inactive-color="#D7D7D7"
                active-value=1
                inactive-value=0>
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
import { updateWork, getInfo } from '@/api/work'
import Tinymce from '@/components/Tinymce'
import { getToken } from '@/utils/auth'

export default {
  name: 'UserForm',
  components:{
    Tinymce
  },
  data() {
    var validateCheckUser = (rule, value, callback) => {
      if(this.form.need_check == 1){
        if (value === '') {
          callback(new Error('请选择审核人员'));
        }
      }
      callback();
    }
    return {
      id : '',
      form : {
        title : '',
        rank : 2,
        description : '',
        project : '',
        appointed_user : '',
        begin_time: '',
        end_time: '',
        need_check : 0,
        check_user : '',
        need_report : 0
      },
      loading : true,
      userLoading : false,
      checkUserLoading: false,
      projectLoading : true,
      users: [],
      projects : [],
      rules:{
        title : [{ required: true, message: '请输入工作名称', trigger: 'blur' },{ min: 3, message: '长度至少需要3个字符', trigger: 'blur' }],
        check_user : [{ validator: validateCheckUser, trigger: 'blur' }],
      },
      uploadUrl : process.env.VUE_APP_BASE_API + 'v1/user/upload',
      headers : {}
    }
  },
  created(){
    this.id = this.$route.params && this.$route.params.id
    // this.fetchUser()
    this.fetchInfo()
  },
  mounted(){
    this.headers.Authorization = 'Bearer ' + getToken()
  },
  methods:{
    fetchUser(){
      fetchList({list : true, project : this.form.project}).then(response=>{
        this.users = response.data
        this.userLoading = false
      }).catch(error=>{
        this.userLoading = false
      })
    },
    fetchInfo(){
      getInfo(this.id).then(response=>{
        this.form = response.data
        let beginTime = parseInt(response.data.begin_time)
        let endTime = parseInt(response.data.end_time)
        this.form.end_time = endTime > 0?endTime * 1000:''
        console.log(this.form.end_time)
        this.form.begin_time = beginTime > 0?beginTime * 1000:''
        this.form.rank = parseInt(response.data.rank)
        this.form.check_user = this.form.check_user == '0'?'': this.form.check_user
        this.fetchUser()
        this.loading = false
      }).catch(error=>{
        this.loading = false
        this.$router.replace('/work')
      })
    },
    handleClick(){

    },
    appointToMe(attr){
      this.form[attr] = this.$store.state.user.id
    },
    projectChange(item){
      this.users = []
      this.fetchUser()
    },
    onSubmit(){
      // console.log('submit');
      this.loading = true
      this.$refs['workForm'].validate(valid=>{
        if(valid){
          updateWork(this.id, this.form).then(response=>{
            this.loading = false
            this.$message({
              message: '工作任务编辑成功',
              type: 'success'
            })
            this.$router.replace('/work/view/'+response.data.id)
          }).catch(error=>{
            this.loading = false
          })
        }else{
          this.loading = false
        }
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

<template>
  <div class="app-container">

    <el-form ref="form" :model="form" :rules="userRules" label-width="100px" v-loading="submitLoading">
      <el-row  justify="center">
        <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>人员资料</span>
        </div>
        <div style="margin-bottom:20px">
          <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="5">          
              <el-upload
                class="avatar-uploader"
                :action="uploadConfig.imageUploadAction"
                :show-file-list="false"
                :headers="uploadConfig.headers"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                  <img v-if="imageUrl" :src="imageUrl" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <label class="el-form-item__label" style="display:block;text-align: center;width:100%;padding:0">员工照片</label>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
            <el-form-item label="员工姓名" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="form.phone"></el-input>
            </el-form-item>
            <el-form-item label="登录密码" prop="password">
              <el-input type="password" v-model="form.password"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="password2">
              <el-input type="password" v-model="form.password2"></el-input>
            </el-form-item>
            <el-form-item label="员工工号" prop="no">
              <el-input v-model="form.no"></el-input>
            </el-form-item>

            <el-form-item label="性别">
              <el-select v-model="form.sex" placeholder="请选择性别">
                <el-option
                  v-for="item in sexs"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="所属部门">
              <el-select v-model="form.department" filterable placeholder="请选择供职部门" @change="departmentChange">
                <el-option
                  v-for="item in departments"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="职位">
              <el-select v-model="form.position" :disabled="form.department == ''" filterable :placeholder="form.department?'请选择职位':'请先选择部门'">
                <el-option
                  v-for="item in positions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="入职时间">
              <el-date-picker
                v-model="form.create_time"
                align="right"
                type="date"
                placeholder="选择日期"
                format="yyyy 年 MM 月 dd 日"
                :clearable="false"
                :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col sppan="24">
            <hr />
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
import { createUser, validate } from '@/api/user'
import { getList } from '@/api/org'
import { getToken } from '@/utils/auth'
import { getPositions } from '@/api/position'

export default {
  name: 'UserForm',
  components:{

  },
  data() {

    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    }

    var validatePhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('联系方式不能为空'));
      } else if(!(/^1[3456789]\d{9}$/.test(value))){ 
        callback(new Error('请输入11位有效手机号码'));
      } else{
        callback();
      }
    }

    var validatePhoneUnique = (rule, value, callback) => {
      validate({phone : value}).then(response=>{
        if(response.data.unique){
          callback();
        }else{
          callback(new Error('该号码已被注册，请勿重复注册'));
        }
      })
    }

    var validateNoUnique = (rule, value, callback) => {
      validate({no : value}).then(response=>{
        if(response.data.unique){
          callback();
        }else{
          callback(new Error('该工号已被使用，请更换工号'));
        }
      })
    }
    var date = new Date()
    return {
      imageUrl: '',
      form : {
        name : '',
        phone : '',
        password : '',
        password2 : '',
        no : '', 
        email : '',
        department : '',
        position : '',
        sex : '',
        create_time: date
      },
      uploadConfig:{
        imageUploadAction: process.env.VUE_APP_BASE_API + 'v1/user/upload',
        headers : {}
      },
      userRules:{
        name:[
          { required: true, message: '姓名不能为空'},
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        phone : [
          { required: true, message: '联系方式不能为空'},
          { validator: validatePhone, trigger: 'blur' },
          { validator: validatePhoneUnique, trigger: 'blur' }
        ],
        password:[
          { required: true, message: '登录密码不能为空'},
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        password2:[
          { required: true, message: '确认密码不能为空'},
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ],
        no:[
          { min: 2, message: '长度不能少于 2 个字符', trigger: 'blur' },
          { validator: validateNoUnique, trigger: 'blur' }
        ],
      },
      departments : [],
      positions:[],
      sexs:[
        {label : '男', value : 2 },
        {label : '女', value : 1 },
      ],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '前天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 2);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      },
      submitLoading : false,
    }
  },
  created(){
    this.fetchOrgs();
    this.uploadConfig.headers.Authorization = 'Bearer ' + getToken()
  },
  methods:{
    fetchOrgs() {
      getList().then(response => {
        this.departments = (response.data);
      })
    },
    departmentChange(department){
      this.form.position = "";
      getPositions({'department': department}).then(response=>{
        this.positions = response.data;
      })
    },
    beforeAvatarUpload(file){
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
      }

      return isJPG && isLt2M;
    },
    handleAvatarSuccess(res, file){
      this.form.image = res.data;
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    onSubmit(){
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          createUser(this.form).then(response=>{
            this.submitLoading = false;
            this.getList();
          }).catch(error=>{
            this.submitLoading = false;
          });
        } else {
          return false;
        }
      });
    }
  }
}
</script>
<style scoped>
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

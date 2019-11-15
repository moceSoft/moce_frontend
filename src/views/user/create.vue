<template>
  <div class="app-container">

    <el-form ref="form" :model="form" :rules="userRules" label-width="100px">
      <el-row  justify="center">
        <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>人员资料</span>
        </div>
        <div style="margin-bottom:20px">
          <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="5">          
              <el-upload
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false"
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
              <el-select v-model="form.position" filterable :placeholder="form.department?'请选择职位':'请先选择部门'">
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
import { createUser } from '@/api/user'
import { getList } from '@/api/org'
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
    };

    var validatePhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('联系方式不能为空'));
      } else if(!(/^1[3456789]\d{9}$/.test(value))){ 
        callback(new Error('请输入11位有效手机号码'));
      } else{
        callback();
      }
    };
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
        create_time: date
      },
      userRules:{
        name:[
          { required: true, message: '姓名不能为空'},
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        phone : [
          { required: true, message: '联系方式不能为空'},
          { validator: validatePhone, trigger: 'blur' }
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
          { required: true, message: '工号不能为空'},
          { min: 2, message: '长度不能少于 2 个字符', trigger: 'blur' }
        ],
      },
      departments : [],
      positions:[],
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
    }
  },
  created(){
    this.fetchOrgs();
  },
  methods:{
    fetchOrgs() {
      getList().then(response => {
        this.departments = (response.data);
      })
    },
    order(column, event){

    },
    view(user){

    },
    handleFilter(){

    },
    departmentChange(department){
      console.log(department);
      getPositions({'department': department}).then(response=>{
        this.positions = response.data;
      })
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

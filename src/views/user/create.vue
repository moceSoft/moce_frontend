<template>
  <div class="app-container">

    <el-form ref="form" :model="form" label-width="100px">
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
            <el-form-item label="员工姓名">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="联系电话">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="员工工号">
              <el-input v-model="form.no"></el-input>
            </el-form-item>

            <el-form-item label="所属部门">
              <el-select v-model="department" filterable placeholder="请选择供职部门" @change="departmentChange">
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="职位">
              <el-select v-model="position" filterable :placeholder="positionPlaceHolder">
                <el-option
                  v-for="item in options"
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
    return {
      imageUrl: '',
      form : {
        name : '',
        phone : '',
        no : '', 
        email : '',
        department : 0,
        position : 0,
        create_time: 0
      },
      department: '',
      positionPlaceHolder : '请先选择部门',
      position: '',
      options : [],
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
        this.options = (response.data);
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

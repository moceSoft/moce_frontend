<template>
  <div class="app-container">

    <div class="filter-container">
      <el-row :gutter="4">
        <el-col :lg="4" :xs="24" :sm="8" :md="6">
          <el-input v-model="query.name" placeholder="项目名称"  class="filter-item" @keyup.enter.native="handleFilter" />
        </el-col>
        
        <el-col :lg="8" :xs="24" :sm="24" :md="12">
          <el-button-group>
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
              搜索
            </el-button>
             <el-button v-waves class="filter-item" type="primary" icon="el-icon-plus" @click="showDrawer = true">
              添加项目
            </el-button>
          </el-button-group>
        </el-col>
      </el-row>
    </div>

    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      @header-click="order"
      >
      <el-table-column prop="image" label="图片" width="80" align="center">
        <!-- 图片的显示 -->
        <template slot-scope="scope">            
          <img v-if="scope.row.image" :src="scope.row.image | imgFilter"  width="60" height="60" />
          <div v-else class="project_imageholder">{{scope.row.name.substr(0, 1)}}</div>
        </template>
      </el-table-column> 
      <el-table-column
        prop="name"
        label="项目名称">
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="创建时间"
        width="160" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.create_time | parseTime('{y}年{m}月{d}日') }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="end_time"
        label="预期结束时间" 
        width="160" 
        align="center"> 
        <template slot-scope="{row}">
          <span>{{ row.end_time | timeFormatter('{y}年{m}月{d}日') }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="status"
        label="当前状态" width="160" align="center"> 
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status | statusText }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width"  width="240" >
        <template slot-scope="{row}">

          <router-link :to="'/project/view/'+row.id">
            <el-button plain size="mini" >
              查看
            </el-button>
          </router-link>
          <router-link :to="'/project/update/'+row.id" style="margin-left:5px">
            <el-button type="primary" plain size="mini">
              编辑
            </el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="query.page" :limit.sync="query.limit" @pagination="getList" />

    <Drawer :show="showDrawer" @close="close">

      <div class="drawer_container">
        <h3 class="drawer-title">新增项目</h3>
        <el-form ref="form" :model="project" :rules="projectRules" label-width="80px" size="mini" label-position="right" v-loading="submitLoading">
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
          <el-form-item label="负责人"  prop="in_charge_user">
            <el-select v-model="project.in_charge_user" filterable placeholder="请选择负责人" @focus="fetchUser">
              <el-option
                v-loading="selectUserLoading"
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
            >
            </el-date-picker>
          </el-form-item>
        <el-button @click="saveProject" icon="el-icon-check">保存</el-button>
      </el-form>
        <!-- <el-button type="danger" @click="deleteItem" icon="el-icon-delete">删除</el-button> -->
      </div>

    </Drawer>
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
  name: 'UserList',
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
      selectUserLoading : true,
      submitLoading: false, 
      tableData: [],
      query: {
        name : '',
        status : '',
        page: 1,
        limit: 30,
      },
      uploadConfig:{
        imageUploadAction: process.env.VUE_APP_BASE_API + 'v1/project/upload',
        headers : {}
      },
      total : 0,
      showDrawer : false,
      users : [],
      project:{
        name : '',
        image : '',
        img_preview : '',
        description : '',
        in_charge_user : '',
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
    this.getList();
  },
  methods:{
    getList(){
      fetchList(this.query).then(response => {
        this.tableData = response.data.list;
        this.total = parseInt(response.data.count);
        this.loading = false;
      })
    },
    order(column, event){

    },
    view(user){

    },
    delete(){

    },
    handleFilter(){

    },

    saveProject(){
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          createProject(this.project).then(response=>{
            this.submitLoading = false;
            this.showDrawer = false;
            this.getList();
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

<template>
  <div class="app-container flex-center" v-loading="loading">
    <el-row style="width:100%">
      <el-col :span="24" style="display: flex;flex-direction: row;align-items:flex-end;margin-bottom:20px;flex-wrap: wrap">
        <h1>{{position.name}}</h1>

        <router-link to="/org/index" >
          <el-button type="info" size="mini" plain icon="el-icon-back" style="margin-left:10px">
            返回
          </el-button>
        </router-link>
        <div style="margin-left:30px">
          <router-link :to="'/org/update/'+ id" >
            <el-button size="mini">
              更新职位/权限
            </el-button>
          </router-link>
          <el-button type="danger" size="mini" plain style="margin-left:5px" @click="deletePosition">
            删除职位
          </el-button>
        </div>

      </el-col>
    </el-row>
    <el-row :gutter="20" style="width:100%">
      <el-col :sm="24" :md="8" :xl="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>该职位员工</span>
          </div>
          <div style="margin-bottom:20px" v-loading="userLoading">
            <el-popover
              :key="item.id"
              v-for="item in users"
              placement="top-start"
              :title="item.name"
              trigger="hover"
              >
              <div>
                员工信息写在这里
              </div>
              <Avatar size="60" :user="item" />
            </el-popover>
            <div v-if="!users.length" style="text-align:center;padding: 20px 0 0 0;color:#A7A7A7">
              暂无员工就任该职位
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :sm="24" :md="16" :xl="18">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>职位权限设置</span>
          </div>
          <el-form :inline="true">
            <div class="group_container" style="margin-bottom:20px"  v-loading="permissionLoading">
                <div class="group"  v-for="(permissionGroup, i) in permissions" :key="i">
                  <div class="group_title">
                    {{permissionGroup.group}}
                  </div>
                  <div>
                    <el-form-item :label="permission.label" v-for="(permission, j) in permissionGroup.actions" :key="j" style="margin:5px">
                      <el-switch
                        v-model="permission.value"
                        :disabled="true"
                        :active-value="true"
                        :inactive-value="false">
                      </el-switch>
                      <el-popover
                        v-if="permission.scope"
                        placement="bottom"
                        trigger="click"
                        >
                        <div>
                          <div class="scope_title">
                            <span>已授权部门</span>
                          </div>
                          <div v-for="department, j in permission.departments" :key="j" class="scope_department">
                            <i class="el-icon-check"></i>  {{departments[department+'']}}
                          </div>
                        </div>
                        <el-button size="mini" slot="reference" style="margin-left: 10px">权限范围</el-button>
                      </el-popover>
                    </el-form-item>
                  </div>
                </div>
            </div>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getList as getDepartment } from '@/api/org';
import { getInfo, deletePosition } from '@/api/position';
import { getPermission } from '@/api/permission';
import { fetchList as getUser } from '@/api/user';
import { Avatar } from '@/components/Avatar';

export default {
  name: 'positionView',
  components :{
    Avatar
  },
  data() {
    return {
      id : '',
      loading : true,
      userLoading: true,
      permissionLoading : true,
      position:{
        name : ' ',
        department : '',
      },
      users:[],
      permissions : [],
      departments : {}
    }
  },
  created(){
    // this.fetchData();
    const id = this.$route.params && this.$route.params.id
    this.id = id
    this.fetchData(id)
    this.fetchUser(id)
    this.fetchPermission(id)
    this.fetchDepartment()
    this.setTagsViewTitle()
    this.setPageTitle()
  },
  methods: {
    fetchData(id){
      getInfo(id).then(response=>{
        this.position = response.data
        this.loading = false
      }).catch(error=>{
        this.loading = false;
      })
    },
    fetchUser(id){
      getUser({department : id}).then(response=>{
        this.users = response.data
        this.userLoading = false
      }).catch(error=>{
        this.userLoading = false;
      })
    },
    fetchPermission(id){
      getPermission({position : id}).then(response=>{
        console.log(response);
        this.permissions = response.data
        this.permissionLoading = false;
      }).catch(error=>{
        this.permissionLoading = false;
      })
    },
    fetchDepartment(){
      getDepartment().then(response=>{
        response.data.forEach((department)=>{
          this.departments[department.id] = department.name
        })
      }).catch(error=>{
        this.$message({
          type: 'warning',
          message: '组织部门数据读取失败！'
        }); 
      })
    },

    setTagsViewTitle() {
      const title = '查看员工信息'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.position.name}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },

    setPageTitle() {
      const title = '查看员工信息'
      document.title = `${title} - ${this.position.name}`
    },
    deletePosition(){
      this.$confirm("就任该职位的员工将自动变更为未指派职位", "确认删除"+this.position.name+"吗？", {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        
      }).catch(() => {
        this.$message({
          type: 'primary',
          message: '已取消删除'
        });          
      });
    }
  }
}
</script>
<style scoped>
  .app-container{
    flex-wrap:wrap;
  }
  h1{
    font-weight:300 !important;
    margin:0;
    color:#777;
  }
  .scope_title{
    color:#777;
    padding-bottom:5px;
    border-bottom:1px solid #E7E7E7;
    margin-bottom:5px;
  }
  .scope_department{
    line-height: 28px;
  }
  .group_container{
    margin-bottom:20px;
  }
  .group_container>.group:last-child{
    border-bottom:none;
  }
  .group{
    padding-bottom:15px;
    border-bottom:1px solid #E7E7E7;
  }
  .group{
    padding-bottom:15px;
    border-bottom:1px solid #E7E7E7;
  }
  .group_title{
    padding-top:20px;
    font-size:14px;
    color:#999;
    margin-bottom:15px;
  }
  .group_container>.group:first-child>.group_title{
    padding-top:0;
  }
</style>

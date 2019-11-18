<template>
  <div class="app-container flex-center" v-loading="loading">
    <el-row style="width:100%">
      <el-col :span="24" style="display: flex;flex-direction: row;align-items:flex-end;margin-bottom:20px">
        <h1>{{position.name}}</h1>
        <div style="margin-left:30px">
          <el-button size="mini">
            修改职位
          </el-button>
          <el-button type="primary" size="mini" plain>
            修改权限
          </el-button>
          <el-button type="danger" size="mini" plain>
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
              <avatar size="60" :user="item" />
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
            <div style="margin-bottom:20px"  v-loading="permissionLoading">
              <el-collapse >
                <el-collapse-item  v-for="(permissionGroup, i) in permissions" :key="i">
                  <template slot="title">
                    {{permissionGroup.group}}
                  </template>
                  <div>
                    <el-form-item :label="permission.label" v-for="(permission, j) in permissionGroup.actions" :key="j" style="margin:5px">
                      <el-switch
                        v-model="permission.value"
                        :active-value="true"
                        :inactive-value="false">
                      </el-switch>
                      <el-popover
                        v-if="permission.scope"
                        placement="bottom"
                        trigger="click"
                        >
                        <div>
                          <el-transfer :titles="['部门列表', '已授权部门']" :props="{key: 'id', label: 'name'}" :filterable="true" v-model="permission.departments" :data="departments"></el-transfer>
                        </div>
                        <el-button size="mini" slot="reference" style="margin-left: 10px">设置权限范围</el-button>
                      </el-popover>
                    </el-form-item>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getList as getDepartment } from '@/api/org';
import { getInfo } from '@/api/position';
import { getPermission } from '@/api/permission';
import { fetchList as getUser } from '@/api/user';
import { avatar } from '@/components/Avatar';

export default {
  name: 'positionView',
  components :{
    avatar
  },
  data() {
    return {
      loading : true,
      userLoading: true,
      permissionLoading : true,
      position:{
        name : ' ',
        department : '',
      },
      users:[],
      permissions : [],
      departments : [

      ]
    }
  },
  created(){
    // this.fetchData();
    const id = this.$route.params && this.$route.params.id
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
      getPermission({department : id}).then(response=>{
        this.permissions = response.data
        this.permissionLoading = false;
      }).catch(error=>{
        this.permissionLoading = false;
      })
    },
    fetchDepartment(){
      getDepartment().then(response=>{
        this.departments = response.data
      }).catch(error=>{

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
</style>

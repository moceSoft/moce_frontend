<template>
  <div class="app-container flex-center">
    <el-row style="width:100%">
      <el-col :span="24">
        <el-card class="box-card" v-loading="submitLoading">
          <div slot="header" class="clearfix">
            <span>新建职位-{{departmentTitle}}</span>
          </div>
          <el-form :model="position" ref="positionForm" :rules="rules" >
            <el-form-item label="职位名称" prop="name">
              <el-input v-model="position.name">
              </el-input>
            </el-form-item>
          </el-form>
          <el-form :inline="true">
            <el-form-item label="职位权限">
            </el-form-item>
            <div v-loading="permissionLoading">
              <div class="group_container">
                <div class="group" v-for="(permissionGroup, i) in permissions" :key="i" :name="i + ''">
                  <div class="group_title">
                    {{permissionGroup.label}}
                  </div>
                  <div class="group_body">
                    <div v-for="(permission, j) in permissionGroup.views" :key="j" v-if="permission.permission">
                      <el-form-item :label="permission.label" style="margin:5px">
                        <el-switch
                          v-model="permission.value"
                          :active-value="true"
                          :inactive-value="false"
                          @change="validateNeed(value, permission, permissionGroup.views)"
                        >
                        </el-switch>
                        <el-popover
                          v-if="permission.scope"
                          placement="bottom"
                          trigger="click"
                          >
                          <div>
                            <el-transfer v-loading="departmentLoading" :titles="['部门列表', '已授权部门']" :props="{key: 'id', label: 'name'}" :filterable="true" v-model="permission.departments" :data="departments"></el-transfer>
                          </div>
                          <el-button size="mini" slot="reference" style="margin-left: 10px" :disabled="!permission.value">设置权限范围</el-button>
                        </el-popover >
                      </el-form-item>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-form>

          <div>
            <el-button type="primary" @click="onSubmit">立即创建</el-button>
            <el-button>取消</el-button>
          </div>

        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getList as getDepartment } from '@/api/org'
import { Message } from 'element-ui'
import { getDefaultPermission } from '@/api/permission'
import { createPosition } from '@/api/position'

export default {
  name: 'NewPosition',
  components :{

  },
  data() {
    return {
      permissionLoading : true,
      departmentLoading : true,
      submitLoading: false,
      position:{
        name : '',
        department : 0,
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
        ],
      },
      activePanels :[],
      permissions : [],
      departments : [],
      departmentTitle : '',
    }
  },
  created(){
    const id = this.$route.params && this.$route.params.id
    this.position.department = id;
    this.fetchPermission(id)
    this.fetchDepartment(id)
  },
  methods: {
    initData(id){
      if(!this.permissionLoading && !this.departmentLoading){
        let scope = []
        this.departments.forEach(department=>{
          if(department.id === id){
            this.departmentTitle = department.name
            this.setTagsViewTitle()
            this.setPageTitle()
          }
        })

      }
    },
    fetchPermission(id){
      getDefaultPermission(id).then(response=>{
        this.permissions = response.data
        console.log(this.permissions)
        this.permissionLoading = false
        this.$nextTick(() => {
          this.initData(id)
        })
      }).catch(error=>{
        this.permissionLoading = false
      })
    },
    fetchDepartment(id){
      getDepartment().then(response=>{
        this.departments = response.data
        this.departmentLoading = false
        this.$nextTick(() => {
          this.initData(id)
        })
      }).catch(error=>{
        this.departmentLoading = false
      })
    },
    onSubmit(){
      this.$refs['positionForm'].validate(valid => {
        if(valid){
          this.submitLoading = true
          let data = {...this.position, 'permission' : this.permissions}
          createPosition(data).then(response=>{
            this.submitLoading = false
            this.$message({
              type: 'success',
              message: '新建职位成功'
            })
            this.$router.replace({
              path: '/org/index'
            })
          }).catch(error=>{
            this.submitLoading = false
          });
        }
      });
    },
    setTagsViewTitle() {
      const title = '新建职位'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.departmentTitle}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },

    setPageTitle() {
      const title = '新建职位'
      document.title = `${title} - ${this.departmentTitle}`
    },
    validateNeed(value, permission, group){
      if(value && permission.need){
        let need = permission.need.split('/');
        let pre;
        if(need.length > 1){
          pre = this.permissions[need[0]]['views'][need[1]];
        }else{
          pre = group[need[0]];
        }
        if(!pre.value)
          pre.value = true;
      }
    },
  }
}
</script>
<style scoped>
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

.group_body{
  display: flex;
  flex-wrap: wrap;
}

.group_body>div{
  padding: 0 5px;
  border-right:1px solid #E3E3E3;
}
.group_body>div:last-child{
  border-right:none;
}

</style>

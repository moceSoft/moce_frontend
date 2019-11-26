<template>
  <div class="app-container flex-center">
    <el-row style="width:100%">
      <el-col :span="24">
        <el-card class="box-card" v-loading="submitLoading">
          <div slot="header" class="clearfix">
            <span>更新职位 - {{orginalName}} - {{departmentTitle}}</span>
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
                    {{permissionGroup.group}}
                  </div>
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
                          <el-transfer v-loading="departmentLoading" :titles="['部门列表', '已授权部门']" :props="{key: 'id', label: 'name'}" :filterable="true" v-model="permission.departments" :data="departments"></el-transfer>
                        </div>
                        <el-button size="mini" slot="reference" style="margin-left: 10px">设置权限范围</el-button>
                      </el-popover >
                    </el-form-item>
                  </div>
                </div>
              </div>
            </div>
          </el-form>

          <div>
            <el-button type="primary" @click="onSubmit">更新职位</el-button>
            <el-button>取消</el-button>
          </div>

        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getList as getDepartment } from '@/api/org'
import { getInfo } from '@/api/position'
import { getInfo as getPermission } from '@/api/permission'
import { updatePosition } from '@/api/position'

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
        id: '',
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
      orginalName : '',
    }
  },
  created(){
    const id = this.$route.params && this.$route.params.id
    // this.position.department = id;
    this.fetchPosition(id)
    this.fetchPermission(id)
    this.fetchDepartment()
  },
  methods: {
    fetchPosition(id){
      getInfo(id).then(response=>{
        this.position = response.data
        this.departmentTitle = response.data.department.name
        this.setTagsViewTitle()
        this.setPageTitle()
        this.orginalName = response.data.name
      }).catch(error=>{

      })
    },
    fetchPermission(id){
      getPermission(id).then(response=>{
        this.permissions = response.data
        this.permissionLoading = false
      }).catch(error=>{
        this.permissionLoading = false
      })
    },
    fetchDepartment(){
      getDepartment().then(response=>{
        this.departments = response.data
        this.departmentLoading = false
      }).catch(error=>{
        this.departmentLoading = false
      })
    },
    onSubmit(){
      this.$refs['positionForm'].validate(valid => {
        if(valid){
          this.submitLoading = true
          let data = {...this.position, 'permission' : this.permissions}
          updatePosition(data).then(response=>{
            this.submitLoading = false
            this.$message({
              type: 'success',
              message: '更新职位成功'
            })
            this.$router.replace({
              path: '/org/view/' + this.position.id
            })
          }).catch(error=>{
            this.submitLoading = false
            this.$message({
              type: 'warning',
              message: '更新职位失败'
            })
          });
        }
      });
    },
    setTagsViewTitle() {
      const title = '更新职位'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.position.name}-${this.departmentTitle}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },

    setPageTitle() {
      const title = '更新职位'
      document.title = `${title} - ${this.position.name} - ${this.departmentTitle}`
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

</style>

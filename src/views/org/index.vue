<template>
  <div class="app-container flex-center">
    <OrgTree :data="tree" :zoom=true @on-node-click="click"/>
    <Drawer :show="showDrawer" @close="close">
      <div class="drawer_container">
          <div>
            <h3 class="drawer-title">修改 <b>{{item.label}}</b> 信息</h3>
            <div class="drawer-item">
              <el-input 
                v-model="item.label" 
                placeholder="请输入部门名称"
                name="update_item_label"
              >
                  
              </el-input>
              <input v-model="item.id" type="hidden">
              <input v-model="item.parent_id" type="hidden">
            </div>
            <div class="drawer-item">
              <el-input v-model="item.description" type="textarea" :rows="2" placeholder="请输入部门简介"></el-input>
            </div>
            <el-button @click="update" icon="el-icon-check">保存</el-button>
            <el-button type="danger" @click="deleteItem" icon="el-icon-delete">删除</el-button>
          </div>
          <el-divider></el-divider>
          <div style="margin-top:40px">
            <h3 class="drawer-title">新增 <b>{{item.label}}</b> 下级部门</h3>
            <div class="drawer-item">
              <el-input 
                v-model="newItem.label" 
                name="create_item_label" 
                placeholder="请输入部门名称"
              >
              </el-input>
              <input v-model="newItem.parent_id" type="hidden">
            </div>
            <div class="drawer-item">
              <el-input v-model="newItem.description" type="textarea" :rows="2" placeholder="请输入部门简介"></el-input>
            </div>
            <el-button @click="create" icon="el-icon-check">保存</el-button>
          </div>
      </div>
    </Drawer>
  </div>
</template>

<script>
import OrgTree from 'v-org-tree'
import 'v-org-tree/dist/v-org-tree.css'
import { getOrgs, createOrg, updateOrg, deleteOrg } from '@/api/org'
import Drawer from '@/components/Drawer'
import { Message } from 'element-ui'

export default {
  name: 'OrgTreeView',
  components :{
    OrgTree,
    Drawer
  },
  data() {
    return {
      tree : {},
      showDrawer : false,
      item : {
        'id' : 0,
        'label' : '',
        'description' : '',
      },
      newItem : {
        'parent_id' : 0,
        'label' : '',
        'description' : '',
      },
    }
  },
  created(){
    this.fetchData();
  },
  methods: {
    fetchData() {
      getOrgs().then(response => {
        this.tree = (response.data[0]);
      })
    },
    click(e, item){
      this.item = item;
      this.showDrawer = true;
      this.newItem.parent_id = item.id;
    },
    close(){
      this.showDrawer = false;
    },
    update(){
      if(this.validate(this.item)){
        updateOrg({...this.item, 'name' : this.item.label}).then(response=>{
          this.showDrawer = false;
          Message({
            message: '修改部门信息成功',
            type: 'success',
            duration: 4 * 1000
          })
        });
      }
    },
    create(){
      if(this.validate(this.newItem, true)){
        createOrg({...this.newItem, 'name' : this.newItem.label}).then(response=>{
          this.tree = (response.data[0]);
          this.showDrawer = false;
          this.newItem = {
            'parent_id' : 0,
            'label' : '',
            'description' : '',
          }
          Message({
            message: '添加部门信息成功',
            type: 'success',
            duration: 4 * 1000
          })
        });
      }
    },
    deleteItem(){
      deleteOrg(this.item).then(response=>{
        this.tree = (response.data[0]);
          this.showDrawer = false;
          Message({
            message: '已成删除部门',
            type: 'success',
            duration: 4 * 1000
          })
      });
    },
    validate(item, create = false){
      if(!item.label){
        Message({
          message: '请填写部门名称',
          type: 'error',
          duration: 4 * 1000
        })
        if(create)
          this.$ref.create_item_label.focus()
        else
          this.$ref.update_item_label.focus()
        return false
      }
      if(create){
        if(!item.parent_id){
          Message({
            message: '部门需设置上级部门',
            type: 'error',
            duration: 4 * 1000
          })
          return false;
        }
      }
      return true;
    }
  }
}
</script>
<style>
.flex-center{
  display: flex;
  justify-content: space-around;
}
.drawer_container{
  padding:20px;
}
.drawer-title {
  margin-bottom: 12px;
  color: rgba(0, 0, 0, .85);
  font-size: 14px;
  line-height: 22px;
  font-weight: 300;
}
.drawer-item {
  color: rgba(0, 0, 0, .65);
  font-size: 14px;
  padding: 12px 0;
}
.org-tree-node-label{
  color:#666;
  font-size:14px;
}
.org-tree-node-label:hover{
  cursor: pointer;
  background-color: rgb(217, 236, 255);
  color:#333;
}
</style>

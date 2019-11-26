<template>
  <div class="app-container flex-center"
      v-loading="loading">
    <OrgTree 
      :data="tree" 
      :zoom=true 
      :node-render="renderNode"
      label-class-name=""
    />
    <Drawer :show="showDrawer" @close="close">
      <div class="drawer_container">
          <el-tabs :value="panel">
            <el-tab-pane label="修改信息" name="update" v-show="item.id > 0">
              <h3 class="drawer-title">修改 <b>{{item.name}}</b> 信息</h3>
              <div class="drawer-item">
                <el-input 
                  v-model="item.name" 
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
              <!-- <el-button type="danger" @click="deleteItem" icon="el-icon-delete">删除</el-button> -->

            </el-tab-pane>
            <el-tab-pane label="新增下级部门" name="newChild">
              
              <h3 class="drawer-title">新增 <b>{{item.name}}</b> 下级部门</h3>
              <div class="drawer-item">
                <el-input 
                  v-model="newItem.name" 
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

            </el-tab-pane>
            <!-- <el-tab-pane label="职位管理" name="third">职位管理</el-tab-pane> -->
          </el-tabs>
      </div>
    </Drawer>

    <Drawer :show="showPositionDrawer" @close="togglePositionDrawer(false)">
      <div class="drawer_container">
          <h3 class="drawer-title">修改 <b>{{item.name}}</b> 信息</h3>
          <div class="drawer-item">
            <el-input 
              v-model="item.name" 
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
      </div>
    </Drawer>
  </div>
</template>

<script>
import OrgTree from 'v-org-tree'
import 'v-org-tree/dist/v-org-tree.css'
import { getPositions, createOrg, updateOrg, deleteOrg } from '@/api/org'
import Drawer from '@/components/Drawer'
import { Message } from 'element-ui'
import orgNode from './orgNode'

export default {
  name: 'OrgTreeView',
  components :{
    OrgTree,
    Drawer
  },
  data() {
    return {
      tree : {},
      loading : true,
      showDrawer : false,
      item : {
        'id' : 0,
        'name' : '',
        'description' : '',
      },
      position :{
          'id' : '',
          'name' : '',
          'department' : '',
      },
      newItem : {
        'parent_id' : 0,
        'name' : '',
        'description' : '',
      },
      panel: 'update',
      showPositionDrawer:false,
      positionDrawerHeader: '',
    }
  },
  created(){
    this.fetchData();
  },
  methods: {
    fetchData() {
      getPositions().then(response => {
        this.tree = (response.data[0])
        this.loading = false
      }).catch(error=>{
        this.loading = false
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
        updateOrg({...this.item}).then(response=>{
          this.showDrawer = false;
          this.tree = (response.data[0]);
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
        createOrg({...this.newItem}).then(response=>{
          this.tree = (response.data[0]);
          this.showDrawer = false;
          this.newItem = {
            'parent_id' : 0,
            'name' : '',
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
    deleteItem(item){
      this.$confirm('下级部门将会并入上级部门?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteOrg(item).then(response=>{
          this.tree = (response.data[0]);
            this.showDrawer = false;
            Message({
              message: '已成删除部门',
              type: 'success',
              duration: 4 * 1000
            })
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    validate(item, create = false){
      if(!item.name){
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
    },
    renderNode(h, node){
      let model = {
        'id' : node.id,
        'name' : node.name,
        'positions' : node.positions
      }
      return (
        <orgNode 
          node={node} 
          deleteNode={this.deleteItem}
          newChildNode={this.newNode}
          updateNode={this.updateNode}
          newPosition = {this.newPosition}
          updatePosition={this.updatePosition}
        />
      )
    },
    newNode(item){
      this.item= Object.assign({}, item);
      this.panel = 'newChild'
      this.showDrawer = true;
      this.newItem.parent_id = item.id;
    },
    updateNode(item){
      this.item = Object.assign({}, item);
      this.panel = 'update'
      this.showDrawer = true;
      this.newItem.parent_id = item.id;
    },
    togglePositionDrawer(show){
      if(show){
        this.showPositionDrawer = show;
      }else
        this.showPositionDrawer = !this.showPositionDrawer;
    },
    newPosition(item){
      this.togglePositionDrawer(true)
      this.positionDrawerHeader = '新增职位';
      this.position = {
        'id' : '',
        'name' : '',
        'department' : item.id
      }
    },
    updatePosition(item){

    }
  }
}
</script>
<style>
.org-tree-container{
  overflow: auto;
}
.org-tree-node-label-inner{
  padding:0;
  border:none;
  box-shadow: none;
}
.flex-center{
  display: flex;
  justify-content: space-around;
}
.org-tree-node-label{
  color:#666;
  font-size:14px;
}

</style>

<template>
  <div class="org_node">
      <div class="node_header">
        <h3 :style="{margin: node.id?'0 50px 0 0':'0 20px'}">{{node.name}}</h3>
        <div class="node_btns">
          <el-button icon="el-icon-plus" circle plain size="mini" @click="newChild"></el-button>
          <el-button v-if="node.id != 0"  type="primary" icon="el-icon-edit" circle plain size="mini" @click="update"></el-button>
          <el-button v-if="node.id != 0" type="danger" icon="el-icon-delete" circle plain size="mini" @click="del"></el-button>
        </div>
      </div>
      <div class="org_positions" v-if="node.id != 0" >
        <router-link :to="'/position/view/'+item.id" 
            :key="item.id"
            v-for="item in node.positions"
        >
          <el-button size="mini" >
            {{item.name}}
          </el-button>
        </router-link>
        
        <router-link :to="'/position/create/'+node.id">
          <el-button class="button-new-tag" size="mini">+ 添加职位</el-button>
        </router-link>
      </div>
  </div>
</template>

<script>
import {createPosition} from '@/api/position'
export default {
  name: 'OrgNode',
  props: {
    node: {
      type: Object
    },
    deleteNode:{
      type : Function
    },
    newChildNode:{
      type : Function
    },
    updateNode:{
      type : Function
    },
    newPosition:{
      type : Function
    },
    updatePosition:{
      type : Function
    },
  },
  data(){
    return {
      // inputValue : '',
      // inputVisible : false
    }
  },
  created(){
    // console.log(this.node);
  },
  methods: {
    del(){
      this.deleteNode(this.node);
    },
    update(){
      this.updateNode(this.node);
    },
    newChild(){
      this.newChildNode(this.node);
    },
    showInput() {
      // this.inputVisible = true;
      // this.$nextTick(_ => {
      //   this.$refs.positionInput.$refs.input.focus();
      // });
    },
    handleInputConfirm(node) {
      let inputValue = this.inputValue;
      if (inputValue) {
        createPosition({
          org_tree : node.id,
          name : inputValue
        }).then(response=>{
          this.node.positions.push({ "name" :inputValue });
          this.inputVisible = false;
          this.inputValue = '';
          this.$confirm("是否现在为"+inputValue+"设置相关权限", '已成功添加', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'success'
          }).then(() => {
            
          }).catch(() => {
            this.$message({
              type: 'primary',
              message: '已取消设置权限'
            });          
          });
        })
      }else{
        this.inputVisible = false;
        this.inputValue = '';
      }

    },
    setPermission(item){

    },
    deletePosition(item){

    },
    onUpdatePosition(position){
      this.updatePosition(position);
    }
  }
}
</script>
<style >
  .node_header{
    display:flex;
    justify-content: space-between;
    align-items: center;
  }
  .org_node{
    max-width:300px !important;
  }
  .org_node h3{
    color:#606266;
    text-align:center;
    font-weight: 400;
  }
  .node_btns{
    display: flex;
    flex-wrap: nowrap;
  }
  .org_positions{
    padding-top:10px;
    margin-top:10px;
    border-top:1px solid #ebebeb;
    display: flex;
    max-width: 300px;
    flex-wrap: wrap;
  }
  .org_positions>*{
    margin-right:3px;
    margin-bottom:3px;
  }
  .position_node{
    padding:5px 10px;
    border:1px solid #ebebeb;
    font-size:14px;
    color:#666;
  }


</style>
<style scoped>
.org_positions .el-button + .el-button {
    margin-left: 0;
}
</style>
<template>
  <div class="org_node">
      <div class="node_header">
        <h3 :style="{margin: node.id?'0 50px 0 0':'0 20px'}">{{node.name}}</h3>
        <div>
          <el-button icon="el-icon-plus" circle plain size="mini" @click="newChild"></el-button>
          <el-button v-if="node.id != 0"  type="primary" icon="el-icon-edit" circle plain size="mini" @click="update"></el-button>
          <el-button v-if="node.id != 0" type="danger" icon="el-icon-delete" circle plain size="mini" @click="del"></el-button>
        </div>
      </div>
      <div class="org_positions" v-if="node.id != 0" >
        <el-tag
          :key="item.id"
          v-for="item in node.positions"
          :disable-transitions="false"
          closable
          >
          {{item.name}}
        </el-tag>
        <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          ref="positionInput"
          size="mini"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        >
        </el-input>
        <el-button v-else class="button-new-tag" size="mini" @click="showInput">+ 添加职位</el-button>
      </div>
  </div>
</template>

<script>

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
    }
  },
  data(){
    return {
      inputValue : '',
      inputVisible : false
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
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.positionInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.node.positions.push({ "name" :inputValue });
      }
      this.inputVisible = false;
      this.inputValue = '';
    }
  }
}
</script>
<style>
  .org_node{
  }
  .node_header{
    display:flex;
    justify-content: space-between;
    align-items: center;
  }
  .org_node h3{
    color:#606266;
    text-align:center;
    font-weight: 400;
  }
  .org_positions{
    padding-top:10px;
    margin-top:10px;
    border-top:1px solid #ebebeb;
    display: flex;
  }
  .position_node{
    padding:5px 10px;
    border:1px solid #ebebeb;
    font-size:14px;
    color:#666;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 30px;
    line-height: 28px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>

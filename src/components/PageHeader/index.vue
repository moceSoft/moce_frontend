<template>
  <div class="header">
    <el-button plain icon="el-icon-back" size="mini" @click="goBack">返回</el-button>
    <div class="header_content">{{content}}</div>
  </div>
</template>

<script>

export default {
  name: 'PageHeader',
  props: {
    content: {
      type: String,
      default: '页面详情'
    },
    goBack: {
      type: Function,
      default() {
        return ()=>{

        }
      }
    },
  },
  data() {
    return {
    }
  },
  methods: {
    
  }
}
</script>
<style scoped>
.header{
  display: flex;
  flex-direction: row;
  align-items: center;
}
.header_content{
  padding-left:20px;
  color:#454545;
}
</style>

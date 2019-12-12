<template>
	<div class="log_text">
		<span v-if="create">
			创建了该项任务
		</span>
		<span v-if="currentStateChanged">
			将任务状态修改为 <workstatus :status="log.after.current_state" />
		</span>
    <span v-else-if="appointedChanged">
      变更了该工作负责人
    </span>
    <span v-else-if="checkChanged">
      变更了该工作审核人
    </span>
    <span v-else-if="detailChanged">
      编辑了该工作内容
    </span>
    <div class="operation" v-if="!create">
      <el-badge class="mark" :value="more" :hidden="more < 2">
        <el-button size="mini" class="mini_button" @click="showDetail">查看详细</el-button>
      </el-badge>
    </div>
	</div>
</template>

<script>
import WorkStatus from './WorkStatus'

export default {
  name: 'LogItem',
  props : {
  	log :{
  		type : Object
  	}
  },
  data(){
    return {
      currentStateChanged : false,
      appointedChanged : false,
      detailChanged : false,
      checkChanged : false,
      create : false,
      more : 0
    }
  },
  components : {
    workstatus : WorkStatus
  },
  mounted(){
    if(typeof(this.log.before) == 'string' && this.log.before !== ''){
      this.log.before = JSON.parse(this.log.before)
    }
    if(typeof this.log.after == 'string')
      this.log.after = JSON.parse(this.log.after)

    if(!this.log.before){
      this.create = true
    }else{
      let keys = Object.keys(this.log.after)
      for(let i = 0, l = keys.length; i < l; i++){
        let key = keys[i];
        if(key == 'current_status'){
          this.currentStateChanged = true
        }else if(key == 'appointed_user'){
          this.appointedChanged = true
        }else if(key == 'check_user'){
          this.checkChanged = true
        }else{
          this.detailChanged = true
        }
        this.more++
      }
    }
  },
  methods:{
    showDetail(){
      this.$emit('show-detail')
    }
  }

 }
</script>
<style scoped>
.log_text{
  padding-left:15px;
  color:#666;
  flex-grow:1;
}
.log_text>>>span{
  padding:4px 0;
  display:block;
}
.mini_button{
  padding:2px 5px !important;
}
.operation{
  padding:4px 0;
  display: flex;
}
</style>
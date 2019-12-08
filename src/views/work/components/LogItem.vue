<template>
	<div class="log_text">
		<span v-if="create">
			创建了该项任务
		</span>
		<span v-if="currentStateChanged">
			将任务状态修改为 <workstatus :status="log.after.current_state" style="margin-left: 5px" />
		</span>
    <span v-if="appointedChanged">
      变更了该工作负责人
    </span>
    <span v-if="checkChanged">
      变更了该工作审核人
    </span>
    <span v-if="detailChanged">
      编辑了该工作内容
    </span>
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
    }
  },
  components : {
    workstatus : WorkStatus
  },
  mounted(){
    if(!this.log.before){
      this.create = true
    }else{
      Object.keys(this.log.after).map( key =>{
          if(key === 'current_status'){
            this.currentStateChanged = true
          }else if(key === 'appointed_user'){
            this.appointedChanged = true
          }else if(key === 'check_user'){
            this.checkChanged = true
          }else{
            this.detailChanged = true
          }
      })
    }
  },
  computed:{

  },
  methods:{

  }

 }
</script>
<style scoped>
.log_text{
  padding-left:15px;
  color:#666;
}
.log_text>>>span{
  padding:4px 0;
  display:block;
}
</style>
<template>
	<div class="log_text">
		<span v-if="log.action=='work/create'">
			创建了该项任务
		</span>
		<span v-else-if="log.action=='work/update' && log.value.status">
			将任务状态修改为 <workstatus :status="log.value.status" style="margin-left: 5px" />
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
  components : {
    workstatus : WorkStatus
  },

 }
</script>
<style scoped>
.log_text{
  padding-left:15px;
}
</style>
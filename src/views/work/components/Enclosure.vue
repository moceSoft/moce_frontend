<template>
	<div class="enclosure">
		<div class="preview">
      <svg-icon icon-class="excel" v-if="file.type=='xlsx'" style="font-size:40px;color:#A7A7A7" /> 
      <svg-icon icon-class="word" v-else-if="file.type=='docx'" /> 
      <img :src="file.url" v-else-if="file.type=='img'" /> 
      <svg-icon icon-class="file" v-else /> 
    </div>
    <div class="filename">
      {{file.name}}
    </div>
    <div class="filetime">
      {{file.timestamp | formatTime}}
    </div>
	</div>
</template>

<script>
import { parseTime, formatTime } from '@/utils'

export default {
  name: 'Enclosure',
  props : {
  	file :{
  		type : Object
  	}
  },
  computed: {
  },
 }
</script>
<style scoped>
.enclosure{
  width:100%;
  display: flex;
  flex-direction: column;
  border:1px solid #D7D7D7;
  border-radius: 4px;
  cursor: pointer;
}
.enclosure:hover{
  border-color:#409EFF;
  color:#409EFF;
}
.enclosure>.preview{
  width:100%;
  height:120px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
}

.enclosure>.preview>img{
    max-width:100%;
    max-height:120px;
}

.filename{
  height:30px;
  padding:10px 15px;
  color:#656565;
  text-overflow: ellipsis;
  font-size:14px;
}
.filetime{
  height:20px;
  padding:0 15px;
  font-size:12px;
  color:#959559;
}
</style>
<template>
  <div v-loading="loading">
    <span style="color:#656565;font-size:15px">操作记录</span>
    <el-row :gutter="4" style="padding-top:20px">
      <el-col :md="24" :xs="24" >
        <el-timeline>
          <el-timeline-item
            v-for="(log, index) in logs"
            :key="index"
            :timestamp="log.operate_time | parseTime('{y}年{m}月{d}日 {h}:{i}')">
            <div class="log_item">
              <div class="log_avatar">
                <avatar :avatar="log.avatar" :sex="parseInt(log.sex)" size=30 />
                <div class="log_user_name">{{log.name}}</div>
              </div>
              <log-item :log="log" />
            </div>
          </el-timeline-item>
        </el-timeline>

        <div class="pager" v-if="pageCount > 1">
          <el-button type="primary" size="small" icon="el-icon-arrow-left" :disabled="query.page < 2">上一页</el-button>
          <div>{{query.page}} / {{pageCount}}</div>
          <el-button type="primary" size="small" :disabled="query.page >= pageCount" >下一页<i class="el-icon-arrow-right el-icon--right" ></i></el-button>
        </div>
      </el-col>
    </el-row>
    
  </div>
</template>

<script>
import Avatar from '@/components/Avatar'
import LogItem from './LogItem'
import { getLog } from '@/api/work'

export default {
  name : 'Log',
  components : {
    Avatar,
    LogItem,
  },
  props : {
    id : {
      type : Number
    }
  },
  data(){
    return {
      logs : [],
      query : {
        page : 1,
        pageSize : 8
      },
      count : 0,
      loading: true
    }
  },
  mounted(){
    console.log(this.id)
    this.getLog()
  },
  computed:{
    pageCount : function(){
      return Math.ceil(this.count / this.query.pageSize)
    }
  },
  methods:{
    getLog(){
      this.loading = true
      getLog(this.id, this.query).then(response=>{
        this.logs = response.data.list
        this.count = response.data.count
        this.loading = false
      }).catch(error=>{
        this.loading = false
      })
    }
  }
}
</script>
<style scoped>

.log_item{
  display: flex;
  align-items: center;
}
.log_item .log_avatar{
  text-align: center;
  display: inline-block;
}
.pager{
  display: flex;
  justify-content: space-between;
  align-items: center;
}

</style>
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
              <log-item :log="log" v-on:show-detail="showDetail(log)"/>
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
    <el-dialog
      title="详细日志"
      :visible.sync="visible"
      width="600px">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">关 闭</el-button>
      </span>
    </el-dialog>

    
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
      loading: true,
      visible: false
    }
  },
  mounted(){
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
    },
    showDetail(log){
      this.visible = true
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
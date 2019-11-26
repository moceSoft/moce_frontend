<template>
  <div class="app-container">
    <el-table
      :data="list"
      style="width: 100%">
      <el-table-column
        prop="id"
        label="#编号"
        width="100">
        <template slot-scope="{row}">
          #{{row.id}}
        </template>
      </el-table-column>
      <el-table-column
        prop="title"
        label="工作主题"
        width="180">
      </el-table-column>

      <el-table-column
        prop="rate"
        label="工作评级">
        <template slot-scope="{row}">    
          <el-rate
            v-model="row.rate"
            disabled
            text-color="#ff9900"
            score-template="{value}">
          </el-rate>
        </template>
      </el-table-column>

      <el-table-column
        prop="status"
        label="当前状态">
        <template slot-scope="scope">
          <workstatus :status="scope.row.status"> 
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="240" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <router-link :to="'/user/view/'+row.id">
            <el-button   size="mini" >
              查看
            </el-button>
          </router-link>
          <router-link :to="'/user/update/'+row.id">
            <el-button type="primary" plain size="mini">
              编辑
            </el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import WorkStatus from './components/WorkStatus'

export default {
  name: 'WorkList',
  components : {
    workstatus : WorkStatus
  },
  data() {
    return {
      list:[
        {
          id: 1,
          title : 'test',
          parent : {

          },
          rank : 3,
          need_check : 0,
          need_report : 0,
          end_time : 0,
          status : 0
        }
      ]
    }
  },
  methods: {
    handleCopy(text, event) {
      clip(text, event)
    },
    clipboardSuccess() {
      this.$message({
        message: 'Copy successfully',
        type: 'success',
        duration: 1500
      })
    }
  }
}
</script>

